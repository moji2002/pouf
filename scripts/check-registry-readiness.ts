/**
 * Checks the repository-specific requirements for submitting 1st-Pouf to the
 * shadcn registry directory.
 *
 * The official CLI remains the source of truth for schema validation:
 *   bunx --bun shadcn@latest registry validate ./registry.json
 *
 * This script covers the directory rules that schema validation cannot infer:
 * a public-namespace entry, a content-free source/catalog, flat built output,
 * build/source parity, local file presence, and resolvable 1st-Pouf dependencies.
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { basename, join } from 'node:path'

type RegistryFile = {
  path: string
  type: string
  target?: string
  content?: string
}

type RegistryItem = {
  name: string
  type: string
  files?: RegistryFile[]
  registryDependencies?: string[]
}

type Registry = {
  $schema?: string
  name?: string
  homepage?: string
  items?: RegistryItem[]
}

type DirectoryEntry = {
  name?: string
  homepage?: string
  url?: string
  description?: string
  logo?: string
}

const ROOT = new URL('..', import.meta.url).pathname
const SOURCE_PATH = join(ROOT, 'registry.json')
const BUILD_DIR = join(ROOT, 'www/public/r')
const CATALOG_PATH = join(BUILD_DIR, 'registry.json')
const DIRECTORY_ENTRY_PATH = join(ROOT, 'docs/shadcn-directory-entry.json')
const REGISTRY_SCHEMA = 'https://ui.shadcn.com/schema/registry.json'
const RESERVED_NAMESPACES = new Set([
  '@shadcn',
  '@ui',
  '@blocks',
  '@components',
  '@block',
  '@component',
  '@util',
  '@utils',
  '@registry',
  '@lib',
  '@hook',
  '@hooks',
  '@theme',
  '@themes',
  '@chart',
  '@charts',
])

const failures: string[] = []

function fail(message: string) {
  failures.push(message)
}

function readJson<T>(path: string): T {
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as T
  } catch (error) {
    fail(`${path}: ${error instanceof Error ? error.message : String(error)}`)
    return {} as T
  }
}

const source = readJson<Registry>(SOURCE_PATH)
const catalog = readJson<Registry>(CATALOG_PATH)
const directoryEntry = readJson<DirectoryEntry>(DIRECTORY_ENTRY_PATH)

if (source.$schema !== REGISTRY_SCHEMA) {
  fail(`registry.json must use ${REGISTRY_SCHEMA}`)
}
if (!source.name) fail('registry.json must define name')
if (!source.homepage) fail('registry.json must define homepage')
if (!source.items?.length) fail('registry.json must define at least one item')
if (!existsSync(join(ROOT, 'LICENSE'))) fail('An open-source LICENSE file is required')

const sourceNames = new Set<string>()
for (const item of source.items ?? []) {
  if (!/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(item.name)) {
    fail(`${item.name}: item names must be flat lowercase slugs`)
  }
  if (sourceNames.has(item.name)) fail(`${item.name}: duplicate registry item name`)
  sourceNames.add(item.name)

  for (const file of item.files ?? []) {
    if ('content' in file) {
      fail(`${item.name}: source files must not contain inline content`)
    }
    if (!existsSync(join(ROOT, file.path))) {
      fail(`${item.name}: source file does not exist: ${file.path}`)
    }
    if ((file.type === 'registry:file' || file.type === 'registry:page') && !file.target) {
      fail(`${item.name}: ${file.type} requires a target`)
    }
  }
}

const expectedNamespace = source.name ? `@${source.name}` : undefined
if (directoryEntry.name !== expectedNamespace) {
  fail(`directory entry name must be ${expectedNamespace}`)
}
if (!directoryEntry.name || !/^@[a-zA-Z0-9][a-zA-Z0-9-_]*$/.test(directoryEntry.name)) {
  fail('directory entry name is not a valid namespace')
} else if (RESERVED_NAMESPACES.has(directoryEntry.name)) {
  fail(`${directoryEntry.name} is a reserved shadcn namespace`)
}
if (directoryEntry.homepage !== source.homepage) {
  fail('directory entry homepage must match registry.json')
}
if (directoryEntry.url !== `${source.homepage}/r/{name}.json`) {
  fail('directory entry URL must resolve flat item JSON files from /r/{name}.json')
}
if (!directoryEntry.description?.trim()) fail('directory entry requires a description')
if (!directoryEntry.logo?.trim().startsWith('<svg')) {
  fail('directory entry requires an inline SVG logo')
}

if (catalog.$schema !== source.$schema) fail('built catalog schema differs from source')
if (catalog.name !== source.name) fail('built catalog name differs from source')
if (catalog.homepage !== source.homepage) fail('built catalog homepage differs from source')

const catalogNames = new Set((catalog.items ?? []).map((item) => item.name))
for (const name of sourceNames) {
  if (!catalogNames.has(name)) fail(`${name}: missing from built registry catalog`)
  const payloadPath = join(BUILD_DIR, `${name}.json`)
  if (!existsSync(payloadPath)) {
    fail(`${name}: missing flat built payload ${payloadPath}`)
    continue
  }

  const payload = readJson<RegistryItem>(payloadPath)
  if (payload.name !== name) fail(`${name}: built payload name does not match filename`)
  if (!payload.files?.length) fail(`${name}: built payload has no files`)
  for (const file of payload.files ?? []) {
    if (typeof file.content !== 'string') {
      fail(`${name}: built payload file is missing content: ${file.path}`)
    }
  }
}
for (const item of catalog.items ?? []) {
  if (!sourceNames.has(item.name)) fail(`${item.name}: built catalog item is not in source`)
  for (const file of item.files ?? []) {
    if ('content' in file) fail(`${item.name}: built catalog must not inline file content`)
  }
}

for (const entry of readdirSync(BUILD_DIR, { withFileTypes: true })) {
  if (entry.isDirectory()) fail(`built registry must be flat: ${entry.name}/`)
  if (entry.isFile() && !entry.name.endsWith('.json')) {
    fail(`built registry contains a non-JSON file: ${entry.name}`)
  }
}

const dependencyPrefix = `${source.homepage}/r/`
for (const item of source.items ?? []) {
  for (const dependency of item.registryDependencies ?? []) {
    if (!dependency.startsWith(dependencyPrefix)) continue
    const dependencyName = basename(dependency, '.json')
    if (!sourceNames.has(dependencyName)) {
      fail(`${item.name}: registry dependency does not exist: ${dependency}`)
    }
  }
}

if (failures.length) {
  console.error(`Registry readiness failed with ${failures.length} issue(s):`)
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log(
  `✓ shadcn directory readiness: ${sourceNames.size} flat items, content-free catalog, namespace ${directoryEntry.name}`,
)
