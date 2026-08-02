import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { chromium } from '../gallery/node_modules/playwright/index.mjs'

const outputUrl = new URL('../docs/social-preview.png', import.meta.url)
const publicOutputUrl = new URL('../www/public/social-preview.png', import.meta.url)
await mkdir(fileURLToPath(new URL('../docs/', import.meta.url)), { recursive: true })
await mkdir(fileURLToPath(new URL('../www/public/', import.meta.url)), { recursive: true })

const browser = await chromium.launch({ headless: true })

try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 640 } })
  await page.setContent(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <style>
          * { box-sizing: border-box; }
          html, body { width: 1280px; height: 640px; margin: 0; overflow: hidden; }
          body {
            background: #f0e9ff;
            color: #3a2e5c;
            font-family: ui-rounded, "Arial Rounded MT Bold", "Trebuchet MS", sans-serif;
            font-weight: 800;
          }
          .orb { position: absolute; border-radius: 999px; opacity: .66; }
          .purple { width: 390px; height: 390px; left: -95px; top: -120px; background: #c9a8ff; }
          .yellow { width: 300px; height: 300px; left: 490px; top: -205px; background: #ffe58a; }
          .pink { width: 360px; height: 360px; right: -145px; top: -75px; background: #ffb3d1; }
          .mint { width: 330px; height: 330px; left: -90px; bottom: -210px; background: #a8f0d0; }
          .blue { width: 360px; height: 360px; right: -120px; bottom: -210px; background: #9ec8ff; }
          main { position: relative; padding: 96px 90px 58px; height: 100%; }
          .brand { display: flex; align-items: center; gap: 22px; }
          .mark {
            width: 104px;
            height: 104px;
            border-radius: 34px;
            background: #c9a8ff;
            box-shadow: inset 0 -14px 0 rgba(58,46,92,.16), inset 0 7px 0 rgba(255,255,255,.44), 0 16px 30px rgba(58,46,92,.18);
          }
          h1 { margin: 0; font-size: 78px; line-height: 1; letter-spacing: -4px; }
          .tagline { margin: 62px 0 10px; font-size: 38px; line-height: 1.15; letter-spacing: -1.3px; }
          .detail { margin: 0; color: #71609b; font-size: 25px; line-height: 1.3; }
          .swatches { display: flex; gap: 14px; margin-top: 58px; }
          .swatches span { width: 70px; height: 70px; border-radius: 22px; box-shadow: inset 0 -8px 0 rgba(58,46,92,.1), inset 0 4px 0 rgba(255,255,255,.35); }
          .url { position: absolute; right: 82px; bottom: 54px; color: #71609b; font-size: 22px; letter-spacing: -.4px; }
        </style>
      </head>
      <body>
        <div class="orb purple"></div><div class="orb yellow"></div><div class="orb pink"></div>
        <div class="orb mint"></div><div class="orb blue"></div>
        <main>
          <div class="brand"><div class="mark" aria-hidden="true"></div><h1>1st-Pouf</h1></div>
          <p class="tagline">Puffy, pastel, maximalist UI for React</p>
          <p class="detail">71 installable shadcn registry items — copy the source and own it.</p>
          <div class="swatches" aria-hidden="true">
            <span style="background:#c9a8ff"></span><span style="background:#ffb3d1"></span>
            <span style="background:#9ec8ff"></span><span style="background:#a8f0d0"></span>
            <span style="background:#ffe58a"></span><span style="background:#ffb38a"></span>
          </div>
          <div class="url">1st-pouf.worksonmy.dev</div>
        </main>
      </body>
    </html>
  `)
  await page.screenshot({ path: fileURLToPath(outputUrl), type: 'png' })
  await page.screenshot({ path: fileURLToPath(publicOutputUrl), type: 'png' })
  console.log(`Wrote ${fileURLToPath(outputUrl)} (1280x640)`)
  console.log(`Wrote ${fileURLToPath(publicOutputUrl)} (1280x640)`)
} finally {
  await browser.close()
}
