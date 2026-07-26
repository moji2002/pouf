import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'

// Vercel static hosting at a custom domain (pouf.worksonmy.dev) serves from the root.
export default defineConfig({
  site: 'https://pouf.worksonmy.dev',
  // llms.txt is a machine-readable index for assistants, not a search result —
  // excluded so it doesn't show up as a page in sitemap.xml.
  integrations: [react(), mdx(), sitemap({ filter: (page) => !page.endsWith('/llms.txt') })],
  vite: { plugins: [tailwindcss()] },
})
