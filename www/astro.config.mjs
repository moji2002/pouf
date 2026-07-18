import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import mdx from '@astrojs/mdx'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages at a custom domain (pouf.dev) serves from the root.
export default defineConfig({
  site: 'https://pouf.dev',
  integrations: [react(), mdx()],
  vite: { plugins: [tailwindcss()] },
})
