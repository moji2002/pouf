import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import mdx from '@astrojs/mdx'
import tailwindcss from '@tailwindcss/vite'

// Vercel static hosting at a custom domain (pouf.worksonmy.dev) serves from the root.
export default defineConfig({
  site: 'https://pouf.worksonmy.dev',
  integrations: [react(), mdx()],
  vite: { plugins: [tailwindcss()] },
})
