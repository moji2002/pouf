# Templates: real chrome, kept promises

**Date:** 2026-07-21
**Picks up:** `docs/HANDOFF.md` items A and B (templates only)
**Files:** 5 blocks + `table.tsx` + `registry.json`

---

## Problem

`www/src/data/blocks.ts` labels six items TEMPLATES — "whole screens: global chrome
plus the content inside it". Four of them (`inbox`, `kanban`, `settings`, `chat`)
render a bare centred `<div>` with no navigation at all. Only `dashboard` and
`landing` have chrome.

Worse, the blurbs in that same file are written as promises the code does not keep:

| Slug | Blurb promises | Reality |
|---|---|---|
| dashboard | "a filterable revenue chart, and a sortable orders table" | `Segmented` sets state the chart ignores; `Table` has no sort |
| inbox | "a searchable mail list" | no search input exists |
| kanban | "columns you can actually move cards between" | no drag, `onClick={() => {}}` |
| settings | "a save bar that tracks dirty state" | save bar is static, buttons are no-ops |
| chat | "a conversation list" | clicking a conversation changes `active` but the header is hardcoded "Maya B." and the thread never changes |

The site therefore overclaims on its most-visited gallery.

## Goals

1. Every template renders real app chrome and earns the label.
2. Every TEMPLATE blurb becomes literally true.
3. The snapshot gate stays clean.

## Non-goals

- The 12 BLOCKS (handoff item B proper) — separate pass.
- `landing.tsx` — already has navbar/hero/footer chrome.
- shadcn parity gaps (handoff item C).

---

## Design

### 1. One app, five routes

The templates become five screens of one product, "Acme". The nav list is written
into each file (they install standalone; duplication is correct here) and only
`currentPath` differs:

| href | Label | Icon | Tone | Lit in |
|---|---|---|---|---|
| `/` | Overview | `overview` | purple | dashboard |
| `/inbox` | Inbox | `mail` | blue | inbox |
| `/board` | Board | `log` | mint | kanban |
| `/messages` | Messages | `comment` | pink | chat |
| `/settings` | Settings | `settings` | orange | settings |

Real paths rather than `#anchors` so `isActivePath` behaves as documented —
exact-match for `/`, prefix elsewhere (`NavLink.tsx:17`).

Each file gains:

- `Shell` > `Sidebar` — Acme `Blob` + `Heading`, then five `NavLink`s
- a content column opening with `Eyebrow` + `Heading` (the page header)
- `BottomNav` with the same five routes, so mobile has navigation

`BottomNav` is new to **all five** — `dashboard.tsx` currently has no nav
whatsoever below 900px, where `Shell` collapses to a single column and the
`Sidebar` scrolls away above the content.

### 2. Opt-in table sorting

`Table` gains sorting, and it must be **opt-in** so existing demos render
identically and `gallery/harness/golden/table/*` does not churn:

```ts
interface TableColumn<T> {
  // ...existing
  /** Makes the header a sort control. */
  sort?: (a: T, b: T) => number
}
```

A column without `sort` renders exactly the `<Text size="sm" muted>` header it
renders today. A column with `sort` renders a `<button>` with `aria-sort` on the
`<th>`. Sorting is internal state; `rows` stays the source order.

This is the only change to a gated component. Everything else lives in
`registry/pouf/blocks/**`, which has no goldens.

### 3. Kept promises

- **dashboard** — `REVENUE` keyed by `day`/`week`/`month`; the `Segmented` picker
  swaps datasets so the chart redraws. Amount and Status columns get comparators.
- **inbox** — a search `Input` filtering on sender + subject + body, with an
  `Empty` state on no matches. Reply toggles a `Textarea` composer that appends
  to the thread.
- **kanban** — `@dnd-kit/core` drag between columns; drop targets highlight while
  dragging; column counts follow the cards.
- **settings** — a `pristine` baseline object; `dirty` is a comparison against it.
  Save bar disabled unless dirty, Cancel restores, Save re-baselines.
- **chat** — messages become a `Record<convoId, Message[]>`; the thread header
  follows `active`; unread clears on open; the composer appends to the active
  conversation only.

### 4. Master/detail below 900px (inbox, chat)

Desktop keeps three panes (shell 260 + list 320 + detail ~770 at 1440px — it
fits). The current inner `gridTemplateColumns` is a hardcoded inline style that
never collapses, so below 900px the two panes get crushed side by side.

Replace with Tailwind arbitrary variants matching `Shell`'s own 900px breakpoint,
plus a `mobileView: 'list' | 'detail'` state. Below 900px exactly one pane shows;
selecting an item switches to `detail` and reveals a Back button
(`hidden max-[900px]:flex`). Above 900px both panes always show and `mobileView`
is inert.

### 5. Registry plumbing

Each block's `registryDependencies` must gain an entry for every newly imported
module, or `npx shadcn add inbox` installs a file that will not compile:

- all five: `layout`, `nav-link`, `bottom-nav`, `media`, `text`
- inbox: `input`, `empty`
- dashboard: `table` (already present)
- kanban: `@dnd-kit/core` in `dependencies`

Then rebuild: `bunx --bun shadcn@latest build registry.json --output www/public/r`.

---

## Verification

All five handoff gates, in order. The snapshot gate is load-bearing.

| Check | Command | Expected |
|---|---|---|
| Types | `bun run typecheck` | clean |
| Unit tests | `bun test` | 17 pass |
| Snapshot gate | `bun run gate` | GATE CLEAN, 168 demos |
| Registry build | `bunx --bun shadcn@latest build registry.json --output www/public/r` | ok |
| Site build | `cd www && bunx --bun astro build` | 29 pages |

If the gate reports drift in `table/*`, the sorting change was not opt-in —
revert to a plain header when `sort` is absent rather than rebaselining.

---

## Flagged, not fixed

1. **`0 runtime deps`** (`www/src/pages/index.astro:22`) is already untrue — the
   registry ships `@radix-ui/*`, `recharts`, `framer-motion`, `@tabler/icons-react`.
   `@dnd-kit` does not change the truth value. Recommend re-wording to `0 lock-in`
   or `0 config` separately.
2. The handoff's two open pre-commit decisions: `gallery/shoot-pouf.mjs`
   (keep under `gallery/scripts/` or delete) and the concurrent session's
   marketing-copy edits to four `.astro` pages.
