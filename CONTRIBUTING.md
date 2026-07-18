# Contributing to Pouf

Thanks for helping. Pouf's whole promise is that its look is stable and coherent, so the contribution workflow is built around one idea: **the snapshot gate is the contract.**

## Setup

```bash
bun install
bunx playwright install chromium   # the gate drives a real browser
```

Monorepo layout:

- `registry/pouf/` — the library source users receive, plus `pouf.css` (the theme) and `demos/` (every component × variant × state)
- `gallery/` — a Vite app rendering each demo at `#/<component>/<demoId>`; the gate captures from it
- `www/` — the Astro site, built on Pouf itself

## The gate

Every component has demos in `registry/pouf/demos/`. The gate captures, for each demo and interaction state:

1. **Computed styles** — `getComputedStyle` for every element (including `::before`/`::after`), so a diff names the exact element and property.
2. **Pixels** — a screenshot, as a backstop for anything the property list misses.

The committed `gallery/harness/golden/` snapshots are the contract.

```bash
bun run gallery          # in one terminal
bun run gate             # in another — must print GATE CLEAN
bun run gate -- --only button   # scope to one component while iterating
```

### Changing how something looks — on purpose

If your change *intends* to alter rendering, the gate will fail. That's correct. To land it:

1. Make the change and confirm the gate failures are exactly what you intended (read the property diffs — they're specific).
2. Recapture the goldens in the **same PR**: `bun run gate:golden`.
3. Include before/after screenshots in the PR description so a reviewer can see the intent.

Never recapture goldens to silence a diff you didn't intend — that's how a regression ships.

### Changing implementation without changing rendering

Refactors (utility classes, cva structure, moving a rule) must keep the gate **clean without recapturing**. If the gate flags only inert differences (added Tailwind theme variables, `#fff`↔`#ffffff`), confirm every pixel diff is zero before rebaselining, and say so in the PR.

## Adding a component

1. Write the component in `registry/pouf/`. No `className`/`style` props — variants only (use `class-variance-authority`).
2. Add demos to `registry/pouf/demos/<file>.tsx` covering every variant and interactive state (`data-subject` + `states` for hover/focus/active). Keep demos deterministic — fixed strings and numbers, no `Date.now()` or randomness.
3. Register it in `registry.json` (npm `dependencies`, internal `registryDependencies`, a `components/pouf/` target).
4. Add a manifest entry in `www/src/data/manifest.ts` so it gets a docs page.
5. `bun run gate:golden` to capture, `bun test`, `bunx tsc --noEmit -p registry`.

## Before you push

```bash
bunx tsc --noEmit -p registry && bunx tsc --noEmit -p gallery
bun test
bun run gate                        # GATE CLEAN
bunx shadcn@latest build registry.json -o www/public/r
```

Commits: conventional (`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`). The changelog is generated from `feat:`/`fix:` commits that touch `registry/`.
