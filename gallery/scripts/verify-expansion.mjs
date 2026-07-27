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
  await preview.scrollIntoViewIfNeeded()
  await page.waitForTimeout(500)
  await page.evaluate(() => document.querySelector('article > details')?.remove())
  return page
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

await browser.close()
const failed = results.filter((result) => !result.pass)
console.log(`\n${results.length - failed.length}/${results.length} passed`)
process.exit(failed.length ? 1 : 0)
