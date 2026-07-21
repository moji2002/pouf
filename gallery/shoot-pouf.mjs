import { chromium } from 'playwright'

// Override with SHOOT_OUT=/some/dir. Defaults to the repo-local .shots/ dir so
// the script is not pinned to one machine's scratchpad.
const OUT = process.env.SHOOT_OUT ?? new URL('../.shots', import.meta.url).pathname
const url = process.argv[2] ?? 'http://localhost:4821/components/'
const name = process.argv[3] ?? 'components'
const width = Number(process.argv[4] ?? 1440)
const height = Number(process.argv[5] ?? 1000)
// Comma-separated scroll offsets (px) to capture, one PNG per offset.
const offsets = (process.argv[6] ?? '0').split(',').map(Number)

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 })
await page.goto(url, { waitUntil: 'networkidle' })
await page.waitForTimeout(1200)

for (const y of offsets) {
  await page.evaluate((v) => window.scrollTo(0, v), y)
  await page.waitForTimeout(500)
  await page.screenshot({ path: `${OUT}/${name}-${y}.png` })
  console.log(`${OUT}/${name}-${y}.png`)
}

const docHeight = await page.evaluate(() => document.documentElement.scrollHeight)
console.log('scrollHeight', docHeight)
await browser.close()
