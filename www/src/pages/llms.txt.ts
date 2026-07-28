import type { APIRoute } from 'astro'
import { COMPONENTS, SECTIONS, componentInstall } from '../data/manifest'
import { TEMPLATES, BLOCKS, blockInstall } from '../data/blocks'
import { SITE_ORIGIN, registryUrl } from '../data/site'

/* Served at /llms.txt, generated from the same manifests the site renders from.
 *
 * A hand-written copy would be wrong within a release — this is the file an
 * assistant reads INSTEAD of crawling 24 pages, so a stale component list is
 * worse than no file at all. Deriving it means adding a component to the
 * manifest publishes it here too, with no second step to forget.
 *
 * Format follows the llmstxt.org convention: H1, a blockquote summary, then
 * H2 sections of links with short descriptions.
 */
export const GET: APIRoute = ({ site }) => {
  const origin = site?.origin ?? SITE_ORIGIN
  const abs = (p: string) => new URL(p, origin).href

  const lines: string[] = []

  lines.push('# Pouf')
  lines.push('')
  lines.push(
    '> A claymorphism React component library distributed shadcn-style: you run one ' +
      'command and the source lands in your repo, yours to edit. Not an npm package — ' +
      'there is no `pouf` to import from. Built on Radix primitives, styled with ' +
      'Tailwind v4 and a single stylesheet of CSS custom properties.',
  )
  lines.push('')

  lines.push('## Requirements')
  lines.push('')
  lines.push(
    '- React 18 or 19. Every published registry file is type-checked with React ' +
      '18.3.1, including a server-render smoke test for core and Framer Motion ' +
      'components. Pouf itself is developed and tested on React 19.',
  )
  lines.push(
    '- React 17 and older are not supported. Animation-enabled components use ' +
      'Framer Motion 11, whose supported range starts at React 18.',
  )
  lines.push('- Tailwind CSS v4 with its Vite or PostCSS integration.')
  lines.push('- A shadcn CLI project initialized with `components.json`.')
  lines.push('')

  lines.push('## Install')
  lines.push('')
  lines.push('Every component, block and template installs the same way:')
  lines.push('')
  lines.push('```sh')
  lines.push(`npx shadcn@latest add ${registryUrl('<item>')}`)
  lines.push('```')
  lines.push('')
  lines.push(
    'Each item declares its own dependencies, so installing one pulls in whatever ' +
      'it imports. Machine-readable index: ' + abs('/r/registry.json'),
  )
  lines.push('')

  lines.push(`## Components (${COMPONENTS.length})`)
  lines.push('')
  for (const section of SECTIONS) {
    const items = COMPONENTS.filter((c) => c.section === section)
    if (!items.length) continue
    lines.push(`### ${section}`)
    lines.push('')
    for (const c of items) {
      lines.push(`- [${c.title}](${abs(`/components/#${c.slug}`)}): ${c.blurb} \`${componentInstall(c)}\``)
    }
    lines.push('')
  }

  lines.push(`## Templates (${TEMPLATES.length})`)
  lines.push('')
  lines.push('Whole screens — app shell with navigation, plus the content inside it.')
  lines.push('')
  for (const t of TEMPLATES) {
    lines.push(`- [${t.title}](${abs(`/examples/${t.slug}/`)}): ${t.blurb} \`${blockInstall(t.slug)}\``)
  }
  lines.push('')

  lines.push(`## Blocks (${BLOCKS.length})`)
  lines.push('')
  lines.push('Sections — drop one into a page you already have.')
  lines.push('')
  for (const b of BLOCKS) {
    lines.push(`- [${b.title}](${abs(`/blocks/${b.slug}/`)}): ${b.blurb} \`${blockInstall(b.slug)}\``)
  }
  lines.push('')

  lines.push('## Notes for code generation')
  lines.push('')
  lines.push(
    '- Import from the local path the CLI wrote (commonly `@/components/pouf/...`), ' +
      'never from a package named `pouf`.',
  )
  lines.push(
    '- Components take explicit props rather than a `className` escape hatch; reach ' +
      'for a variant first, and edit the installed source when none fits.',
  )
  lines.push('- Tones are `purple`, `pink`, `blue`, `mint`, `yellow`, `orange`.')
  lines.push('- `Field` takes a render-prop child: `{(id, describedBy) => <Input id={id} … />}`.')
  lines.push('')
  lines.push('## Docs')
  lines.push('')
  lines.push(`- [Getting started](${abs('/docs/')}): install, theming, and conventions.`)
  lines.push(`- [All components](${abs('/components/')}): every component with live demos.`)
  lines.push(`- [Changelog](${abs('/changelog/')})`)

  return new Response(lines.join('\n') + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
