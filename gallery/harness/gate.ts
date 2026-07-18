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
    const cur = await page.evaluate(() => document.querySelector('[data-demo-root]')?.innerHTML ?? '')
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
  const png = await page.locator('[data-demo-root]').screenshot({ animations: 'disabled' })
  writeFileSync(join(dir, component, `${id}.${state}.png`), png)
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
    for (const prop of new Set([...Object.keys(gEl), ...Object.keys(cEl)]))
      if (gEl[prop] !== cEl[prop]) problems.push(`${key} ${prop}: "${gEl[prop]}" → "${cEl[prop]}"`)
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
          await page.evaluate(() => document.fonts.ready)

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
              const px = diffPixels(component, `${demo.id}.${name}.png`)
              if (problems.length || px > 0) {
                failures++
                console.log(`✗ ${component}/${demo.id} [${name}] — ${problems.length} props, ${px} px`)
                for (const p of problems.slice(0, 20)) console.log(`   ${p}`)
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
