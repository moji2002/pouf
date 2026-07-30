import { defineConfig } from 'astro/config'
import fs from 'node:fs'
import react from '@astrojs/react'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'

const demoRoutes = JSON.parse(
  fs.readFileSync(new URL('./src/data/demo-routes.json', import.meta.url), 'utf8'),
)
const redirectPaths = new Set(Object.keys(demoRoutes).map((path) => `/${path}/`))

// Vercel static hosting at a custom domain (1st-pouf.worksonmy.dev) serves from the root.
export default defineConfig({
  site: 'https://1st-pouf.worksonmy.dev',
  // llms.txt is a machine-readable index for assistants, not a search result —
  // excluded so it doesn't show up as a page in sitemap.xml.
  integrations: [
    react(),
    mdx(),
    sitemap({
      filter: (page) => {
        const pathname = new URL(page).pathname
        return pathname !== '/llms.txt' && pathname !== '/llm.txt' && !redirectPaths.has(pathname)
      },
    }),
  ],
  vite: { plugins: [tailwindcss()] },
})
