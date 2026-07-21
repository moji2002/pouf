# Snapshot-gate harness: the Vite watch-reload feedback loop

**Date:** 2026-07-19
**Files:** `gallery/vite.config.ts`, `gallery/harness/gate.ts`

## Symptom

Rebaselining goldens (`bun run gate:golden`) and full gate runs died,
seemingly at random demos, with:

```
error: evaluate: TypeError: window.captureComputedStyles is not a function
```

Toast-firing portal demos (`toaster`, `alert-bell`) and any multi-state demo
(`row-card`) were the usual victims. `--only <component>` runs failed
deterministically; full runs failed intermittently.

## Root cause — the gate reloads itself

The gate spawns the gallery's Vite dev server, then for each demo injects
`window.captureComputedStyles` (via `page.addScriptTag`) and calls
`snap()`, which **writes the golden/candidate files into
`gallery/harness/golden/**` and `gallery/harness/.candidate/**`** — paths that
live *inside the Vite root*.

Vite's dev server watches the root. Each snapshot write is a file change, so
Vite fires an HMR **page reload**:

```
[vite] (client) page reload harness/golden/toaster/trigger.default.json
```

That reload destroys the page's JS context and wipes the injected
`captureComputedStyles`. The **next** `snap()` — the demo's next state, or the
next demo — evaluates it against the fresh context and throws
`is not a function`.

This explains every observation:
- A demo's first state writes a file → reload → its **second** state throws.
  Single-snap demos often survived; multi-state demos (`toaster/trigger` has
  default+hover+focus) reliably failed.
- `--only` failed deterministically: the one component's writes reloaded its
  own later states with nothing else to absorb the timing.
- Full runs failed intermittently: Vite debounces watch events, so whether a
  given write's reload lands during a later `evaluate` depends on timing.

### How it was proven

A standalone repro that reproduced the *entire* capture flow (goto → inject →
default/hover/focus with settle) but **never called `snap()`** always passed —
the injected global persisted the whole time. Adding server-stdout streaming to
the gate showed the `[vite] page reload harness/golden/…` line firing right
before each `is not a function`. The distinguishing variable was writing files
into the watched tree, nothing else.

Earlier wrong theories (ruled out): cold `optimizeDeps` reload; a per-page
reload; lazy dep discovery from recharts/framer-motion; an unread server-stdout
pipe. Each was plausible and each was wrong — the reload cause was the harness's
own writes.

## Fix

Exclude the harness output from Vite's watcher. One line in
`gallery/vite.config.ts`:

```ts
server: { watch: { ignored: ['**/harness/**'] } }
```

The harness directory is not part of the served app (nothing in
`gallery/src` imports from it), so ignoring it from the watcher costs nothing
and stops the write→reload→context-loss loop. With it in place, `--only
toaster`, `--only row-card`, and `--only alert-bell` — previously 0/N — all
write cleanly, and the capture/injection/diff logic (the snapshot *contract*)
stays byte-for-byte unchanged.

## Note on golden churn

The computed-style JSON serialises CSS custom properties in a
non-deterministic order, so a full `gate:golden` rewrite reorders keys across
many goldens even where values are identical. The gate's JSON diff compares by
property *name*, not position (`diffJson` in gate.ts), so reordered goldens
compare clean — the churn is cosmetic. To keep a rebaseline's git diff minimal,
recapture only the components whose rendering actually changed
(`bun run gate:golden -- --only <component>`).
