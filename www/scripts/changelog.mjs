// Build-time: turn the registry's git history into a grouped changelog JSON.
// Runs before `astro build` (see package.json prebuild). Filters to the
// commits that touched the shipped library (registry/) and reads as feat/fix.
import { execFileSync } from 'node:child_process'
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const out = resolve(here, '../src/data/changelog.json')
const SEP = '\x1f' // unit separator — cannot appear in a commit subject line

let lines = []
try {
  // execFile (argument array, no shell) — the format string is static; there
  // is no interpolated input, and no shell to interpret metacharacters.
  const raw = execFileSync(
    'git',
    ['log', `--pretty=format:%ad${SEP}%s`, '--date=short', '--', 'registry/'],
    { cwd: resolve(here, '../..'), encoding: 'utf8' },
  )
  lines = raw.split('\n').filter(Boolean)
} catch {
  // Not a git checkout (e.g. a tarball) — ship an empty changelog rather than fail.
}

const groups = {}
for (const line of lines) {
  const [date, subject] = line.split(SEP)
  if (!subject || !/^(feat|fix)(\(|:|!)/.test(subject)) continue
  const month = date.slice(0, 7)
  ;(groups[month] ??= []).push(subject)
}

const changelog = Object.entries(groups)
  .sort((a, b) => (a[0] < b[0] ? 1 : -1))
  .map(([month, subjects]) => ({ month, subjects }))

mkdirSync(dirname(out), { recursive: true })
writeFileSync(out, JSON.stringify(changelog, null, 2) + '\n')
console.log(`changelog: ${changelog.length} months, ${lines.length} registry commits`)
