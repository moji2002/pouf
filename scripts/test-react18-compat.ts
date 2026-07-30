/**
 * Verifies the published shadcn payloads—not the monorepo source tree—against
 * React 18. The main workspace intentionally stays on React 19, so compiling it
 * alone cannot prove that an installed 1st-Pouf component works in an older app.
 *
 * This test materializes every /r/<item>.json file into an isolated temporary
 * consumer, installs React 18 plus the exact dependency ranges 1st-Pouf develops
 * against, type-checks every component/block/template with React 18 types, and
 * server-renders both a core control and a Framer Motion component.
 */
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { spawnSync } from 'node:child_process'

const ROOT = new URL('..', import.meta.url).pathname
const REGISTRY_DIR = join(ROOT, 'www/public/r')
const workspacePackages = [
  JSON.parse(readFileSync(join(ROOT, 'registry/package.json'), 'utf8')),
  JSON.parse(readFileSync(join(ROOT, 'www/package.json'), 'utf8')),
  JSON.parse(readFileSync(join(ROOT, 'gallery/package.json'), 'utf8')),
]
const knownVersions = Object.assign({}, ...workspacePackages.map((pkg) => pkg.dependencies ?? {}))
const registry = JSON.parse(readFileSync(join(REGISTRY_DIR, 'registry.json'), 'utf8'))
const testDir = mkdtempSync(join(tmpdir(), 'pouf-react18-'))

function run(command: string, args: string[]) {
  const result = spawnSync(command, args, {
    cwd: testDir,
    env: process.env,
    stdio: 'inherit',
  })
  if (result.error) throw result.error
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} exited with ${result.status}`)
  }
}

try {
  const dependencies = new Set<string>()
  const writtenFiles = new Map<string, string>()

  for (const entry of registry.items) {
    const payload = JSON.parse(
      readFileSync(join(REGISTRY_DIR, `${entry.name}.json`), 'utf8'),
    )
    for (const dependency of payload.dependencies ?? []) dependencies.add(dependency)

    for (const file of payload.files ?? []) {
      if (typeof file.content !== 'string' || typeof file.target !== 'string') continue
      const previous = writtenFiles.get(file.target)
      if (previous !== undefined && previous !== file.content) {
        throw new Error(`Conflicting published content for ${file.target}`)
      }
      writtenFiles.set(file.target, file.content)
    }
  }

  const consumerDependencies: Record<string, string> = {
    react: '18.3.1',
    'react-dom': '18.3.1',
  }
  for (const dependency of [...dependencies].sort()) {
    const version = knownVersions[dependency]
    if (!version) throw new Error(`No pinned workspace version for ${dependency}`)
    consumerDependencies[dependency] = version
  }

  const packageJson = {
    name: 'pouf-react18-compat',
    private: true,
    type: 'module',
    dependencies: consumerDependencies,
    devDependencies: {
      '@types/lodash': '^4.17.0',
      '@types/react': '^18.3.0',
      '@types/react-dom': '^18.3.0',
      typescript: workspacePackages[0].devDependencies.typescript,
    },
  }
  writeFileSync(join(testDir, 'package.json'), `${JSON.stringify(packageJson, null, 2)}\n`)

  for (const [target, content] of writtenFiles) {
    const output = join(testDir, target)
    mkdirSync(dirname(output), { recursive: true })
    writeFileSync(output, content)
  }

  writeFileSync(
    join(testDir, 'tsconfig.json'),
    `${JSON.stringify(
      {
        compilerOptions: {
          strict: true,
          target: 'ES2022',
          module: 'ESNext',
          moduleResolution: 'bundler',
          jsx: 'react-jsx',
          lib: ['ES2022', 'DOM', 'DOM.Iterable'],
          skipLibCheck: false,
          noUncheckedIndexedAccess: true,
          types: ['react', 'react-dom'],
        },
        include: ['components/**/*.ts', 'components/**/*.tsx', 'smoke.tsx'],
      },
      null,
      2,
    )}\n`,
  )

  writeFileSync(
    join(testDir, 'smoke.tsx'),
    `import React from 'react'
import { renderToString } from 'react-dom/server'
import { Button } from './components/pouf/Button'
import { Progress } from './components/pouf/progress'

const html = renderToString(
  <main>
    <Button>React 18 control</Button>
    <Progress value={64} label="React 18 motion progress" />
  </main>,
)

if (!html.includes('React 18 control') || !html.includes('pouf-progress')) {
  throw new Error('React 18 server-render smoke output was incomplete.')
}

console.log('✓ React 18 server render: core + Framer Motion components')
`,
  )

  run('bun', ['install', '--no-progress'])

  const installedReact = JSON.parse(
    readFileSync(join(testDir, 'node_modules/react/package.json'), 'utf8'),
  ).version
  const installedReactDOM = JSON.parse(
    readFileSync(join(testDir, 'node_modules/react-dom/package.json'), 'utf8'),
  ).version
  if (!installedReact.startsWith('18.') || !installedReactDOM.startsWith('18.')) {
    throw new Error(`Expected React 18, got react@${installedReact} and react-dom@${installedReactDOM}`)
  }

  const tsc = join(testDir, 'node_modules/.bin/tsc')
  if (!existsSync(tsc)) throw new Error('TypeScript executable was not installed')
  run(tsc, ['--noEmit', '-p', '.'])
  console.log(`✓ React 18 type-check: ${writtenFiles.size} published registry files`)

  run('bun', ['smoke.tsx'])
  console.log(`✓ React compatibility verified with react@${installedReact}`)
} finally {
  if (process.env.POUF_KEEP_COMPAT_DIR === '1') {
    console.log(`Kept compatibility workspace: ${testDir}`)
  } else {
    rmSync(testDir, { recursive: true, force: true })
  }
}
