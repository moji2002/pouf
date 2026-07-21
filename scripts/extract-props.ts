/* Extracts prop tables from the registry source into www/src/data/props.json.
 *
 * Derived rather than hand-written for the same reason llms.txt is: a prop table
 * maintained by hand is wrong by the next release, and a wrong prop table is
 * worse than none — someone trusts it. The JSDoc already sitting above these
 * props is some of the best documentation in the repo (why `label` is required
 * on icon-only buttons, why `sort` is opt-in); this surfaces it instead of
 * asking a human to retype it.
 *
 * Deliberately NOT using the TypeScript compiler API: this repo is on
 * typescript@7, the native port, which ships tsc only — no createSourceFile.
 * Adding typescript@5 purely for docs tooling is a worse trade than a parser
 * scoped to the one declaration shape this codebase actually uses:
 *
 *     interface FooProps {
 *       /** why this exists *\/
 *       bar?: SomeType
 *     }
 *
 * It tracks bracket depth so multi-line unions and function types survive, and
 * it reports what it skipped rather than silently emitting a short table.
 *
 * Run: bun scripts/extract-props.ts
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const SRC = join(ROOT, 'registry/pouf')
const OUT = join(ROOT, 'www/src/data/props.json')

export interface PropDoc {
  name: string
  type: string
  required: boolean
  description: string
}

function stripJsDoc(block: string): string {
  return block
    .split('\n')
    .map((l) => l.replace(/^\s*\/\*\*?/, '').replace(/\*\/\s*$/, '').replace(/^\s*\*/, '').trim())
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Splits an interface body into top-level members, ignoring commas/newlines
 *  that sit inside a nested type. */
function parseBody(body: string): PropDoc[] {
  const props: PropDoc[] = []
  let i = 0
  let pendingDoc = ''

  while (i < body.length) {
    // Whitespace
    if (/\s/.test(body[i]!)) { i++; continue }

    // JSDoc / comments
    if (body.startsWith('/**', i) || body.startsWith('/*', i)) {
      const end = body.indexOf('*/', i)
      if (end === -1) break
      const raw = body.slice(i, end + 2)
      if (raw.startsWith('/**')) pendingDoc = stripJsDoc(raw)
      i = end + 2
      continue
    }
    if (body.startsWith('//', i)) {
      const nl = body.indexOf('\n', i)
      i = nl === -1 ? body.length : nl + 1
      continue
    }

    // A member: name, optional '?', ':', then a type up to the top-level
    // terminator (newline, ';' or ',' at depth 0).
    const m = /^(readonly\s+)?([A-Za-z_$][\w$]*|'[^']+')(\?)?\s*:/.exec(body.slice(i))
    if (!m) { i++; pendingDoc = ''; continue }

    const name = m[2]!.replace(/'/g, '')
    const optional = !!m[3]
    i += m[0].length

    let depth = 0
    const start = i
    while (i < body.length) {
      const c = body[i]!
      if ('([{'.includes(c)) depth++
      else if (')]}'.includes(c)) depth--
      /* Angle brackets need care. `<` only opens a generic when it follows an
       * identifier (`Record<`), and `>` only closes one when it is not the tail
       * of a fat arrow — otherwise `() => void` decrements depth below zero and
       * every following prop is swallowed into this one's type. */
      else if (c === '<' && /[\w$)\]]/.test(body[i - 1] ?? '')) depth++
      else if (c === '>' && body[i - 1] !== '=') depth--
      else if (depth === 0 && (c === ';' || c === ',' || c === '\n')) break
      i++
    }
    const type = body.slice(start, i).trim().replace(/\s+/g, ' ').replace(/[;,]$/, '')

    props.push({ name, type, required: !optional, description: pendingDoc })
    pendingDoc = ''
    i++
  }
  return props
}

/** Finds `interface XProps { ... }` bodies by brace matching. */
function extractInterfaces(src: string): Record<string, PropDoc[]> {
  const out: Record<string, PropDoc[]> = {}
  /* `<[^{]*>` so generic interfaces (TableProps<T>) are matched too — without
   * it they were skipped in silence and Table shipped an empty prop table. */
  const re = /(?:export\s+)?interface\s+([A-Za-z_$][\w$]*)\s*(?:<[^{]*>)?\s*(?:extends[^{]+)?\{/g
  let m: RegExpExecArray | null
  while ((m = re.exec(src))) {
    const open = re.lastIndex - 1
    let depth = 0
    let j = open
    for (; j < src.length; j++) {
      if (src[j] === '{') depth++
      else if (src[j] === '}') { depth--; if (depth === 0) break }
    }
    out[m[1]!] = parseBody(src.slice(open + 1, j))
  }
  return out
}

const result: Record<string, Record<string, PropDoc[]>> = {}
const skipped: string[] = []

for (const file of readdirSync(SRC)) {
  if (!file.endsWith('.tsx') && !file.endsWith('.ts')) continue
  const src = readFileSync(join(SRC, file), 'utf8')
  const ifaces = extractInterfaces(src)

  /* Map InterfaceName -> component: `ButtonProps` documents `Button`. Anything
   * not ending in Props is a data shape (NavItem, Order), not a component API. */
  const stem = file.replace(/\.tsx?$/, '')
  /* Four files (Icon, AlertBell, BottomNav, ErrorBoundary) declare a bare
   * `interface Props`, which would slice down to an empty component name and
   * vanish from the docs. Fall back to the file's first exported component. */
  const firstExport = /export\s+(?:function|class)\s+([A-Z][\w$]*)/.exec(src)?.[1]

  for (const [iface, props] of Object.entries(ifaces)) {
    if (!iface.endsWith('Props')) continue
    const component = iface === 'Props' ? firstExport : iface.slice(0, -'Props'.length)
    if (!component) { skipped.push(`${file}:${iface} (no component name)`); continue }
    if (!props.length) { skipped.push(`${file}:${iface} (no members parsed)`); continue }
    result[stem] ??= {}
    result[stem]![component] = props
  }
}

writeFileSync(OUT, JSON.stringify(result, null, 2) + '\n')

const files = Object.keys(result).length
const comps = Object.values(result).reduce((n, m) => n + Object.keys(m).length, 0)
const props = Object.values(result).reduce(
  (n, m) => n + Object.values(m).reduce((k, p) => k + p.length, 0), 0)
console.log(`✓ ${comps} component APIs (${props} props) from ${files} files -> www/src/data/props.json`)
if (skipped.length) console.log(`  skipped: ${skipped.join(', ')}`)
