import { chromium } from 'playwright'

const BASE = 'http://localhost:4821/examples'
const browser = await chromium.launch()
const results = []

function record(name, pass, detail) {
  results.push({ name, pass, detail })
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`)
}

async function openTemplate(slug, width = 1440, height = 1100) {
  const page = await browser.newPage({ viewport: { width, height } })
  await page.goto(`${BASE}/${slug}/`, { waitUntil: 'networkidle' })
  // client:visible — scroll the preview into view so React hydrates.
  await page.evaluate(() => window.scrollTo(0, 600))
  await page.waitForTimeout(1500)
  await page.evaluate(() => document.querySelector('details')?.remove())
  return page
}

/* ---------- dashboard: filterable chart + sortable table ---------- */
{
  const page = await openTemplate('dashboard')
  const axis = () => page.locator('.recharts-cartesian-axis-tick-value').allTextContents()

  const week = await axis()
  await page.getByRole('button', { name: 'Month', exact: true }).click()
  await page.waitForTimeout(700)
  const month = await axis()
  record(
    'dashboard: range picker redraws chart',
    week.join() !== month.join() && month.join().includes('W1'),
    `${week.slice(0, 3).join('/')} -> ${month.slice(0, 3).join('/')}`,
  )

  // Sort by Amount ascending: smallest ($98.25) should lead.
  await page.getByRole('button', { name: /Amount/ }).click()
  await page.waitForTimeout(400)
  const firstAmount = (await page.locator('.pouf-table tbody tr').first().innerText()).replace(/\s+/g, ' ')
  record(
    'dashboard: Amount column sorts',
    firstAmount.includes('98.25'),
    `first row: ${firstAmount}`,
  )
  await page.close()
}

/* ---------- inbox: search + reply ---------- */
{
  const page = await openTemplate('inbox')
  const rows = () => page.locator('.pouf-rowcard').count()
  const before = await rows()
  await page.getByLabel('Search mail').fill('grace')
  await page.waitForTimeout(500)
  const after = await rows()
  record('inbox: search filters the list', before === 4 && after === 1, `${before} -> ${after}`)

  await page.getByLabel('Search mail').fill('zzzz')
  await page.waitForTimeout(400)
  // Scope away from the collapsed source listing, which contains the same
  // literal and makes an unscoped text locator ambiguous after registry build.
  const empty = await page.locator('.pouf-empty').getByText('No matches').isVisible().catch(() => false)
  record('inbox: empty state on no matches', empty)

  await page.getByLabel('Search mail').fill('')
  await page.waitForTimeout(400)
  await page.getByRole('button', { name: 'Reply' }).click()
  await page.waitForTimeout(400)
  const composer = await page.getByLabel('Your reply').isVisible().catch(() => false)
  record('inbox: Reply opens a composer', composer)
  await page.close()
}

/* ---------- kanban: move a card ---------- */
{
  const page = await openTemplate('kanban')
  const counts = async () =>
    (await page.locator('.pouf-badge').allInnerTexts()).slice(0, 4).join(',')
  const before = await counts()
  await page.getByRole('button', { name: /Move .* right/ }).first().click()
  await page.waitForTimeout(500)
  const after = await counts()
  record('kanban: move button relocates a card', before !== after, `${before} -> ${after}`)
  await page.close()
}

/* ---------- settings: dirty state ---------- */
{
  const page = await openTemplate('settings')
  const save = page.getByRole('button', { name: 'Save changes' })
  const disabledBefore = await save.isDisabled()
  await page.getByLabel('Display name').fill('Grace Hopper')
  await page.waitForTimeout(400)
  const disabledAfter = await save.isDisabled()
  const badge = (await page.locator('.pouf-badge').allInnerTexts()).some((t) => /unsaved/i.test(t))
  record(
    'settings: save bar tracks dirty state',
    disabledBefore && !disabledAfter && badge,
    `disabled ${disabledBefore} -> ${disabledAfter}, badge ${badge}`,
  )

  await save.click()
  await page.waitForTimeout(400)
  const reDisabled = await save.isDisabled()
  record('settings: Save commits and re-baselines', reDisabled)
  await page.close()
}

/* ---------- chat: switching conversation switches the thread ---------- */
{
  const page = await openTemplate('chat')
  const bodyBefore = await page.locator('body').innerText()
  await page.getByRole('button', { name: /Grace H\./ }).first().click()
  await page.waitForTimeout(600)
  const bodyAfter = await page.locator('body').innerText()
  const headerBefore = 'Maya B.'
  record(
    'chat: conversation switch changes the thread',
    bodyBefore !== bodyAfter && bodyAfter.includes('zero visual drift'),
    `header was "${headerBefore}"`,
  )
  await page.close()
}

/* ---------- inbox mobile: master/detail ---------- */
{
  const page = await openTemplate('inbox', 420, 900)
  await page.getByText('Katherine J.').first().click()
  await page.waitForTimeout(600)
  const back = await page.getByRole('button', { name: 'Back to list' }).isVisible().catch(() => false)
  const listHidden = !(await page.getByLabel('Search mail').isVisible().catch(() => false))
  record('inbox mobile: tap swaps to detail with Back', back && listHidden, `back ${back}, list hidden ${listHidden}`)
  await page.close()
}

/* ---------- landing: complete pricing section ---------- */
{
  const page = await openTemplate('landing')
  const monthly = await page.getByText('$24', { exact: true }).isVisible().catch(() => false)
  await page.getByRole('button', { name: /Annual/ }).click()
  await page.waitForTimeout(400)
  const annual = await page.getByText('$19', { exact: true }).isVisible().catch(() => false)
  const sections = await page.locator('#features, #customers, #pricing').count()
  record(
    'landing: complete sections and working billing',
    monthly && annual && sections === 3,
    `monthly ${monthly}, annual ${annual}, sections ${sections}`,
  )
  await page.close()
}

/* ---------- storefront: discovery + bag + order state ---------- */
{
  const page = await openTemplate('storefront')
  await page.getByLabel('Search products').fill('speaker')
  await page.waitForTimeout(400)
  const addButtons = await page.getByRole('button', { name: 'Add to bag' }).count()
  await page.getByRole('button', { name: 'Add to bag' }).click()
  await page.waitForTimeout(300)
  const bagCount = await page.getByRole('button', { name: 'Bag (1)' }).isVisible().catch(() => false)
  record(
    'storefront: search narrows products and add updates bag',
    addButtons === 1 && bagCount,
    `add buttons ${addButtons}, bag count ${bagCount}`,
  )

  await page.getByRole('button', { name: 'Reserve order' }).click()
  await page.waitForTimeout(300)
  const reserved = await page.locator('.pouf-badge', { hasText: /order reserved/i }).isVisible().catch(() => false)
  const total = await page.getByText('$92.00', { exact: true }).isVisible().catch(() => false)
  record(
    'storefront: order summary includes shipping and reserve state',
    reserved && total,
    `reserved ${reserved}, total ${total}`,
  )
  await page.close()
}

/* ---------- storefront mobile: navigation stays available ---------- */
{
  const page = await openTemplate('storefront', 420, 900)
  await page.locator('.pouf-navbar summary').click()
  const shop = await page.locator('.pouf-navbar').getByRole('link', { name: 'Shop' }).isVisible().catch(() => false)
  const story = await page.locator('.pouf-navbar').getByRole('link', { name: 'Story' }).isVisible().catch(() => false)
  record(
    'storefront mobile: navbar keeps all destinations',
    shop && story,
    `shop ${shop}, story ${story}`,
  )
  await page.close()
}

/* ---------- support: queue + reply + status ---------- */
{
  const page = await openTemplate('support')
  await page.getByLabel('Search tickets').fill('Alan')
  await page.waitForTimeout(400)
  const tickets = await page.locator('.pouf-rowcard').count()
  await page.getByRole('button', { name: /Alan Turing/ }).click()
  await page.waitForTimeout(300)
  await page.getByLabel('Reply').fill('A fresh battery should restore the chime.')
  await page.getByRole('button', { name: 'Send reply' }).click()
  await page.waitForTimeout(400)
  const sent = await page.getByText('A fresh battery should restore the chime.', { exact: true }).isVisible().catch(() => false)
  const waiting = (await page.locator('.pouf-badge').allInnerTexts()).some((text) => /^waiting$/i.test(text))
  record(
    'support: filters queue and sends a reply',
    tickets === 1 && sent && waiting,
    `tickets ${tickets}, sent ${sent}, waiting ${waiting}`,
  )

  await page.getByRole('button', { name: 'Mark solved' }).click()
  await page.waitForTimeout(300)
  const solved = (await page.locator('.pouf-badge').allInnerTexts()).some((text) => /^solved$/i.test(text))
  record('support: status actions update the ticket', solved)
  await page.close()
}

/* ---------- support mobile: master/detail ---------- */
{
  const page = await openTemplate('support', 420, 900)
  await page.getByRole('button', { name: /Alan Turing/ }).click()
  await page.waitForTimeout(400)
  const back = await page.getByRole('button', { name: 'Back to queue' }).isVisible().catch(() => false)
  const queueHidden = !(await page.getByLabel('Search tickets').isVisible().catch(() => false))
  record(
    'support mobile: ticket opens as a focused detail view',
    back && queueHidden,
    `back ${back}, queue hidden ${queueHidden}`,
  )
  await page.close()
}

await browser.close()
const failed = results.filter((r) => !r.pass)
console.log(`\n${results.length - failed.length}/${results.length} passed`)
process.exit(failed.length ? 1 : 0)
