/* Moves the site to a new public origin, in the two places that can't derive it.
 *
 * Why a script and not a find-and-replace: the origin lives in exactly two
 * kinds of place, and they fail differently.
 *
 *   1. `www/src/data/site.ts` — the constant everything in the site derives
 *      from. Getting this wrong is loud: the whole site moves at once.
 *   2. `registry.json` — shadcn fetches this over HTTP and resolves
 *      `registryDependencies` from the absolute URLs inside it, so it has to
 *      carry its own copies. Getting this wrong is silent: pages render the new
 *      host while `npx shadcn add` still points at the old one.
 *
 * A third place LOOKS like it needs updating and must not be touched:
 * `www/public/r/**` is build output. Editing it makes the tree self-consistent
 * until the next `shadcn build` reverts it. Regenerate instead — this script
 * prints the command.
 *
 * Run: bun scripts/set-origin.ts https://pouf.dev
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const SITE_TS = join(ROOT, 'www/src/data/site.ts')
const REGISTRY = join(ROOT, 'registry.json')

const next = process.argv[2]

if (!next) {
  console.error('usage: bun scripts/set-origin.ts <origin>   e.g. https://pouf.dev')
  process.exit(1)
}

/* Reject anything that isn't a bare origin. A trailing slash or a path silently
 * produces `https://x.dev//r/button.json`, which 404s at install time — long
 * after the mistake is out of sight. */
let parsed: URL
try {
  parsed = new URL(next)
} catch {
  console.error(`✗ not a URL: ${next}`)
  process.exit(1)
}
if (parsed.protocol !== 'https:') {
  console.error(`✗ origin must be https (.dev is HSTS-preloaded): ${next}`)
  process.exit(1)
}
if (next !== parsed.origin) {
  console.error(`✗ pass a bare origin with no path or trailing slash — did you mean ${parsed.origin}?`)
  process.exit(1)
}

const siteTs = readFileSync(SITE_TS, 'utf8')
const current = siteTs.match(/export const SITE_ORIGIN = '([^']+)'/)?.[1]

if (!current) {
  console.error(`✗ could not find SITE_ORIGIN in ${SITE_TS} — has the constant been renamed?`)
  process.exit(1)
}
if (current === next) {
  console.log(`origin is already ${next} — nothing to do`)
  process.exit(0)
}

writeFileSync(SITE_TS, siteTs.replace(`'${current}'`, `'${next}'`))

const registry = readFileSync(REGISTRY, 'utf8')
const hits = registry.split(current).length - 1
writeFileSync(REGISTRY, registry.split(current).join(next))

/* If registry.json carried none of the old origin, the two files were already
 * out of step before this run — which is exactly the failure this script exists
 * to prevent, so say so rather than reporting a clean success. */
if (hits === 0) {
  console.warn(`⚠ registry.json contained no occurrence of ${current}. It may already`)
  console.warn(`  have been edited by hand. Check its homepage + registryDependencies.`)
}

console.log(`${current} → ${next}`)
console.log(`  www/src/data/site.ts   1 occurrence`)
console.log(`  registry.json          ${hits} occurrence${hits === 1 ? '' : 's'}`)
console.log('')
console.log('Now regenerate the build output (do NOT edit www/public/r by hand):')
console.log('  bunx shadcn@latest build registry.json -o www/public/r')
console.log('  cd www && bun run build')
console.log('')
console.log('Then verify nothing stale survived:')
console.log(`  grep -rl "${current.replace('https://', '')}" www/public/r www/dist registry.json`)
