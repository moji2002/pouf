/* Whole-site UI safety review: every docs page, block, and template at desktop
 * and phone widths, in both themes. It catches the integration defects that a
 * component snapshot cannot: horizontal overflow, unnamed controls, undersized
 * standalone targets, pastel text contrast, theme metadata drift, and runtime
 * errors after client:visible islands hydrate.
 *
 *   BASE=http://127.0.0.1:4321 node scripts/review-ui.mjs
 */
import fs from 'node:fs'
import { chromium } from 'playwright'

const BASE = process.env.BASE ?? 'http://127.0.0.1:4321'
const blockData = fs.readFileSync(new URL('../../www/src/data/blocks.ts', import.meta.url), 'utf8')
const [templateSource, blockSource = ''] = blockData.split('/** Sections: drop one')
const slugs = (source) => [...source.matchAll(/slug:\s*'([^']+)'/g)].map((match) => match[1])

const PAGES = [
  ['home', '/'],
  ['docs', '/docs/'],
  ['components', '/components/'],
  ['blocks', '/blocks/'],
  ['templates', '/examples/'],
  ['theme', '/theme/'],
  ['changelog', '/changelog/'],
  ['not-found', '/definitely-not-a-page/'],
  ...slugs(templateSource).map((slug) => [`template:${slug}`, `/examples/${slug}/`]),
  ...slugs(blockSource).map((slug) => [`block:${slug}`, `/blocks/${slug}/`]),
]

const VIEWPORTS = [
  ['desktop', 1440, 900],
  ['mobile', 390, 844],
]
const THEMES = ['light', 'dark']
const browser = await chromium.launch()
const findings = []

for (const theme of THEMES) {
  for (const [viewportName, width, height] of VIEWPORTS) {
    for (const [name, path] of PAGES) {
      const page = await browser.newPage({
        viewport: { width, height },
        deviceScaleFactor: 1,
        isMobile: viewportName === 'mobile',
        hasTouch: viewportName === 'mobile',
      })
      const runtime = []
      page.on('pageerror', (error) => runtime.push(error.message))
      page.on('console', (message) => {
        if (message.type() === 'error') runtime.push(message.text())
      })
      await page.addInitScript((value) => localStorage.setItem('pouf-theme', value), theme)
      await page.goto(BASE + path, { waitUntil: 'networkidle' })
      const preview = page.locator('article .cushion').first()
      if (await preview.count()) {
        await preview.scrollIntoViewIfNeeded()
        await page.waitForTimeout(450)
      }

      const report = await page.evaluate(({ expectedTheme, viewportWidth }) => {
        const visible = (element) => {
          const rect = element.getBoundingClientRect()
          const style = getComputedStyle(element)
          return (
            rect.width > 0 &&
            rect.height > 0 &&
            style.visibility !== 'hidden' &&
            style.display !== 'none' &&
            style.opacity !== '0' &&
            element.getAttribute('aria-hidden') !== 'true'
          )
        }
        const labelFor = (element) =>
          element.getAttribute('aria-label') ||
          element.getAttribute('aria-labelledby') ||
          (element.labels?.length ? 'labelled' : '') ||
          (element.textContent ?? '').trim()
        const rgb = (value) => {
          const parts = value.match(/[\d.]+/g)?.map(Number)
          return parts && parts.length >= 3 ? parts.slice(0, 3) : null
        }
        const luminance = (color) => {
          const channels = color.map((channel) => {
            const value = channel / 255
            return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
          })
          return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
        }
        const contrast = (a, b) => {
          const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x)
          return (light + 0.05) / (dark + 0.05)
        }
        const accentColors = new Set([
          '255,179,209',
          '201,168,255',
          '158,200,255',
          '168,240,208',
          '255,229,138',
          '255,179,138',
        ])

        const unnamed = []
        for (const element of document.querySelectorAll('button, input:not([type="hidden"]), textarea, select')) {
          if (!visible(element)) continue
          if (!labelFor(element)) unnamed.push(element.outerHTML.slice(0, 120))
        }

        const tinyTargets = []
        for (const element of document.querySelectorAll('a, button, input, textarea, select, [role="option"], [role="tab"]')) {
          if (!visible(element)) continue
          const rect = element.getBoundingClientRect()
          const style = getComputedStyle(element)
          if (style.opacity === '0' || element.getAttribute('aria-hidden') === 'true') continue
          const parentDisplay = element.parentElement ? getComputedStyle(element.parentElement).display : ''
          const inlineLink =
            element.tagName === 'A' &&
            style.display.startsWith('inline') &&
            /^(P|LI|SPAN|TD|H1|H2|H3|H4)$/.test(element.parentElement?.tagName ?? '') &&
            parentDisplay.startsWith('block')
          if (!inlineLink && (rect.width < 24 || rect.height < 24)) {
            tinyTargets.push(`${element.tagName.toLowerCase()} "${labelFor(element).slice(0, 30)}" ${Math.round(rect.width)}×${Math.round(rect.height)}`)
          }
        }

        const lowAccentContrast = []
        for (const element of document.querySelectorAll('body *')) {
          if (!visible(element)) continue
          const directText = [...element.childNodes]
            .filter((node) => node.nodeType === Node.TEXT_NODE)
            .map((node) => node.textContent ?? '')
            .join('')
            .trim()
          if (!directText) continue
          let surface = element
          let background = null
          for (let depth = 0; surface && depth < 8; depth += 1, surface = surface.parentElement) {
            const backgroundValue = getComputedStyle(surface).backgroundColor
            const values = backgroundValue.match(/[\d.]+/g)?.map(Number)
            const alpha = values && values.length > 3 ? values[3] : 1
            if (!values || alpha === 0) continue
            /* A translucent tint does not become its raw RGB value on screen;
             * keep walking to the opaque surface underneath. This audit is
             * intentionally about text placed directly on palette accents. */
            if (alpha < 0.99) continue
            const candidate = values.slice(0, 3)
            if (accentColors.has(candidate.join(','))) background = candidate
            /* The first painted surface owns the contrast. Do not keep walking
             * through an opaque white card to an unrelated accent ancestor. */
            break
          }
          if (!background) continue
          const foreground = rgb(getComputedStyle(element).color)
          if (!foreground) continue
          const ratio = contrast(foreground, background)
          if (ratio < 4.5) {
            lowAccentContrast.push(`${element.tagName.toLowerCase()} "${directText.slice(0, 38)}" ${ratio.toFixed(2)}:1`)
          }
        }

        const root = document.documentElement
        return {
          theme: root.dataset.theme,
          themeColor: document.querySelector('meta[name="theme-color"]')?.getAttribute('content'),
          overflow: Math.max(0, root.scrollWidth - root.clientWidth),
          overflowers: [...document.querySelectorAll('body *')]
            .filter((element) => {
              if (!visible(element)) return false
              const rect = element.getBoundingClientRect()
              if (rect.right <= viewportWidth + 1) return false
              let parent = element.parentElement
              while (parent && parent !== document.body) {
                const style = getComputedStyle(parent)
                if (['auto', 'scroll', 'hidden', 'clip'].includes(style.overflowX) || style.position === 'fixed') return false
                parent = parent.parentElement
              }
              return getComputedStyle(element).position !== 'fixed'
            })
            .slice(0, 4)
            .map((element) => `${element.tagName.toLowerCase()}.${String(element.className).slice(0, 60)}`),
          unnamed: unnamed.slice(0, 6),
          tinyTargets: tinyTargets.slice(0, 6),
          lowAccentContrast: [...new Set(lowAccentContrast)].slice(0, 8),
          expectedTheme,
        }
      }, { expectedTheme: theme, viewportWidth: width })

      const expectedColor = theme === 'dark' ? '#12111a' : '#f0e9ff'
      if (report.theme !== theme) findings.push({ theme, viewportName, name, kind: 'theme', detail: report.theme })
      if (report.themeColor !== expectedColor) findings.push({ theme, viewportName, name, kind: 'theme-color', detail: report.themeColor })
      if (report.overflow > 1) findings.push({ theme, viewportName, name, kind: `overflow ${report.overflow}px`, detail: report.overflowers })
      if (report.unnamed.length) findings.push({ theme, viewportName, name, kind: 'unnamed controls', detail: report.unnamed })
      if (report.tinyTargets.length) findings.push({ theme, viewportName, name, kind: 'small targets', detail: report.tinyTargets })
      if (report.lowAccentContrast.length) findings.push({ theme, viewportName, name, kind: 'accent contrast', detail: report.lowAccentContrast })
      const relevantRuntime = name === 'not-found'
        ? runtime.filter((message) => !message.includes('404 (Not Found)'))
        : runtime
      if (relevantRuntime.length) findings.push({ theme, viewportName, name, kind: 'runtime', detail: [...new Set(relevantRuntime)].slice(0, 5) })
      console.log(`${theme.padEnd(5)} ${viewportName.padEnd(7)} ${name}`)
      await page.close()
    }
  }
}

await browser.close()
console.log('\n===== UI REVIEW =====')
if (findings.length === 0) {
  console.log(`PASS — ${PAGES.length * VIEWPORTS.length * THEMES.length} page/theme/viewport combinations`)
} else {
  for (const finding of findings) {
    console.log(`${finding.theme}/${finding.viewportName} ${finding.name} — ${finding.kind}: ${JSON.stringify(finding.detail)}`)
  }
  console.log(`\n${findings.length} finding(s)`)
  process.exitCode = 1
}
