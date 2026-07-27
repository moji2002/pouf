import { chromium } from 'playwright'

const BASE = 'http://localhost:4821/blocks'
const browser = await chromium.launch()
const results = []
const rec = (n, p, d) => { results.push({ n, p }); console.log(`${p ? 'PASS' : 'FAIL'}  ${n}${d ? ` — ${d}` : ''}`) }

async function guard(name, fn) {
  try { await fn() } catch (e) { rec(name, false, `threw: ${String(e).split('\n')[0].slice(0, 80)}`) }
}

async function open(slug, w = 1280, h = 1100) {
  const page = await browser.newPage({ viewport: { width: w, height: h } })
  await page.goto(`${BASE}/${slug}/`, { waitUntil: 'networkidle' })
  await page.evaluate(() => window.scrollTo(0, 500))
  await page.waitForTimeout(1400)
  // Drop the collapsed source listing so locators only see the live preview.
  await page.evaluate(() => document.querySelector('details')?.remove())
  return page
}
const txt = (p) => p.locator('body').innerText()

/* login: validation + password toggle + magic link */
{
  const p = await open('login')
  await p.getByRole('button', { name: /Sign in/i }).first().click()
  await p.waitForTimeout(400)
  const errs = await txt(p)
  rec('login: submitting empty shows validation', /valid email|required|enter/i.test(errs))

  const pw = p.getByLabel(/password/i).first()
  const before = await pw.getAttribute('type')
  await p.getByRole('button', { name: /show|hide/i }).first().click()
  await p.waitForTimeout(300)
  rec('login: password toggle flips type', before === 'password' && (await pw.getAttribute('type')) === 'text')

  await p.getByRole('button', { name: /magic|email me|link/i }).first().click()
  await p.waitForTimeout(400)
  rec('login: magic-link fallback switches mode', /magic|inbox|link/i.test(await txt(p)))
  await p.getByLabel(/email/i).first().fill('ada@example.com')
  await p.getByLabel(/email/i).first().press('Enter')
  await p.waitForTimeout(400)
  rec('login: Enter submits the form', /check your inbox/i.test(await txt(p)))
  await p.close()
}

/* onboarding: blocks advance until filled, remembers answers */
{
  const p = await open('onboarding')
  await p.getByRole('button', { name: /continue|next/i }).first().click()
  await p.waitForTimeout(400)
  rec('onboarding: empty step blocks advance', /Tell us what to call you|Step 1 of/i.test(await txt(p)))
  await p.close()
}

/* pricing: annual toggle changes prices */
{
  const p = await open('pricing')
  const before = await txt(p)
  await p.getByRole('button', { name: /annual|year/i }).first().click()
  await p.waitForTimeout(500)
  rec('pricing: billing toggle changes prices', before !== (await txt(p)))
  await p.close()
}

/* blog: category filter narrows the grid */
{
  const p = await open('blog')
  const n0 = await p.locator('.pouf-card').count()
  const chips = p.locator('button').filter({ hasText: /^(Design|Engineering|Craft|Process|Notes)$/ })
  if (await chips.count()) {
    await chips.first().click(); await p.waitForTimeout(500)
    rec('blog: category filter narrows the grid', (await p.locator('.pouf-card').count()) < n0, `${n0} -> ${await p.locator('.pouf-card').count()}`)
  } else rec('blog: category filter narrows the grid', false, 'no category control found')
  await p.close()
}

/* profile: follow toggles and moves the count */
{
  const p = await open('profile')
  const before = await txt(p)
  await p.getByRole('button', { name: /^follow$/i }).first().click()
  await p.waitForTimeout(400)
  const after = await txt(p)
  rec('profile: follow toggles and count moves', before !== after && /following/i.test(after))
  await p.close()
}

/* feed: comment thread opens and accepts a reply */
{
  const p = await open('feed')
  await p.getByRole('button', { name: /Show \d+ comments/i }).first().click()
  await p.waitForTimeout(500)
  const opened = await p.locator('input, textarea').count()
  rec('feed: comment opens a reply composer', opened > 1, `${opened} inputs`)
  await p.close()
}

/* todo: add a task, then clear completed */
{
  const p = await open('todo')
  const box = p.locator('input[type="text"], input:not([type])').first()
  await box.fill('Ship the blocks pass')
  await p.keyboard.press('Enter')
  await p.waitForTimeout(500)
  const body = await txt(p)
  const hits = (body.match(/Ship the blocks pass/g) || []).length
  rec('todo: Enter adds the task exactly once', hits === 1, `${hits} occurrence(s)`)
  const clear = p.getByRole('button', { name: /clear/i }).first()
  rec('todo: Clear completed exists', await clear.count() > 0)
  await clear.click()
  await box.fill('After clear')
  await p.keyboard.press('Enter')
  await p.waitForTimeout(500)
  await p.getByRole('checkbox', { name: 'Ship the blocks pass' }).click()
  const afterClear = p.getByRole('checkbox', { name: 'After clear' })
  rec(
    'todo: ids stay unique after clearing and adding',
    (await afterClear.count()) === 1 && !(await afterClear.isChecked()),
  )
  await p.close()
}

/* calendar: day picker changes the agenda */
{
  const p = await open('calendar')
  const before = await txt(p)
  const days = p.locator('button').filter({ hasText: /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\s*\d+$/ })
  if (await days.count() > 1) {
    await days.nth(0).click(); await p.waitForTimeout(500)
    rec('calendar: day picker changes the agenda', before !== (await txt(p)))
  } else rec('calendar: day picker changes the agenda', false, 'no day control found')
  await p.close()
}

/* music: starts paused, play ticks the clock */
{
  const p = await open('music')
  const t0 = await txt(p)
  await p.waitForTimeout(2500)
  rec('music: starts paused (no drift while idle)', t0 === (await txt(p)))
  await p.getByRole('button', { name: /^play$/i }).first().click()
  await p.waitForTimeout(2500)
  rec('music: Play advances the scrubber', t0 !== (await txt(p)))
  await p.close()
}

/* weather: city picker changes conditions */
{
  const p = await open('weather')
  const before = await txt(p)
  const cities = p.locator('button').filter({ hasText: /^(Lisbon|Oslo|Dubai)$/ })
  if (await cities.count() > 1) {
    await cities.nth(1).click(); await p.waitForTimeout(500)
    rec('weather: city picker changes conditions', before !== (await txt(p)))
  } else rec('weather: city picker changes conditions', false, 'no city control found')
  await p.close()
}

/* game: attacking moves score/bars */
{
  const p = await open('game')
  const before = await txt(p)
  await p.getByRole('button', { name: /attack/i }).first().click()
  await p.waitForTimeout(500)
  rec('game: Attack changes score/health', before !== (await txt(p)))
  await p.close()
}

/* quiz: answer -> feedback -> advances */
{
  const p = await open('quiz')
  const before = await txt(p)
  // Answers are RadioGroup items (.pouf-radio), not rowcards.
  await p.locator('.pouf-radio').first().click()
  await p.waitForTimeout(300)
  const check = p.getByRole('button', { name: /^check$/i }).first()
  await check.click()
  await p.waitForTimeout(500)
  rec('quiz: answering gives instant feedback', before !== (await txt(p)))
  await p.close()
}

await browser.close()
const bad = results.filter((r) => !r.p)
console.log(`\n${results.length - bad.length}/${results.length} passed`)
if (bad.length) console.log('failed: ' + bad.map((b) => b.n).join(' | '))
