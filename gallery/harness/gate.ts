// gallery/harness/gate.ts — the snapshot-equivalence gate.
//
// Run with:  bun run gate            (or: bun gallery/harness/gate.ts)
//            bun run gate:golden     (writes golden/**)
//            ... -- --only <component>   (filters to one key of allDemos)
//
// One command, no manual setup: this file starts the gallery's Vite dev
// server itself, waits for it to answer, drives every demo through Chromium,
// and tears the server down again on the way out (success, failure, or
// Ctrl-C).
import { chromium, type Page } from 'playwright'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { allDemos } from '../../registry/pouf/demos'
import type { DemoState } from '../../registry/pouf/demos/types'

const argv = process.argv
const WRITE = argv.includes('--write-golden')
const onlyIndex = argv.indexOf('--only')
const only: string | null = onlyIndex !== -1 ? (argv[onlyIndex + 1] ?? null) : null
/* --json-only compares computed styles but not pixels. The computed-style
 * layer is platform-stable; the PNG layer is not (font hinting and
 * anti-aliasing differ macOS↔linux). CI runs --json-only against the
 * committed (macOS-captured) goldens so it still catches real regressions
 * without a per-OS golden set. */
const JSON_ONLY = argv.includes('--json-only')

const PORT = 4700
const BASE = `http://localhost:${PORT}`
const GALLERY_DIR = join(import.meta.dir, '..')
const GOLDEN = join(import.meta.dir, 'golden')
const CAND = join(import.meta.dir, '.candidate')

// Transitions/CSS animations frozen so a mid-transition frame never gets
// captured; the blinking caret is disabled the same way. This does NOT touch
// JS-driven animation (framer-motion, Recharts' mount-in animation) — those
// are handled below by actually waiting for them to finish (see `settle`).
const FREEZE = `*,*::before,*::after{transition:none!important;animation-duration:0s!important;animation-delay:0s!important;caret-color:transparent!important}`

/* ------------------------------------------------------------------ */
/* Gallery dev server lifecycle                                        */
/* ------------------------------------------------------------------ */

async function waitForServerUp(url: string, timeoutMs: number): Promise<void> {
  const start = Date.now()
  let lastErr: unknown
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url)
      if (res.ok) return
    } catch (err) {
      lastErr = err
    }
    await new Promise((r) => setTimeout(r, 150))
  }
  throw new Error(`gallery dev server never answered at ${url} within ${timeoutMs}ms (${String(lastErr)})`)
}

const server = Bun.spawn({
  cmd: ['bun', 'run', 'dev'],
  cwd: GALLERY_DIR,
  stdout: 'pipe',
  stderr: 'pipe',
  env: { ...process.env, PORT: String(PORT) },
})

let serverKilled = false
function killServer() {
  if (serverKilled) return
  serverKilled = true
  if (!server.killed) server.kill()
}
process.on('exit', killServer)
process.on('SIGINT', () => { killServer(); process.exit(130) })
process.on('SIGTERM', () => { killServer(); process.exit(143) })

/* ------------------------------------------------------------------ */
/* capture.ts, bundled once and injected into every page               */
/* ------------------------------------------------------------------ */

async function bundleCaptureScript(): Promise<string> {
  const result = await Bun.build({
    entrypoints: [join(import.meta.dir, 'capture.ts')],
    format: 'iife',
    target: 'browser',
  })
  if (!result.success || !result.outputs[0]) {
    for (const log of result.logs) console.error(log)
    throw new Error('failed to bundle gallery/harness/capture.ts')
  }
  return result.outputs[0].text()
}

/* ------------------------------------------------------------------ */
/* Snapshot + diff                                                     */
/* ------------------------------------------------------------------ */

type StyleSnapshot = Record<string, Record<string, string>>

/** Waits past every known delayed-open interaction (HoverCard's 300ms
 * openDelay, Progress's implicit mount-in spring — measured empirically at
 * ~650-750ms to hard-settle at its rest value), then polls the demo root's
 * markup until it stops changing — a generic detector for "an animation
 * (framer-motion spring, Recharts' mount-in growth) is still running",
 * since the CSS FREEZE rule above can't reach JS-driven style/attribute
 * writes.
 *
 * A single matching pair of samples isn't enough proof of rest: on a fast,
 * steep decay curve (Progress animating toward 0 is the case that actually
 * flagged this) two polls spaced 150ms apart can coincidentally round to the
 * same displayed value while the value is still moving, and *which* residual
 * value that coincidence lands on shifts with ordinary page-load timing
 * jitter — differing between the golden run and a later gate run even though
 * neither is "wrong". Requiring three consecutive identical reads makes that
 * coincidence require two matches in a row instead of one, which is what
 * turned this from a rare flake back into "GATE CLEAN" on repeat runs. */
async function settle(page: Page): Promise<void> {
  await page.waitForTimeout(900)
  let prev: string | null = null
  let stableStreak = 0
  const start = Date.now()
  while (Date.now() - start < 3500) {
    /* Body-wide, not demo-root-only: Radix portals mount outside the demo
     * root and must also be stable before we capture. */
    const cur = await page.evaluate(() => document.body.innerHTML)
    if (cur === prev) {
      stableStreak++
      if (stableStreak >= 2) return
    } else {
      stableStreak = 0
    }
    prev = cur
    await page.waitForTimeout(150)
  }
}

async function snap(page: Page, dir: string, component: string, id: string, state: string): Promise<void> {
  mkdirSync(join(dir, component), { recursive: true })
  const styles = await page.evaluate<StyleSnapshot>(() =>
    (window as unknown as { captureComputedStyles: () => StyleSnapshot }).captureComputedStyles(),
  )
  writeFileSync(join(dir, component, `${id}.${state}.json`), JSON.stringify(styles, null, 1))
  /* Viewport shot, not an element shot: fixed bars (BottomNav) and Radix
   * portals (dialogs, menus) live outside [data-demo-root]'s box and were
   * invisible to an element screenshot. */
  const png = await page.screenshot({ animations: 'disabled' })
  writeFileSync(join(dir, component, `${id}.${state}.png`), png)
}

/* The only properties measured from text rather than computed from the
 * stylesheet: a box that shrink-wraps its label, plus the two origins that are
 * just 50% of that box resolved to px. Everything else comes straight from CSS
 * and is identical everywhere, so it stays an exact comparison.
 *
 * Evidence-based, not defensive: across every CI run only these four differed,
 * and only in their x component — the y components ("11.25px", "14px") matched
 * exactly, which is what proves heights are stable and the variance is purely
 * horizontal text advance. */
const TEXT_SIZED_PROPS = new Set(['width', 'inline-size', 'perspective-origin', 'transform-origin'])

/* Chromium quantises glyph advances per platform: macOS keeps them fractional
 * (75.9688px), Linux rounds to whole pixels (77px). It is not a setting —
 * --disable-font-subpixel-positioning and --disable-lcd-text were both tried
 * and neither changes the macOS numbers.
 *
 * 2px, and only because the residual is now genuinely sub-pixel rounding.
 * Before the font-family fix these same properties differed by 5-21% — a whole
 * different typeface, because 'Nunito' matched no @font-face and each OS fell
 * back differently — and a tolerance then would have hidden a real bug. With
 * the webfont actually rendering, the largest observed spread is 1.63px.
 * Anything a regression does here is far larger; the harness's own sabotage
 * test moves 1453 pixels. */
const SUBPIXEL_TOLERANCE_PX = 2

function withinSubpixelTolerance(a: string, b: string): boolean {
  const NUM = /-?\d+(?:\.\d+)?/g
  /* The non-numeric skeleton must match exactly, so "10px 5px" can never be
   * considered equal to "10% 5px" or to a value with a different token count. */
  if (a.replace(NUM, '#') !== b.replace(NUM, '#')) return false
  const na = a.match(NUM)
  const nb = b.match(NUM)
  if (!na || !nb || na.length !== nb.length) return false
  return na.every((v, i) => Math.abs(parseFloat(v) - parseFloat(nb[i]!)) <= SUBPIXEL_TOLERANCE_PX)
}

function diffJson(component: string, file: string): string[] {
  const g: StyleSnapshot = JSON.parse(readFileSync(join(GOLDEN, component, file), 'utf8'))
  const c: StyleSnapshot = JSON.parse(readFileSync(join(CAND, component, file), 'utf8'))
  const problems: string[] = []
  for (const key of new Set([...Object.keys(g), ...Object.keys(c)])) {
    const gEl = g[key]
    const cEl = c[key]
    if (!gEl) { problems.push(`${key}: element added`); continue }
    if (!cEl) { problems.push(`${key}: element removed`); continue }
    for (const prop of new Set([...Object.keys(gEl), ...Object.keys(cEl)])) {
      if (gEl[prop] === cEl[prop]) continue
      /* Only in --json-only (CI, comparing across platforms). A local run still
       * demands exact equality AND diffs the pixels, so nothing is lost on the
       * machine where the goldens were captured. */
      if (
        JSON_ONLY &&
        TEXT_SIZED_PROPS.has(prop.replace(/^::(?:before|after)/, '')) &&
        withinSubpixelTolerance(gEl[prop]!, cEl[prop]!)
      )
        continue
      problems.push(`${key} ${prop}: "${gEl[prop]}" → "${cEl[prop]}"`)
    }
  }
  return problems
}

function diffPixels(component: string, file: string): number {
  const g = PNG.sync.read(readFileSync(join(GOLDEN, component, file)))
  const c = PNG.sync.read(readFileSync(join(CAND, component, file)))
  if (g.width !== c.width || g.height !== c.height) return Number.MAX_SAFE_INTEGER
  // threshold: 0 (bit-exact) sounded right for a golden-vs-golden comparison, but it isn't:
  // headless Chromium's rasterizer has a few units of genuine per-run jitter in anti-aliased
  // curves (rounded corners, e.g. progress/zero's pill track) — 1-8 out of 255 on a handful
  // of edge pixels, reproduced with computed styles at 0 diff and a stable JSON snapshot.
  // pixelmatch's own default (0.1) is the standard "ignore anti-aliasing noise, still catch
  // real differences" threshold — the padding sabotage in the harness's smoke test produced a
  // 1453px diff, three orders of magnitude past anything this absorbs.
  return pixelmatch(g.data, c.data, undefined, g.width, g.height, { threshold: 0.1 })
}

/* ------------------------------------------------------------------ */
/* Interaction states                                                  */
/* ------------------------------------------------------------------ */

type StateHandler = [string, (p: Page) => Promise<void>]

function stateHandlers(states: DemoState[] | undefined): StateHandler[] {
  const out: StateHandler[] = [['default', async () => {}]]
  for (const s of states ?? []) {
    if (s === 'hover') out.push(['hover', (p) => p.hover('[data-subject]')])
    if (s === 'focus') out.push(['focus', (p) => p.keyboard.press('Tab')])
    if (s === 'active') out.push(['active', async (p) => {
      const box = await p.locator('[data-subject]').boundingBox()
      if (!box) throw new Error('active state: [data-subject] has no bounding box')
      await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
      await p.mouse.down()
    }])
  }
  return out
}

/* ------------------------------------------------------------------ */
/* Main                                                                 */
/* ------------------------------------------------------------------ */

async function main(): Promise<number> {
  await waitForServerUp(BASE, 30_000)
  const captureScript = await bundleCaptureScript()

  const browser = await chromium.launch()
  let failures = 0
  let demoCount = 0

  try {
    for (const [component, demos] of Object.entries(allDemos)) {
      if (only && component !== only) continue
      for (const demo of demos) {
        demoCount++
        const vp = demo.viewport === 'mobile' ? { width: 390, height: 844 } : { width: 1280, height: 800 }
        const page = await browser.newPage({ viewport: vp })
        try {
          await page.goto(`${BASE}/#/${component}/${demo.id}`)
          await page.addScriptTag({ content: captureScript })
          await page.addStyleTag({ content: FREEZE })
          /* document.fonts.ready ALONE is a race, and it is the race that made
           * this gate platform-dependent. It resolves as soon as font loading
           * is idle — which is immediately, if nothing has requested the face
           * yet. fontsource ships font-display:swap, so the first frames are
           * drawn in a system fallback and the real face swaps in later. That
           * swap reflows every text-derived width, and settle() cannot see it
           * because swapping a font does not change innerHTML.
           *
           * load() actually requests the face and resolves when it is usable.
           * The assert then refuses to compare rather than silently measuring a
           * fallback: the original symptom was ~168 demos differing by +5% to
           * +21% per string, and "variable per string" is the signature of a
           * different typeface, not of hinting. */
          await page.evaluate(async () => {
            await Promise.all([
              document.fonts.load('400 16px "Nunito Variable"'),
              document.fonts.load('800 16px "Nunito Variable"'),
            ])
            await document.fonts.ready
          })
          const fontReady = await page.evaluate(() =>
            document.fonts.check('800 16px "Nunito Variable"'),
          )
          if (!fontReady)
            throw new Error(
              'gate: "Nunito Variable" is not loaded. Every text-derived width would be ' +
                'measured against a system fallback, which differs per OS. Refusing to compare.',
            )

          for (const [name, apply] of stateHandlers(demo.states)) {
            await apply(page)
            await settle(page)
            await snap(page, WRITE ? GOLDEN : CAND, component, demo.id, name)
            if (name === 'active') await page.mouse.up()

            if (!WRITE) {
              const jsonFile = `${demo.id}.${name}.json`
              if (!existsSync(join(GOLDEN, component, jsonFile))) {
                console.log(`MISSING GOLDEN ${component}/${jsonFile}`)
                failures++
                continue
              }
              const problems = diffJson(component, jsonFile)
              const px = JSON_ONLY ? 0 : diffPixels(component, `${demo.id}.${name}.png`)
              if (problems.length || px > 0) {
                failures++
                /* Var ADDITIONS (…: "undefined" → …) are the inert @theme/--tw
                 * vocabulary landing on every element — real diffs drown in
                 * them at a 20-line cap, so demote them below everything else. */
                const isVarAddition = (p: string) => /--[^ ]+: "undefined" →/.test(p)
                const ranked = [...problems.filter((p) => !isVarAddition(p)), ...problems.filter(isVarAddition)]
                console.log(`✗ ${component}/${demo.id} [${name}] — ${problems.length} props, ${px} px`)
                for (const p of ranked.slice(0, 30)) console.log(`   ${p}`)
              }
            }
          }
        } finally {
          await page.close()
        }
      }
    }
  } finally {
    await browser.close()
  }

  console.log(`(${demoCount} demos${only ? ` — filtered to "${only}"` : ''})`)
  console.log(WRITE ? 'goldens written' : failures ? `GATE FAILED: ${failures} snapshots differ` : 'GATE CLEAN')
  return WRITE || !failures ? 0 : 1
}

let exitCode = 1
try {
  exitCode = await main()
} finally {
  killServer()
}
process.exit(exitCode)
