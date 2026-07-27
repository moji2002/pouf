/* Integration review for the real /components page. The isolated gallery gate
 * cannot catch page-grid compression, sticky chrome stacking above portals,
 * or demos wired to no-op state handlers. This script exercises those exact
 * contracts at the widths people browse the documentation.
 *
 *   BASE=http://127.0.0.1:4321 node scripts/review-components.mjs
 */
import fs from 'node:fs'
import { chromium } from 'playwright'

const BASE = process.env.BASE ?? 'http://127.0.0.1:4321'
const SHOT_DIR = process.env.SHOT_DIR ?? '/tmp/pouf-components-review'
fs.mkdirSync(SHOT_DIR, { recursive: true })

const browser = await chromium.launch()
const results = []
const record = (name, pass, detail = '') => {
  results.push({ name, pass, detail })
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`)
}

async function open(width, height, theme = 'light') {
  const page = await browser.newPage({ viewport: { width, height } })
  const runtime = []
  page.on('pageerror', (error) => runtime.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') runtime.push(message.text())
  })
  await page.addInitScript((value) => localStorage.setItem('pouf-theme', value), theme)
  await page.goto(`${BASE}/components/`, { waitUntil: 'networkidle' })
  return { page, runtime }
}

async function hydrate(page, selector) {
  const target = page.locator(selector)
  await target.evaluate((node) => node.scrollIntoView({ block: 'center' }))
  await page.waitForTimeout(550)
  return target
}

for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
  const { page, runtime } = await open(width, height)
  const layout = await page.evaluate(() => ({
    cards: document.querySelectorAll('[data-component-card]').length,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    hero: document.querySelector('.comp-hero')?.getBoundingClientRect().width ?? 0,
  }))
  record(`${name}: all component cards render`, layout.cards === 38, `${layout.cards} cards`)
  record(`${name}: no page-level horizontal overflow`, layout.overflow <= 1, `${layout.overflow}px`)
  const expectedHeroWidth = Math.min(width - 48, 1192)
  record(`${name}: hero uses the available viewport`, layout.hero >= expectedHeroWidth - 2, `${Math.round(layout.hero)}px`)
  record(`${name}: no runtime errors`, runtime.length === 0, runtime.join(' | '))
  await page.screenshot({ path: `${SHOT_DIR}/components-${name}-top.png`, fullPage: false })
  await page.close()
}

{
  const { page, runtime } = await open(1440, 1000, 'dark')
  await page.screenshot({ path: `${SHOT_DIR}/components-desktop-dark.png`, fullPage: false })
  record('dark: components page has no runtime errors', runtime.length === 0, runtime.join(' | '))
  await page.close()
}

{
  const { page, runtime } = await open(1440, 1000)

  await hydrate(page, '#progress')
  const progress = await page.locator('#progress').evaluate((card) => {
    const bars = [...card.querySelectorAll('.pouf-progress')].map((bar) => bar.getBoundingClientRect().width)
    const values = [...card.querySelectorAll('.pouf-text')].filter((node) => /%/.test(node.textContent ?? ''))
      .map((node) => ({ text: node.textContent, width: node.getBoundingClientRect().width, height: node.getBoundingClientRect().height }))
    return { bars, values }
  })
  record('progress: tracks use their stage width', progress.bars.length >= 3 && Math.min(...progress.bars) >= 180, `${Math.round(Math.min(...progress.bars))}px minimum`)
  record('progress: values stay on one line', progress.values.length >= 2 && progress.values.every((value) => value.height < 32), JSON.stringify(progress.values))

  await hydrate(page, '#aspect-ratio')
  const ratios = await page.locator('#aspect-ratio [data-demo-root]').evaluateAll((roots) =>
    roots.map((root) => {
      const labelled = [...root.querySelectorAll('*')].find((node) => /container/.test(node.textContent ?? ''))
      const rect = labelled?.getBoundingClientRect()
      return { text: labelled?.textContent?.trim(), width: rect?.width ?? 0, height: rect?.height ?? 0 }
    }),
  )
  record('aspect ratio: examples have visible content', ratios.length === 2 && ratios.every((ratio) => ratio.width >= 180 && ratio.height >= 100), JSON.stringify(ratios))

  await hydrate(page, '#readout')
  const readoutOverflow = await page.locator('#readout [data-demo-root]').evaluateAll((roots) =>
    roots.map((root) => root.scrollWidth - root.clientWidth),
  )
  record('stat & metric: previews do not clip', readoutOverflow.every((overflow) => overflow <= 1), JSON.stringify(readoutOverflow))

  await hydrate(page, '#navbar')
  const navbarPreviews = await page.locator('#navbar [data-demo-root]').evaluateAll((roots) =>
    roots.map((root) => {
      const nav = root.querySelector('.pouf-navbar')
      const rootRect = root.getBoundingClientRect()
      const navRect = nav?.getBoundingClientRect()
      return {
        height: Math.round(rootRect.height),
        topSpace: navRect ? Math.round(navRect.top - rootRect.top) : -1,
        bottomSpace: navRect ? Math.round(rootRect.bottom - navRect.bottom) : -1,
      }
    }),
  )
  record(
    'navbar: previews do not waste vertical space',
    navbarPreviews.length === 2 && navbarPreviews.every((preview) =>
      preview.height <= 130 &&
      preview.topSpace >= 20 &&
      preview.bottomSpace >= 20 &&
      Math.abs(preview.topSpace - preview.bottomSpace) <= 2
    ),
    JSON.stringify(navbarPreviews),
  )
  await page.screenshot({ path: `${SHOT_DIR}/components-navbar.png`, fullPage: false })

  await hydrate(page, '#slider')
  const sliderWidths = await page.locator('#slider .pouf-slider__track').evaluateAll((tracks) =>
    tracks.map((track) => Math.round(track.getBoundingClientRect().width)),
  )
  record('slider: tracks use empty stage space', sliderWidths.length >= 2 && Math.min(...sliderWidths) >= 240, JSON.stringify(sliderWidths))

  await hydrate(page, '#checkbox')
  const checkbox = page.getByRole('checkbox', { name: 'Enable notifications' }).first()
  const checkboxBefore = await checkbox.getAttribute('aria-checked')
  await checkbox.click()
  const checkboxAfter = await checkbox.getAttribute('aria-checked')
  record('checkbox: demo changes state', checkboxBefore !== checkboxAfter, `${checkboxBefore} → ${checkboxAfter}`)

  await hydrate(page, '#radio-group')
  const monthly = page.getByRole('radio', { name: 'Monthly' }).first()
  await monthly.click()
  record('radio: demo changes selection', (await monthly.getAttribute('aria-checked')) === 'true')

  await hydrate(page, '#controls')
  const switchControl = page.getByRole('switch', { name: 'Notifications' }).first()
  const switchBefore = await switchControl.getAttribute('aria-checked')
  await switchControl.click()
  record('switch: demo changes state', (await switchControl.getAttribute('aria-checked')) !== switchBefore)

  const select = page.getByRole('combobox', { name: 'Fruit' }).first()
  await select.click()
  await page.getByRole('option', { name: 'Banana' }).click()
  record('select: demo changes value', /Banana/.test(await select.textContent()), await select.textContent())

  await hydrate(page, '#slider')
  const slider = page.getByRole('slider', { name: /Volume thumb 1/ }).first()
  const sliderBefore = await slider.getAttribute('aria-valuenow')
  await slider.focus()
  await page.keyboard.press('ArrowRight')
  record('slider: demo responds to keyboard input', (await slider.getAttribute('aria-valuenow')) !== sliderBefore)

  await hydrate(page, '#input')
  const nameInput = page.getByLabel('Name').first()
  await nameInput.fill('Updated Pouf')
  record('input: demo accepts text', (await nameInput.inputValue()) === 'Updated Pouf')

  await hydrate(page, '#number-input')
  const stepper = page.getByLabel('Stepper').first()
  const stepperBefore = await stepper.inputValue()
  await page.locator('#number-input').getByRole('button', { name: 'Increase' }).first().click()
  record('number input: stepper changes value', (await stepper.inputValue()) !== stepperBefore, `${stepperBefore} → ${await stepper.inputValue()}`)

  await hydrate(page, '#segmented')
  const listSegment = page.locator('#segmented').getByRole('button', { name: 'List' }).first()
  await listSegment.click()
  record('segmented: demo changes selection', (await listSegment.getAttribute('aria-pressed')) === 'true')

  await hydrate(page, '#toggle')
  const italicToggle = page.locator('#toggle').getByRole('button', { name: /Italic/ }).first()
  await italicToggle.click()
  record('toggle group: demo changes selection', (await italicToggle.getAttribute('data-state')) === 'on')

  await hydrate(page, '#disclosure')
  const tabsDemo = page.locator('#disclosure [data-demo-component="tabs"]').first()
  await tabsDemo.evaluate((node) => node.scrollIntoView({ block: 'center' }))
  await page.waitForTimeout(550)
  const historyTab = tabsDemo.locator('[role="tab"]', { hasText: 'History' }).first()
  await historyTab.click()
  record('tabs: demo switches panel', (await historyTab.getAttribute('aria-selected')) === 'true')

  await hydrate(page, '#pagination')
  const pageReadout = page.locator('#pagination .pouf-text').filter({ hasText: /\/ 5/ }).first()
  const activePageBefore = await pageReadout.textContent()
  await page.locator('#pagination').getByRole('button', { name: 'Next page' }).first().click()
  const activePageAfter = await pageReadout.textContent()
  record('pagination: demo changes page', activePageBefore !== activePageAfter, `${activePageBefore} → ${activePageAfter}`)

  const search = page.getByLabel('Find a component')
  await search.fill('dialog')
  const filtered = await page.locator('[data-component-card]:visible').count()
  record('search: filters component cards', filtered === 1, `${filtered} visible`)
  record('search: query is linkable', new URL(page.url()).searchParams.get('q') === 'dialog', page.url())
  await page.getByRole('button', { name: 'Clear component search' }).click()

  await hydrate(page, '#controls')
  const dialogTrigger = page.getByRole('button', { name: 'Open dialog' }).first()
  await dialogTrigger.scrollIntoViewIfNeeded()
  await page.waitForTimeout(550)
  await dialogTrigger.click()
  await page.locator('.pouf-dialog').waitFor({ state: 'visible' })
  const dialogLayer = await page.evaluate(() => {
    const overlay = document.querySelector('.pouf-overlay')
    const dialog = document.querySelector('.pouf-dialog')
    const header = document.querySelector('.site-header')
    return {
      overlay: Number(getComputedStyle(overlay).zIndex),
      dialog: Number(getComputedStyle(dialog).zIndex),
      header: Number(getComputedStyle(header).zIndex),
      topLeft: document.elementFromPoint(4, 4)?.classList.contains('pouf-overlay') ?? false,
    }
  })
  record('dialog: backdrop paints above page chrome', dialogLayer.overlay > dialogLayer.header && dialogLayer.topLeft, JSON.stringify(dialogLayer))
  record('dialog: content paints above its backdrop', dialogLayer.dialog > dialogLayer.overlay, JSON.stringify(dialogLayer))
  await page.getByRole('button', { name: 'Close' }).click()
  await page.locator('.pouf-dialog').waitFor({ state: 'hidden' })

  await hydrate(page, '#sheet')
  const sheetTrigger = page.getByRole('button', { name: 'Open sheet' })
  await sheetTrigger.scrollIntoViewIfNeeded()
  await page.waitForTimeout(550)
  await sheetTrigger.click()
  await page.locator('.pouf-sheet-dialog').waitFor({ state: 'visible' })
  const sheetLayer = await page.evaluate(() => {
    const overlay = document.querySelector('.pouf-overlay')
    const sheet = document.querySelector('.pouf-sheet-dialog')
    const header = document.querySelector('.site-header')
    return {
      overlay: Number(getComputedStyle(overlay).zIndex),
      sheet: Number(getComputedStyle(sheet).zIndex),
      header: Number(getComputedStyle(header).zIndex),
      topLeft: document.elementFromPoint(4, 4)?.classList.contains('pouf-overlay') ?? false,
    }
  })
  record('sheet: backdrop paints above page chrome', sheetLayer.overlay > sheetLayer.header && sheetLayer.topLeft, JSON.stringify(sheetLayer))
  record('sheet: panel paints above its backdrop', sheetLayer.sheet > sheetLayer.overlay, JSON.stringify(sheetLayer))
  await page.getByRole('button', { name: 'Close' }).click()
  await page.locator('.pouf-sheet-dialog').waitFor({ state: 'hidden' })

  const toc = page.locator('.comp-toc-scroll')
  await toc.evaluate((node) => { node.scrollTop = node.scrollHeight })
  const tocClearance = await page.locator('.comp-toc').evaluate((aside) => {
    const last = aside.querySelector('[data-component-link="charts"]')
    return last ? Math.round(aside.getBoundingClientRect().bottom - last.getBoundingClientRect().bottom) : -1
  })
  record('component index: last link clears cushion lip', tocClearance >= 16, `${tocClearance}px`)

  await page.screenshot({ path: `${SHOT_DIR}/components-desktop.png`, fullPage: false })
  await hydrate(page, '#slider')
  await page.screenshot({ path: `${SHOT_DIR}/components-slider.png`, fullPage: false })
  await hydrate(page, '#readout')
  await page.screenshot({ path: `${SHOT_DIR}/components-readout.png`, fullPage: false })
  record('desktop: no runtime errors after interactions', runtime.length === 0, runtime.join(' | '))
  await page.close()
}

await browser.close()
const failed = results.filter((result) => !result.pass)
console.log(`\n${results.length - failed.length}/${results.length} passed`)
console.log(`Screenshots: ${SHOT_DIR}`)
process.exit(failed.length ? 1 : 0)
