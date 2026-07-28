import { chromium } from 'playwright'
import { readFileSync } from 'node:fs'

const BASE_URL = process.env.POUF_PREVIEW_URL ?? 'http://127.0.0.1:4399'
const origin = new URL(BASE_URL).origin
const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })

const demoRoutes = JSON.parse(
  readFileSync(new URL('../../www/src/data/demo-routes.json', import.meta.url), 'utf8'),
)
const pending = ['/', ...Object.keys(demoRoutes).map((path) => `/${path}`)]
const visited = new Set()
const failures = []
const pageErrors = []
let containedDemoRoutes = 0

page.on('pageerror', (error) => pageErrors.push(`${page.url()}: ${error.message}`))

try {
  while (pending.length > 0) {
    const path = pending.shift()
    if (!path || visited.has(path)) continue
    visited.add(path)

    const response = await page.goto(new URL(path, BASE_URL).href, { waitUntil: 'networkidle' })
    if (!response || response.status() >= 400) {
      failures.push(`${path} returned ${response?.status() ?? 'no response'}`)
      continue
    }

    const finalURL = new URL(page.url())
    if (finalURL.origin !== origin) {
      failures.push(`${path} unexpectedly navigated to ${finalURL.href}`)
      continue
    }
    const demoDestination = demoRoutes[path.replace(/^\/|\/$/g, '')]
    if (demoDestination) {
      const expectedPath = new URL(demoDestination, BASE_URL).pathname.replace(/\/+$/, '') || '/'
      const actualPath = finalURL.pathname.replace(/\/+$/, '') || '/'
      if (actualPath !== expectedPath) {
        failures.push(`${path} did not resolve to ${expectedPath}; landed on ${actualPath}`)
      }
    }

    const links = await page.locator('a[href]').evaluateAll((anchors) =>
      anchors.map((anchor) => ({
        href: anchor.getAttribute('href') ?? '',
        inPreview: Boolean(anchor.closest('.block-preview-boundary')),
      })),
    )

    for (const { href, inPreview } of links) {
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) continue
      const target = new URL(href, page.url())
      if (target.origin !== origin || inPreview) continue
      const targetPath = `${target.pathname}${target.search}`
      if (!visited.has(targetPath) && !pending.includes(targetPath)) pending.push(targetPath)
    }

    const boundary = page.locator('.block-preview-boundary')
    if ((await boundary.count()) === 0) continue

    await boundary.first().scrollIntoViewIfNeeded()
    const demoLinks = boundary.locator('a[href^="/"]:not([href^="//"])')
    if ((await demoLinks.count()) === 0) continue

    await page.waitForTimeout(120)
    const urlBefore = page.url()
    await demoLinks.first().click()
    const notice = page.locator('.block-preview-notice')
    try {
      await notice.waitFor({ state: 'visible', timeout: 1500 })
    } catch {
      failures.push(`${path} did not explain its contained demo route`)
    }
    if (page.url() !== urlBefore) {
      failures.push(`${path} let a demo route escape to ${page.url()}`)
      await page.goto(urlBefore, { waitUntil: 'networkidle' })
    } else {
      containedDemoRoutes += 1
    }
  }
} finally {
  await browser.close()
}

if (pageErrors.length > 0) failures.push(...pageErrors.map((error) => `page error: ${error}`))

if (failures.length > 0) {
  console.error(`Link audit failed with ${failures.length} issue${failures.length === 1 ? '' : 's'}:`)
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log(
  `Link audit passed: ${visited.size} internal routes, ${containedDemoRoutes} preview route boundaries, 0 broken links.`,
)
