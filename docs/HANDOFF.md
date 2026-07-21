# Pouf — session handoff

**Date:** 2026-07-21
**Repo:** `~/Documents/pouf` (separate from `~/Documents/zirkel`)
**Branch:** `main`, last commit `fb82b75` — this session's work is **committed but not pushed**.

---

## What Pouf is

The `clay` design system extracted from the zirkel trading app and open-sourced as a
claymorphism UI library, distributed shadcn-style:

```
npx shadcn@latest add https://pouf.dev/r/<item>.json
```

Monorepo (bun workspaces): `registry/` (the components), `gallery/` (the snapshot
gate harness), `www/` (the Astro site).

---

## Verified green as of this handoff

| Check | Command | Result |
|---|---|---|
| Types | `bun run typecheck` | clean |
| Unit tests | `bun test` | 17 pass / 0 fail |
| Snapshot gate | `bun run gate` | **GATE CLEAN** (168 demos) |
| Block deps | `bun run check:deps` | ✓ every block declares what it imports |
| Registry build | `bunx --bun shadcn@latest build registry.json --output www/public/r` | ok |
| Site build | `cd www && bun run build` | 25 pages + `/llms.txt`, no errors |
| Templates behave | `cd gallery && node scripts/verify-templates.mjs` | 10/10 |
| Blocks behave | `cd gallery && node scripts/verify-blocks.mjs` | 16/16 |
| Responsive | `bun run audit:responsive` (needs the static server) | no overflow, no small targets |

Re-run all eight before committing. The gate is the load-bearing one — but note the
two behaviour suites are the only checks that have ever caught a real defect in a
block or template; typecheck, the gate and the builds passed through every one of them.

> The earlier revision of this file recorded "29 pages". That was stale — 25 is
> correct for the current structure: 12 blocks + `/blocks`, 6 templates +
> `/examples`, and `/`, `/docs`, `/components`, `/changelog`, `/theme`. All 18 gallery
> items are present; nothing was lost.

---

## Done this session

### 1. The snapshot gate was broken — fixed with one line

`gallery/harness/gate.ts` writes its goldens into `gallery/harness/golden/**`,
which sits **inside Vite's root**. Vite's watcher saw each write and fired an HMR
page reload mid-run, destroying the page context and wiping the harness's injected
`window.captureComputedStyles` — so the *next* capture threw
`captureComputedStyles is not a function`, and the run produced partial/garbage
goldens.

Fix, in `gallery/vite.config.ts`:

```ts
server: { watch: { ignored: ['**/harness/**'] } },
```

`gate.ts` itself is back at pristine HEAD — the earlier retry wrappers,
`addInitScript` swap and `optimizeDeps` edits were all wrong theories and were
reverted. Full write-up: **`docs/gate-harness-research.md`**.

> Do not "fix" gate.ts. It is the contract. If the gate misbehaves, instrument the
> Vite server stdout first — that is what actually found this.

### 2. Zirkel traces removed (the "no trace of zirkel" requirement)

Swept **rendered strings, comments, and icons**. Verification grep, which now
returns nothing outside `node_modules`/goldens:

```bash
grep -rniE "zirkel|telegram|binance|bybit|btcusdt|deepseek|paper.?trad|circuit.?break|breaker|operator|exchange|trading|trader" \
  --include='*.ts' --include='*.tsx' --include='*.css' --include='*.astro' --include='*.json' --include='*.md' . \
  | grep -vE "node_modules|/golden/|\.candidate|/dist/|/r/"
```

Notable replacements:

- `demos/controls.tsx` — combobox `deepseek-chat`/"Model" → IANA timezones
- `demos/segmented.tsx` — `paper`/`live` → `grid`/`list`, label "Mode" → "View"
- `demos/media.tsx` — badges Long/Short/Breaker/Paper → Shipped/Blocked/At risk/Draft
- `demos/surface.tsx` — RowCard badge "Long" → "Trending"
- `demos/toast.tsx` — "Circuit breaker tripped" → "Payment failed — your card was declined."
- `demos/bottom-nav.tsx` — `href: '#positions'` → `'#projects'`
- `demos/status.tsx` — ModeBanner demo id `paper` → `draft` (golden renamed to match)
- `demos/disclosure.tsx` — "Pause during announcements at operator discretion" →
  support hours; Field "Slippage tolerance" → "Autosave delay (s)"
- `demos/charts.tsx` — BarChart `dataKey="channel"` → `"source"`
- **`Icon.tsx` — `chart: IconChartCandle` → `IconChartBar`.** A candlestick glyph was
  the last *visual* trace; no string search would have caught it.
- Comments de-domained across `pouf.css`, `AlertBell`, `ErrorBoundary`, `Toast`,
  `toaster`, `status`, `tone`, `text`, `layout`, `readout`, `charts`, `pagination`,
  `feedback`, `controls`, `Segmented`, `BottomNav`, `numberinput-math`, and
  `tests/numberinput-math.test.ts`.

Goldens were rebaselined **only** for the 12 affected components
(`accordion alert-bell badge bottom-nav collapsible combobox error-boundary icon
row-card segmented toast toaster`) via `bun run gate:golden --only <name>`, one run
per component, to avoid key-order churn across all 168 files.

### 3. Toaster demo now shows all toast options

`registry/pouf/demos/toaster.tsx` `trigger` demo renders Default / Success / Error /
Warning / Info / With-action, each with a `description`.

### 4. Components page — width tiers fixed

`www/src/pages/components.astro`. Previous layout (sticky TOC + cushion cards) kept;
the demo grid was rebuilt.

**The bug:** the grid was `repeat(auto-fit, minmax(232px, 1fr))` with `--med` as
`span 2`. `auto-fit` collapses tracks that are empty *across the whole grid*, so a
card whose demos were all `span 2` in a 3-track grid silently became a **2-track
grid — every demo full width**. A one-line `<Text>` demo was rendering at 890px.

**The fix:** a fixed six-column base with explicit spans.

```css
.comp-demos { grid-template-columns: repeat(6, 1fr); }
.comp-demo        { grid-column: span 2; }   /* 3 per row */
.comp-demo--med   { grid-column: span 3; }   /* 2 per row */
.comp-demo--wide  { grid-column: 1 / -1; }   /* 1 per row */
.comp-demo:only-child { grid-column: 1 / -1; }
```

Tiers are the `WIDE`/`MED` sets at the top of `components.astro`.

### 5. Blocks vs Templates split (in progress — structure done, content not)

The user's complaint: *"template page display blocks not templates"* — correct.
Only 2 of the 18 items rendered any chrome (`grep -l "Shell\|Sidebar\|Navbar\|BottomNav"`
matched only `dashboard.tsx` and `landing.tsx`).

`www/src/data/blocks.ts` now exports:

- **`TEMPLATES`** (6) — whole screens: `dashboard, inbox, kanban, settings, chat, landing`
- **`BLOCKS`** (12, categorised) — sections: `login, onboarding, pricing, blog,
  profile, feed, todo, calendar, music, weather, game, quiz`
- `ALL_BLOCKS`, `BLOCK_CATEGORIES`

Pages:

- `/examples` → **Templates** only (`examples/index.astro`, `examples/[slug].astro`)
- `/blocks` → **new**, grouped by category (`blocks/index.astro`, `blocks/[slug].astro`)
- `Site.astro` nav: Docs · Components · **Blocks** · Templates · Changelog
- `index.astro`: 5-stat strip (components / blocks / templates / 0 deps / MIT),
  templates showcase + new blocks showcase

Block detail pages present a *section* on a page background; template detail pages
keep the browser-window frame.

---

### 6. Templates: real chrome and kept promises ✅ (spec: `docs/superpowers/specs/2026-07-21-template-chrome-design.md`)

All five app templates (`dashboard`, `inbox`, `kanban`, `settings`, `chat`) now share
one "Acme" nav — the same five routes in each file, differing only in `currentPath`
— wrapped in `Shell` + `Sidebar` + `BottomNav`, with an `Eyebrow`/`Heading` page
header. `BottomNav` is new to all five: `dashboard` previously had **no** navigation
at all below 900px.

The `TEMPLATES` blurbs in `blocks.ts` were written as promises the code didn't keep.
They are now literally true, each verified by driving the real page:

| Template | Was | Now |
|---|---|---|
| dashboard | range picker set state the chart ignored; table had no sort | 3 datasets keyed by range; `Table` gained **opt-in** sorting |
| inbox | no search input existed | search filters sender/subject/body, real empty state, working reply composer |
| kanban | `onClick={() => {}}` | `@dnd-kit/core` drag **plus** ←/→ buttons (native drag has no touch support) |
| settings | save bar was static, buttons no-ops | dirty tracked against a pristine baseline; Cancel restores, Save re-baselines |
| chat | header hardcoded "Maya B."; every convo showed Maya's messages | per-conversation threads; header follows selection; unread clears |

`inbox` and `chat` also collapse to master/detail below 900px (list → tap → detail
with a Back button) instead of crushing two panes side by side.

`Table` sorting is **opt-in by design**: a column without a `sort` comparator renders
the exact header it always did, so all 168 goldens stayed byte-identical. If you ever
see `table/*` drift, that property was broken — fix it rather than rebaseline.

### 7. Interaction verification

Chrome and copy were checked by driving the built site with Playwright, not by
reading the source: 10/10 behaviours pass (range→chart, sort order, search filter,
empty state, reply composer, card move, dirty→enabled, save→re-baseline, thread
switch, mobile master/detail). The script lives in the session scratchpad; recreate
it rather than trusting this list if you change these files.

---

### 8. The 12 BLOCKS now keep their promises too ✅

Same treatment as the templates, across `login onboarding pricing blog profile feed
todo calendar music weather game quiz`. Highlights: login got validation + password
toggle + a magic-link mode; onboarding blocks advance until each step is filled and
ends on a recap proving state survived; blog filters by category; profile derives the
follower count from follow state so it cannot desync; feed grew real comment threads;
todo got Enter-to-add and Clear completed; calendar got a day picker, now-line and
computed free slots; music got a working transport and queue; weather a city picker;
game a functioning inventory that moves the leaderboard; quiz a real 5-question run
with instant feedback and a scored result.

**Three defects found by verifying rather than reading:**

1. **`todo` printed every task twice.** `Checkbox` renders a *visible* `<label>` when
   given `label`, and `todo.tsx` passed `label={i.text}` *and* rendered
   `<Text>{i.text}</Text>` beside it. Visible on the live site. Fixed by adding an
   opt-in `hideLabel` prop to `Checkbox` — keeps the accessible name, drops the second
   copy, and leaves the `muted` styling that marks a task done. Opt-in, so the
   checkbox goldens did not move.
2. **`music` auto-played on mount**, ticking once a second and cycling the queue
   forever on a docs page — unwanted motion that also ignores reduced-motion. Now
   starts paused, which makes Play the obvious thing to press.
3. **`feed`'s like/comment buttons had no accessible name** — icon + a bare number, so
   a screen reader announced "button, 42". Given real `label`s. Its Share button was
   also the last `onClick={() => {}}` in the gallery; it now latches to a real state.

`todo`'s Enter-to-add is a `<form onSubmit>` rather than a new `Input` prop — the
platform gives Enter-to-submit for free, and widening a shared component's API for one
call site is the worse trade. Note the submit button carries **no** `onClick`: a click
on a submit button fires both handlers, which added the task twice.

### 9. New tooling

- **`bun run check:deps`** (`scripts/check-block-deps.ts`) — verifies every
  `registry:block` declares a `registryDependency` for each module it imports. This
  gap is invisible locally (imports resolve fine in the monorepo) but ships a file that
  will not compile into the user's repo. It caught 4 missing declarations this session.
- **`bun run props`** (`scripts/extract-props.ts`) — regenerates
  `www/src/data/props.json` for the component prop tables. Runs automatically in
  `www`'s `prebuild`/`build`; run it by hand after changing a `*Props` interface if
  you want to see the table without a full build.
- **`gallery/scripts/verify-blocks.mjs`** and **`verify-templates.mjs`** — drive the
  built site with Playwright and assert each blurb's promise. 16/16 and 10/10. These
  found all three defects above; typecheck, the gate, and the site build found none of
  them. Run from inside `gallery/`.

### 10. Parity gaps: props tables + llms.txt ✅

**Props/API tables** (gap-analysis rank 1) now render on every component card as a
collapsed `Props (n)` panel — prop, type, required marker, and notes.

They are **generated, not written**: `bun run props` (`scripts/extract-props.ts`)
parses `interface *Props` out of `registry/pouf/*.tsx` into
`www/src/data/props.json` — 52 component APIs, 249 props. A hand-maintained table is
wrong by the next release, and a wrong prop table is worse than none because someone
trusts it. It also surfaces the JSDoc already in the source, which is some of the best
writing in the repo (why `label` is required on icon-only buttons, why `sort` is
opt-in) and was previously invisible to users.

Not using the TypeScript compiler API is deliberate: this repo is on `typescript@7`,
the **native port, which ships `tsc` only — there is no `createSourceFile`**. Adding
`typescript@5` purely for docs tooling was the worse trade. Two parser bugs worth
knowing about if you extend it, both caught by spot-checking output rather than by it
throwing:

- Treating `<`/`>` as balanced brackets breaks on `() => void` — the `>` in the fat
  arrow drove depth negative and swallowed every later prop into one type string
  (165 props extracted instead of 249).
- `interface TableProps<T>` did not match the declaration regex, so `Table` and `Icon`
  emitted **empty tables in silence**. Four files also declare a bare
  `interface Props` and need the file's first export as the component name.

**`llms.txt`** (rank 8) is served at `/llms.txt` from
`www/src/pages/llms.txt.ts`, generated from the same manifests the site renders from,
for the same anti-drift reason.

`www/package.json` now generates both artefacts in `prebuild`/`build`, matching how
`changelog.json` already worked, and `props.json` is gitignored as generated. The
astro scripts were also switched to `bunx --bun astro …`: `bun run build` previously
failed outright on this repo's Node 20 (astro requires ≥22.12), which is why the only
documented build command was the manual one.

### 11. Item D: one real defect, one false report

- **`ScrollArea` — real.** It clipped its last line with no scrollbar anywhere.
  Cause: Radix `ScrollArea` defaults to `type="hover"`, so the bar only exists once a
  pointer is already inside — touch and keyboard users never saw it at all, and a
  capped area read as *content that just ends*. Now `type="auto"`. `scroll-area`
  goldens rebaselined (the only intentional rebaseline this session).
- **`AspectRatio` — not reproducible.** The handoff described "empty purple boxes";
  the goldens show correctly labelled "16:9 container" / "1:1 container" tiles. The
  demos could better show *why* you reach for AspectRatio (media that must not shift
  layout), but nothing is broken. Left alone.
- **`Sheet` / `HoverCard` tall empty cards** — untouched. This is components-page
  layout (the `WIDE`/`MED` tiers in `components.astro`), not a demo defect.

Also checked and **not** a bug: the stray-looking `}` after `.pouf-scroll__thumb` in
`pouf.css` closes `@layer components {` from line 238. Braces balance 255/255.

### 12. Dark mode ✅ (gap-analysis rank 2)

Opt-in via `<html data-theme="dark">`. `registry/pouf/pouf.css` gained a
`[data-theme='dark']` block; the site has a nav toggle plus a pre-paint inline
script in `Site.astro` (localStorage → `prefers-color-scheme` → light).

**Two things here are load-bearing and easy to undo by accident.**

**1. `--on-accent`.** Buttons, Badges, Blobs, Avatar fallbacks and active NavLinks
paint `--ink` on a *pastel* fill. Flip `--ink` to near-white for dark mode and you get
`#efe9ff` on `#c9a8ff` — unreadable, and it would have silently violated the rule
stated at the top of `pouf.css` ("ink on pastel, never white" — the upstream reference
failed WCAG AA at 1.25:1 and this fork deliberately fixed it).

So text-on-accent now reads `--on-accent`, which is `var(--ink)` in light and pinned
dark (`#2a2145`) in dark. Sites: `Button.tsx` (the `solid` variant only — `quiet` is
transparent and keeps `--ink`), `media.tsx` (Blob, Badge), `avatar.tsx`, and in
`pouf.css` the `error-note`, `tab--active`, `mode`, `toast*` and `navlink--active`
rules. **If you add a component that fills itself with an accent, its text must use
`--on-accent`.**

**2. The clay recipe was re-derived, not re-coloured.** A cushion asserts light from
above: inner top highlight, inner floor, outer drop. Those surfaces do not all change
between themes, so the tokens split two ways:

- `--pouf-card` / `--pouf-row` / `--pouf-field` wrap `--surface`, which goes white →
  near-black. A 0.9-alpha white highlight there reads as a blown-out rim, so it drops
  to ~0.05 and the floor carries the depth.
- `--pouf-control` / `--pouf-blob` sit on a **pastel that is identical in both
  themes**. Their inner values are nearly untouched; only the outer drop deepens,
  because only that is cast onto the dark page.

Treating all six the same is how a claymorphism dark mode ends up looking flat.

There is deliberately **no `@media (prefers-color-scheme: dark)`** in `pouf.css`. That
would make the theme a property of the visitor's machine rather than the document, and
would make every screenshot environment-dependent — including this repo's own gate.
Host apps decide; the site's inline script is the reference implementation.

**Gate note.** Adding `--on-accent` to `:root` legitimately drifted all 223 snapshots:
the harness records every custom property, and a new inherited one appears on every
element. Its value is `#3a2e5c`, identical to `--ink`, and the harness's *pixel* diff
(`diffPixels`) reported nothing — only the JSON. Rebaselined on that basis. If you see
a mass diff naming exactly one new `--token`, this is the benign shape of it; a real
regression shows pixel failures too.

### 13. Preview ⇄ Code ⇄ Props tabs ✅ (rank 3)

`components.astro` replaced two stacked `<details>` with a real ARIA tablist
(roving tabindex, Left/Right/Home/End, `aria-selected`, `hidden` panels). Selected
state is a pressed cushion, matching `Segmented` — depth as the selection signal.
Preview is the default panel **deliberately**: `DemoBox` is `client:visible`, and
inside a `display:none` panel an IntersectionObserver never fires, so demos in a
hidden default would never hydrate.

### 14. Theme customizer ✅ (rank 6)

New page `/theme` (`www/src/components/ThemeCustomizer.tsx`). Colour pickers, radius
and cushion-lip sliders, a live preview, and copy-paste `@theme` + `:root` output.

The preview works by setting the custom properties on **one wrapper element** and
letting the cascade reach unmodified components — no themeable mode, no prop drilling.
Verified: overriding `--purple` re-paints a real `Button` to `rgb(123, 224, 192)`.
Drag the lip slider to 0 to watch the whole system flatten, which is the fastest
demonstration of what the cushion actually does.

### 15. ⌘K palette + rewritten install docs ✅ (ranks 4, 7)

**⌘K** — `www/src/components/CommandPalette.tsx`, one React island rendering both the
nav trigger and a portalled dialog. Indexes `COMPONENTS`, `TEMPLATES` and `BLOCKS`
from the existing manifests, so it cannot drift from the site. Combobox/listbox ARIA
with `aria-activedescendant`, focus trapped and returned to the trigger, `/` opens only
when focus is not in a field. 27/27 browser checks.

**Docs** — `www/src/pages/docs/index.astro` rewritten from a 3-step quick start into 8
sections (prerequisites, the stylesheet, quick start, theming, dark mode, conventions,
accessibility, blocks vs templates) with a sticky TOC.

That work turned up a correction worth keeping: **re-theming must override `@theme`,
not just the `:root` aliases.** A few components (`checkbox`, `cta`, `NumberInput`,
`surface`) use compiled Tailwind utilities that read `--color-purple` directly rather
than the `--purple` alias — verified against the compiled CSS, not assumed. Because
`:root` writes `--purple: var(--color-purple)` as a live reference, overriding
`@theme` reaches everything while overriding `--purple` alone would miss those. The
theme customizer already emits both, so it was correct by construction.

`clsx` was added to `www/package.json` (it was only a `registry` dependency, and the
palette pulls in registry components that import it).

### 16. Dark mode exposed a latent contrast bug

`.code-block` in `www/src/styles/site.css` set `background: var(--ink)` with a
**hardcoded** `color: #f0e9ff`. `--ink` inverts between themes, so in dark mode this
was light text on a near-identical light background — **every install command on the
docs site was invisible**. Now `color: var(--bg)`, which resolves to that exact hex in
light mode, so light rendering is untouched.

Two smaller siblings fixed with it: the full `CopyCommand`'s Copy button paints on a
pastel and now uses `--on-accent`; the compact chip's label sat on the inverting
`--ink` chip and now uses `--bg` (the copied state is already carried by the word
changing, so no colour signal is lost).

**Rule of thumb this leaves behind:** any element whose *background* is `var(--ink)`
must take its *foreground* from `var(--bg)`, never a literal. Scan for it with
`grep -rnoE '#[0-9a-fA-F]{6}' www/src` — remaining hits are legitimate (palette
defaults in the customizer, values inside `<Code>` samples, and `#292d3e`, which
matches the always-dark syntax-highlight theme).

### 17. Responsive audit — 5 real bugs, all fixed ✅

`bun run audit:responsive` (`gallery/scripts/audit-responsive.mjs`) screenshots all 11
pages at 1440px and 390px and asserts two things by measurement: no horizontal
overflow, and no tap target under the WCAG 2.2 AA minimum (2.5.8). It started at
**3 overflows + small targets on every page**; it now reports `none`.

**1. The command palette stole focus on page load.** Its focus effect also runs on
mount with `open === false`, so it called `triggerRef.focus()` during hydration. The
browser scrolls a focused element into view — which dragged the horizontally
scrollable mobile nav to `scrollLeft: 471` (fully right). Combined with a sticky brand
that was only 92% opaque, the links bled through the logo and the header read as
overlapping garbage **on every page**. Fixed with a `wasOpen` ref (restore focus only
when a palette that *was* open closes) plus an opaque brand.

**2. `.wall`'s responsive rules had never worked.** The component wall is rendered by a
**React island**, so it carries no `data-astro-cid-*` attribute — and Astro compiles
scoped `<style>` to `.wall[data-astro-cid-xyz]`. Every `.wall` breakpoint in
`index.astro` was dead: it computed to four 73.5px columns at 390px. Fixed with
`:global(.wall)`.

> **Generalise this.** Scoped Astro styles never reach island-rendered markup. If you
> style a class that a `.tsx` component emits, it needs `:global()` or the rule is
> decoration.

**3. A `span 2` tile in a 1-column grid.** Even after `.wall` collapsed, tiles kept
`grid-column: span 2`, and Grid answers that by generating an **implicit** second
column — so the row was twice the container width. Collapsing a track list is not
enough; the items have to be un-spanned too (`.wall > * { grid-column: 1 / -1 }`).

**4. Inline `<code>` did not wrap.** Tokens like `@tailwindcss/postcss` are single
unbroken words wider than a phone, pushing the whole page. Fixed globally with
`:not(pre) > code { overflow-wrap: anywhere }`.

**5. Tap targets under 24px** across nav, footer, back-links, `Breadcrumb`,
`Collapsible`, `Navbar` and `Footer`. All now ≥24px via padding plus a compensating
negative margin, so nothing moved visually. The four registry components meant a
**deliberate golden rebaseline** — 5 snapshots, each diff exactly `height 19.5px →
24px`. `Navbar`'s active link also gained `--on-accent` (it is an accent fill and
would have gone unreadable in dark mode).

**Two audit false positives worth keeping in mind** — both fixed in the script, not
the site: `getBoundingClientRect` reports geometry even when an ancestor clips, so the
`overflow:hidden` decorative blob layer looked like a page-wide overflow; and Radix
renders an `opacity:0`, `aria-hidden` native `<input>` beside every switch/checkbox,
which is not the real target. The script now also honours SC 2.5.8's "inline"
exemption for links inside a sentence.

---

## Not done — pick up here

### C. Remaining parity gaps

Full report: **`docs/shadcn-gap-analysis.md`**. All eight are now done:

1. ~~Props/API tables~~ ✅ §10
2. ~~Dark mode~~ ✅ §12
3. ~~Preview ⇄ Code tabs~~ ✅ §13
4. ~~⌘K search~~ ✅ §15
5. ~~Blocks page~~ ✅ (earlier session)
6. ~~Clay Theme Customizer~~ ✅ §14
7. ~~Deeper install docs~~ ✅ §15
8. ~~`llms.txt`~~ ✅ §10

**Worth doing next, in rough order:**

- **Dark-mode contrast audit.** The palette was chosen by eye and verified visually,
  not measured. Run the pastels and `--muted` against the dark `--bg`/`--surface` for
  WCAG AA. `--muted` on `--surface` is the likeliest failure.
- **Dark goldens.** The gate only captures the default (light) theme, so nothing
  guards dark against regression. A `--theme dark` pass over the harness, writing to a
  parallel golden dir, would close that hole.
- Per-component doc pages (the site is one long `/components` page; shadcn gives each
  component its own route, which is better for deep links and search).
- The `AspectRatio` demos could show *why* the primitive exists (media that must not
  shift layout) rather than a labelled colour block.

### D. ~~Smaller UI nits~~ — resolved or dismissed, see §11

---

## Working notes

### The gate's widest failure mode: Tailwind's text scanner ← read before editing any registry file

A change to **one** block drifted **223 snapshots across all 168 demos**. Every diff
was the same two lines:

```
--tw-outline-style: "undefined" → "solid"
--radius-2xl:       "undefined" → "1rem"
```

Tailwind v4 emits an `@property` registration for each theme token a utility touches,
and those registrations are **document-wide** — so they land in the computed styles of
every element on the page, including SVG internals. Using one new utility anywhere in
the registry moves the baseline for the entire gate.

Three things make this much easier to hit than it sounds:

1. **The scanner reads source as plain text.** It does not parse JavaScript, so it
   cannot distinguish a class name from prose, a comment, or an object key.
2. **Bare `outline` is a utility in v4** (so is `border`, `ring`, `shadow`, `grid`).
   The pre-existing `focus:outline-none` in `Input.tsx` is *not* the same token and
   never registered anything — which is why the baseline was clean.
3. Consequently, the English word "outline" inside a code comment generated the
   utility. A comment written *to warn against the utility* regenerated it, twice.
   Naming it in the style object's property key did it a third time.

**Rules of thumb:**

- Prefer inline `style={{…}}` in `registry/pouf/blocks/**` for anything decorative.
  Inline styles never enter the utility layer.
- Prefer arbitrary values (`rounded-[18px]`) over theme utilities (`rounded-2xl`) when
  a new token would otherwise be introduced.
- If the gate fails with hundreds of diffs that all name the *same* custom property,
  do not rebaseline. Grep the whole repo — including comments and prose — for the bare
  word, and delete it. `grep -rnw '<word>' registry gallery www/src`.
- `docs/**.md` is **not** scanned (verified: this section names all five utilities and
  the gate stays clean), so prose about CSS belongs here rather than in a comment
  inside `registry/`.

### The gate is flaky when chained — rerun it standalone before believing a failure

`bun run gate` failed ~4 times this session with a stack ending in
`net::ERR_CONNECTION_REFUSED at http://localhost:4700/...` — **not** a snapshot diff.
Every time, rerunning it on its own passed with `GATE CLEAN`.

Observed: it fails when chained after other `bun` commands (`typecheck && test &&
gate`) and passes when run alone; port 4700 is free before successful runs.

`gate.ts` spawns `vite --port 4700 --strictPort` and then polls `waitForServerUp`.
The plausible mechanism — **unconfirmed**, do not treat as fact — is that the poll can
be satisfied by a predecessor server still shutting down, while the new Vite has
already exited on the strict-port clash; the old one then dies mid-run. I did not
change `gate.ts` to fix this, because that file is the contract and the diagnosis is
not proven.

**Practical rule:** run `bun run gate` as its own command, and treat a
CONNECTION_REFUSED failure as noise until a standalone rerun reproduces it. A real
failure names custom properties or snapshot names, not a socket.

### Serving the site

`http://localhost:4821` is **`python -m http.server` (PID 96953) serving
`www/dist`** — a static snapshot, *no HMR*. Every CSS/astro edit needs
`cd www && bunx --bun astro build` before you re-screenshot. (This cost a wasted
screenshot round-trip; `scrollHeight` not changing is the tell.)

### Screenshots

`gallery/shoot-pouf.mjs` (still untracked — decide keep-vs-delete before committing).
Must run with cwd inside `gallery/` — Node resolves `playwright` from the *script's*
directory, and only `gallery/node_modules` has it. This bites any ad-hoc Playwright
script too: write it into `gallery/`, not the scratchpad.

Output now defaults to a gitignored `.shots/` rather than a hard-coded scratchpad path
from a long-dead session; override with `SHOOT_OUT`.

```bash
cd gallery && node shoot-pouf.mjs http://localhost:4821/components/ comp 1440 1000 "0,900,1800"
```

Viewport-scoped, not `fullPage`: full-page shots exceed the 2000px image limit.

### Standing constraints (from CLAUDE.md — these persist)

- **Never create a git branch without explicit confirmation.** Commit on the current
  branch, including `main`.
- **Always run the full type-check before committing** — not a grep'd/partial one.
- **Always get explicit confirmation before `git push`.** Committing ≠ pushing.
- Artifacts are saved locally, never published as hosted claude.ai Artifacts.
- Optimistic UI: Zustand + immer, never React Query cache surgery.
- Research before building; write findings to `docs/<topic>-research.md`.

### The commit

Everything above is in `fb82b75` on `main`, **not pushed** — pushing needs explicit
confirmation per CLAUDE.md.

Two things folded into it that were previously open questions:

1. `gallery/shoot-pouf.mjs` was kept rather than deleted. It is now portable
   (`SHOOT_OUT`, defaulting to a gitignored `.shots/`) instead of pinned to a dead
   session path, and it sits alongside the other `gallery/scripts/` tooling.
2. **A concurrent session's marketing copy edits** to
   `www/src/pages/{index,changelog,examples/index,docs/index}.astro` went in with it.
   By the time this session finished, those files had been substantially rewritten on
   top of those edits — `docs/index.astro` completely, `index.astro`'s stat strip and
   `.wall` rules — so the two were no longer separable into distinct commits. The
   commit message says so explicitly.

### Fixed: the "0 runtime deps" claim ✅

`www/src/pages/index.astro` advertised **"0 runtime deps"**. That was never true —
the registry ships `@radix-ui/*` (23 packages), `recharts`, `framer-motion`, and
`@tabler/icons-react`; `@dnd-kit/core` changed the count, not the truth value. Now
reads **"0 lock-in"**, which is the defensible version of the same claim: nothing
installs `pouf` itself, the source lands in your repo. Rationale is in a comment
beside the stat so it does not silently regress.

Note the `STATS` array lives in Astro **frontmatter** — plain TypeScript, so `/* */`
comments, not JSX `{/* */}`.
