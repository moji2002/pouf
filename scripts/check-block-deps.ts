/* Verifies every registry:block declares a registryDependency for each module it
 * imports.
 *
 * This is not a style check. A block installs standalone via
 * `npx shadcn add <block>.json`; shadcn only fetches what registryDependencies
 * names. An undeclared import therefore produces a file that lands in the user's
 * repo and does not compile — and nothing in typecheck, the snapshot gate, or the
 * site build catches it, because in THIS repo the import resolves fine.
 *
 * Run: bun scripts/check-block-deps.ts
 */
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const registry = JSON.parse(readFileSync(join(ROOT, 'registry.json'), 'utf8'))

/** registry/pouf/<stem>.tsx -> registry item name, derived from registry.json
 *  rather than hardcoded, so renames can't rot this mapping. */
const fileToItem = new Map<string, string>()
for (const item of registry.items) {
  for (const f of item.files ?? []) {
    const stem = f.path.split('/').pop()!.replace(/\.tsx?$/, '')
    fileToItem.set(stem.toLowerCase(), item.name)
  }
}

const npmOk = new Set<string>(['react', 'react-dom'])

let failures = 0

for (const item of registry.items) {
  if (item.type !== 'registry:block') continue
  const file = item.files?.[0]?.path
  if (!file) continue

  const src = readFileSync(join(ROOT, file), 'utf8')
  const declared = new Set<string>(
    (item.registryDependencies ?? []).map((u: string) =>
      u.replace('https://1st-pouf.worksonmy.dev/r/', '').replace('.json', ''),
    ),
  )
  const declaredNpm = new Set<string>(item.dependencies ?? [])

  const missingReg: string[] = []
  const missingNpm: string[] = []

  for (const m of src.matchAll(/from\s+'([^']+)'/g)) {
    const spec = m[1]!
    if (spec.startsWith('../')) {
      const stem = spec.slice(3).toLowerCase()
      const name = fileToItem.get(stem)
      if (!name) {
        console.error(`  ${item.name}: import '${spec}' maps to no registry item`)
        failures++
      } else if (!declared.has(name)) {
        missingReg.push(name)
      }
    } else if (!spec.startsWith('.') && !npmOk.has(spec)) {
      /* Bare specifier: a real npm package the installed block will need. */
      const pkg = spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0]!
      if (!declaredNpm.has(pkg)) missingNpm.push(pkg)
    }
  }

  const uniq = (a: string[]) => [...new Set(a)].sort()
  if (missingReg.length || missingNpm.length) {
    failures++
    console.error(`✗ ${item.name}`)
    if (missingReg.length) console.error(`    missing registryDependencies: ${uniq(missingReg).join(', ')}`)
    if (missingNpm.length) console.error(`    missing dependencies:         ${uniq(missingNpm).join(', ')}`)
  }
}

if (failures === 0) console.log('✓ every block declares what it imports')
process.exit(failures ? 1 : 0)
