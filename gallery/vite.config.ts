import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // The snapshot gate (harness/gate.ts) WRITES its goldens and candidate
  // captures into harness/golden/** and harness/.candidate/** — inside this
  // Vite root. Without this, Vite's file watcher sees each snapshot write and
  // fires an HMR page reload mid-run ("[vite] page reload harness/golden/…"),
  // which destroys the page context and wipes the harness's injected
  // window.captureComputedStyles, so the NEXT capture throws
  // "captureComputedStyles is not a function". The harness dir is not part of
  // the served app, so ignoring it from the watcher is free. See
  // docs/gate-harness-research.md.
  server: { watch: { ignored: ['**/harness/**'] } },
})
