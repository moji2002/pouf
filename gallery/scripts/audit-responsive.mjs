/* Screenshots every page at desktop and mobile, and flags layout defects that
 * are easy to miss by eye — chiefly horizontal overflow, which shows up as a
 * page you can scroll sideways and is almost always a fixed width or a
 * non-collapsing grid.
 *
 * Run from inside gallery/ (playwright resolves from the script's directory):
 *   SHOOT_OUT=/some/dir node scripts/audit-responsive.mjs
 */
import { chromium } from 'playwright'

const OUT = process.env.SHOOT_OUT ?? new URL('../../.shots', import.meta.url).pathname
const BASE = process.env.BASE ?? 'http://localhost:4821'

const PAGES = [
  ['home', '/'],
  ['docs', '/docs/'],
  ['components', '/components/'],
  ['blocks', '/blocks/'],
  ['templates', '/examples/'],
  ['theme', '/theme/'],
  ['changelog', '/changelog/'],
  ['tpl-dashboard', '/examples/dashboard/'],
  ['tpl-inbox', '/examples/inbox/'],
  ['tpl-landing', '/examples/landing/'],
  ['tpl-storefront', '/examples/storefront/'],
  ['tpl-support', '/examples/support/'],
  ['blk-login', '/blocks/login/'],
  ['blk-music', '/blocks/music/'],
]

const VIEWPORTS = [
  ['desktop', 1440, 900],
  ['mobile', 390, 844],
]

const browser = await chromium.launch()
const issues = []

for (const [vpName, width, height] of VIEWPORTS) {
  for (const [name, path] of PAGES) {
    const page = await browser.newPage({
      viewport: { width, height },
      deviceScaleFactor: 1,
      isMobile: vpName === 'mobile',
      hasTouch: vpName === 'mobile',
    })
    await page.goto(BASE + path, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1200)

    const report = await page.evaluate((vw) => {
      const de = document.documentElement
      const out = {
        scrollWidth: de.scrollWidth,
        clientWidth: de.clientWidth,
        scrollHeight: de.scrollHeight,
        overflowers: [],
        tinyTargets: [],
      }
      // Which elements actually stick out past the viewport?
      for (const el of document.querySelectorAll('body *')) {
        const r = el.getBoundingClientRect()
        if (r.width === 0 || r.height === 0) continue
        const style = getComputedStyle(el)
        if (style.position === 'fixed') continue
        if (r.right > vw + 1) {
          /* Ignore anything an ancestor already clips. getBoundingClientRect
           * reports the geometric box even when it is visually cut off, so
           * `hidden` matters as much as `auto|scroll` — without it the fixed,
           * overflow:hidden decorative blob layer reads as a page-wide
           * overflow on every single page. */
          let p = el.parentElement, clipped = false
          while (p && p !== document.body) {
            const ps = getComputedStyle(p)
            if (['auto', 'scroll', 'hidden', 'clip'].includes(ps.overflowX)) { clipped = true; break }
            if (ps.position === 'fixed') { clipped = true; break }
            p = p.parentElement
          }
          if (!clipped) {
            out.overflowers.push({
              tag: el.tagName.toLowerCase(),
              cls: (el.className || '').toString().slice(0, 50),
              right: Math.round(r.right),
              width: Math.round(r.width),
            })
          }
        }
      }
      /* Touch targets below the 24px WCAG 2.2 AA minimum (SC 2.5.8), with the
       * two exemptions the SC itself grants — otherwise this reports noise:
       *   - "Inline": a link inside a sentence is exempt, and prose is full of
       *     them.
       *   - Visually-hidden proxies: Radix renders an opacity:0, aria-hidden
       *     native <input> beside every switch/checkbox/radio. The real target
       *     is the visible control next to it. */
      for (const el of document.querySelectorAll('a, button, input, [role="tab"], [role="option"]')) {
        const r = el.getBoundingClientRect()
        if (r.width === 0 || r.height === 0) continue
        const cs = getComputedStyle(el)
        if (cs.opacity === '0' || cs.visibility === 'hidden') continue
        if (el.getAttribute('aria-hidden') === 'true') continue
        const parentDisplay = el.parentElement ? getComputedStyle(el.parentElement).display : ''
        const inSentence =
          el.tagName === 'A' &&
          cs.display.startsWith('inline') &&
          /^(P|LI|SPAN|TD|H1|H2|H3|H4)$/.test(el.parentElement?.tagName ?? '') &&
          parentDisplay.startsWith('block')
        if (inSentence) continue
        if (r.height < 24 || r.width < 24) {
          out.tinyTargets.push({
            tag: el.tagName.toLowerCase(),
            text: (el.textContent || '').trim().slice(0, 24),
            w: Math.round(r.width), h: Math.round(r.height),
          })
        }
      }
      /* Sticky/fixed panels covering body text. Overflow and target-size checks
       * both miss this: a sticky sidebar whose `display:none` breakpoint was
       * defeated by source order still measures fine — it just sits on top of
       * the article. Compares against text-bearing elements that are neither
       * its ancestors nor its descendants. */
      const overlaps = []
      const floats = [...document.querySelectorAll('body *')].filter((el) => {
        const cs = getComputedStyle(el)
        if (cs.position !== 'sticky' && cs.position !== 'fixed') return false
        /* Decorative layers sit BEHIND the text and cannot obscure it — the
         * blurred blob field is fixed inset:0 across every page and would
         * otherwise report an overlap on all of them. */
        if (cs.pointerEvents === 'none') return false
        if (el.getAttribute('aria-hidden') === 'true') return false
        return el.getBoundingClientRect().height > 40
      })
      const texts = [...document.querySelectorAll('p, li, h1, h2, h3, pre, td')].filter(
        (el) => (el.textContent || '').trim().length > 20,
      )
      for (const f of floats) {
        const fr = f.getBoundingClientRect()
        if (fr.height === 0) continue
        for (const t of texts) {
          if (f.contains(t) || t.contains(f)) continue
          const tr = t.getBoundingClientRect()
          if (tr.height === 0) continue
          const ox = Math.min(fr.right, tr.right) - Math.max(fr.left, tr.left)
          const oy = Math.min(fr.bottom, tr.bottom) - Math.max(fr.top, tr.top)
          if (ox > 40 && oy > 20) {
            overlaps.push({
              floatCls: (f.className || '').toString().slice(0, 40),
              over: (t.textContent || '').trim().slice(0, 34),
              area: Math.round(ox * oy),
            })
            break
          }
        }
      }
      out.overlaps = overlaps.slice(0, 4)

      out.overflowers = out.overflowers.slice(0, 6)
      out.tinyTargets = out.tinyTargets.slice(0, 6)
      return out
    }, width)

    const overflow = report.scrollWidth - report.clientWidth
    if (overflow > 1) {
      issues.push({ page: name, vp: vpName, kind: 'h-overflow', px: overflow, who: report.overflowers })
    }
    if (report.tinyTargets.length) {
      issues.push({ page: name, vp: vpName, kind: 'small-target', who: report.tinyTargets })
    }
    if (report.overlaps?.length) {
      issues.push({ page: name, vp: vpName, kind: 'overlap', who: report.overlaps })
    }

    await page.screenshot({ path: `${OUT}/${vpName}-${name}-top.png` })
    const mid = Math.min(Math.round(report.scrollHeight / 2), 2400)
    if (report.scrollHeight > height * 1.6) {
      await page.evaluate((y) => window.scrollTo(0, y), mid)
      await page.waitForTimeout(500)
      await page.screenshot({ path: `${OUT}/${vpName}-${name}-mid.png` })
    }

    console.log(
      `${vpName.padEnd(7)} ${name.padEnd(14)} h=${String(report.scrollHeight).padStart(5)} ` +
      `overflow=${overflow > 1 ? `${overflow}px ⚠` : 'none'}` +
      `${report.tinyTargets.length ? `  small-targets=${report.tinyTargets.length} ⚠` : ''}` +
      `${report.overlaps?.length ? `  overlaps=${report.overlaps.length} ⚠` : ''}`,
    )
    await page.close()
  }
}

await browser.close()

console.log('\n===== ISSUES =====')
if (!issues.length) console.log('none')
for (const i of issues) {
  console.log(`\n[${i.vp}] ${i.page} — ${i.kind}${i.px ? ` (${i.px}px)` : ''}`)
  for (const w of i.who) console.log('   ', JSON.stringify(w))
}
