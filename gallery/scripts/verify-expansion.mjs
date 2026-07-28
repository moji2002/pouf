import { chromium } from 'playwright'

const BASE = process.env.BASE ?? 'http://127.0.0.1:4321'
const browser = await chromium.launch()
const results = []
const record = (name, pass, detail = '') => {
  results.push({ name, pass, detail })
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`)
}

async function open(path, width = 1280, height = 1000) {
  const page = await browser.newPage({ viewport: { width, height } })
  await page.goto(BASE + path, { waitUntil: 'networkidle' })
  const preview = page.locator('article .cushion').first()
  if (await preview.count()) {
    await preview.scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)
  }
  await page.evaluate(() => document.querySelector('article > details')?.remove())
  return page
}

{
  const page = await open('/examples/')
  record('gallery: exposes all 14 templates', (await page.locator('[data-example-card]').count()) === 14)
  await page.getByRole('searchbox', { name: 'Find a Template' }).fill('inventory')
  record('gallery: search narrows templates', (await page.locator('[data-example-card]:visible').count()) === 1)
  record('gallery: search state is linkable', new URL(page.url()).searchParams.get('q') === 'inventory')
  await page.getByRole('searchbox', { name: 'Find a Template' }).fill('')
  await page.getByRole('button', { name: 'Learning & events' }).click()
  record('gallery: category filters templates', (await page.locator('[data-example-card]:visible').count()) === 2)
  record('gallery: category state is linkable', new URL(page.url()).searchParams.get('category') === 'Learning & events')
  await page.close()
}

{
  const page = await open('/blocks/contact/')
  await page.getByRole('button', { name: 'Send message' }).click()
  record('contact: invalid submit explains the fix', await page.getByText(/Add your name/).isVisible())
  await page.getByLabel('Name').fill('Ada Lovelace')
  await page.getByLabel('Email').fill('ada@example.com')
  await page.getByLabel('Message').fill('We are building a tactile planning tool for small creative teams.')
  await page.getByRole('button', { name: 'Send message' }).click()
  record('contact: valid message reaches submitted state', await page.getByText('Message sent', { exact: true }).isVisible())
  await page.close()
}

{
  const page = await open('/blocks/testimonials/')
  const before = await page.locator('blockquote').innerText()
  await page.getByRole('button', { name: 'Next story' }).click()
  const after = await page.locator('blockquote').innerText()
  record('testimonials: carousel advances', before !== after)
  await page.getByRole('button', { name: 'Engineering', exact: true }).click()
  record('testimonials: category filter updates the set', await page.getByText('1 of 2', { exact: true }).isVisible())
  await page.close()
}

{
  const page = await open('/examples/crm/')
  await page.getByRole('textbox', { name: 'Search customers' }).fill('Grace')
  const customerRows = page.locator('.pouf-rowcard')
  record('crm: customer search narrows the list', (await customerRows.count()) === 1)
  await customerRows.first().click()
  await page.getByLabel('Add a note').fill('Send the compiler migration plan on Thursday.')
  await page.getByRole('button', { name: 'Save note' }).click()
  record('crm: notes persist in the customer detail', await page.getByText('Send the compiler migration plan on Thursday.', { exact: true }).isVisible())
  await page.close()
}

{
  const page = await open('/examples/booking/')
  await page.getByRole('button', { name: 'Choose a time' }).click()
  await page.getByRole('button', { name: /Tue, Aug 4/ }).click()
  await page.getByRole('button', { name: '11:00' }).click()
  await page.getByRole('button', { name: 'Add your details' }).click()
  await page.getByRole('button', { name: 'Review booking' }).click()
  record('booking: incomplete details show an actionable error', await page.getByText(/Add your name and a complete email/).isVisible())
  await page.getByLabel('Name').fill('Maya Bloom')
  await page.getByLabel('Email').fill('maya@example.com')
  await page.getByRole('button', { name: 'Review booking' }).click()
  await page.getByRole('button', { name: 'Confirm booking' }).click()
  record('booking: complete flow reaches confirmation', await page.getByText('You’re booked', { exact: true }).isVisible())
  await page.close()
}

{
  const page = await open('/examples/inventory/')
  await page.getByLabel('Search Inventory').fill('soft clock')
  record('inventory: search narrows stock', (await page.locator('.pouf-table tbody tr').count()) === 1)
  await page.getByRole('button', { name: 'Open Soft clock' }).click()
  record('inventory: out-of-stock detail is explicit', await page.locator('.pouf-badge').getByText('Out of stock', { exact: true }).isVisible())
  await page.getByRole('button', { name: 'Receive 12 Units' }).click()
  record('inventory: receiving updates stock state', await page.getByText('In stock', { exact: true }).isVisible())
  await page.close()
}

{
  const page = await open('/examples/editorial/')
  await page.getByRole('button', { name: 'Schedule Story' }).click()
  record('editorial: draft moves to scheduled', await page.getByRole('button', { name: 'Publish Story' }).isVisible())
  await page.getByRole('button', { name: 'Publish Story' }).click()
  record('editorial: scheduled story publishes', await page.getByRole('button', { name: 'Return to Drafts' }).isVisible())
  await page.close()
}

{
  const page = await open('/examples/course/')
  record('course: starts with meaningful progress', await page.getByText('25% complete', { exact: true }).isVisible())
  await page.getByRole('button', { name: 'Mark Complete' }).click()
  record('course: completing a lesson updates progress', await page.getByText('50% complete', { exact: true }).isVisible())
  await page.close()
}

{
  const page = await open('/examples/event/')
  await page.getByLabel('Find an Attendee').fill('Noah')
  record('event: attendee search narrows the list', (await page.getByRole('button', { name: 'Check In' }).count()) === 1)
  await page.getByRole('button', { name: 'Check In' }).click()
  record('event: check-in updates the attendee action', await page.getByRole('button', { name: 'Undo Check-in' }).isVisible())
  await page.close()
}

await browser.close()
const failed = results.filter((result) => !result.pass)
console.log(`\n${results.length - failed.length}/${results.length} passed`)
process.exit(failed.length ? 1 : 0)
