/** The example templates ("blocks") shown under /examples. Each is a full-page
 * composition of Pouf primitives, installable as a registry:block. */
export interface BlockDoc {
  slug: string
  title: string
  blurb: string
}

export const BLOCKS: BlockDoc[] = [
  { slug: 'dashboard', title: 'Dashboard', blurb: 'Sidebar nav, a KPI row, a revenue chart, and a data table.' },
  { slug: 'login', title: 'Login', blurb: 'A centered auth card with fields and a magic-link fallback.' },
  { slug: 'settings', title: 'Settings', blurb: 'Tabbed sections of form controls with a save bar.' },
]

export function blockInstall(slug: string): string {
  return `npx shadcn@latest add https://pouf.dev/r/${slug}.json`
}
