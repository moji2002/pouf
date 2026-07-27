import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { COMPONENTS } from '../data/manifest'
import { TEMPLATES, BLOCKS } from '../data/blocks'
import { Icon } from '../../../registry/pouf/Icon'

/** One entry in the palette: a component doc, a template, or a block. `group`
 * is shown as a small trailing tag on the row (the section for a component,
 * the category for a block) — it also feeds the search so "forms" or "auth"
 * surfaces the right things even when the title doesn't say it. */
interface Item {
  kind: 'Component' | 'Template' | 'Block'
  id: string
  title: string
  blurb: string
  group: string
  href: string
}

/* Built once from the site's own manifests — the same data the /components,
 * /examples and /blocks index pages render from, so the palette can never
 * drift out of sync with what's actually on the site. */
const ITEMS: Item[] = [
  ...COMPONENTS.map((c): Item => ({
    kind: 'Component',
    id: `component-${c.slug}`,
    title: c.title,
    blurb: c.blurb,
    group: c.section,
    href: `/components/#${c.slug}`,
  })),
  ...TEMPLATES.map((t): Item => ({
    kind: 'Template',
    id: `template-${t.slug}`,
    title: t.title,
    blurb: t.blurb,
    group: 'Template',
    href: `/examples/${t.slug}/`,
  })),
  ...BLOCKS.map((b): Item => ({
    kind: 'Block',
    id: `block-${b.slug}`,
    title: b.title,
    blurb: b.blurb,
    group: b.category ?? 'Block',
    href: `/blocks/${b.slug}/`,
  })),
]

const GROUP_ORDER: Item['kind'][] = ['Component', 'Template', 'Block']
const GROUP_LABEL: Record<Item['kind'], string> = { Component: 'Components', Template: 'Templates', Block: 'Blocks' }

function matches(item: Item, q: string): boolean {
  if (!q) return true
  const hay = `${item.title} ${item.blurb} ${item.group}`.toLowerCase()
  return hay.includes(q)
}

/** The site's ⌘K command palette: a trigger button (rendered in the nav) plus
 * a modal search-and-jump dialog, portaled to <body> so its fixed positioning
 * and stacking are never at the mercy of the header's own stacking context.
 *
 * One island renders both trigger and dialog together — sharing `open` as a
 * single piece of state avoids any cross-island messaging for what is, at the
 * end of the day, one widget. */
export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  /* Keep the server and the first client render identical. Deployment builds
   * run on Linux, while the visitor may be on macOS; reading navigator during
   * render made the server say "Ctrl K" and the hydrating client say "⌘K".
   * Detect the platform only after hydration, then refine the visible hint. */
  const [shortcut, setShortcut] = useState('Ctrl K')

  const triggerRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  const q = query.trim().toLowerCase()
  const groups = useMemo(() => {
    const filtered = ITEMS.filter((it) => matches(it, q))
    return GROUP_ORDER.map((kind) => ({ kind, label: GROUP_LABEL[kind], items: filtered.filter((it) => it.kind === kind) })).filter(
      (g) => g.items.length > 0,
    )
  }, [q])
  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups])
  const indexById = useMemo(() => new Map(flat.map((it, i) => [it.id, i] as const)), [flat])

  // Keep a ref mirror of everything the global key handler needs, so that
  // handler can be attached exactly once (on mount) instead of being torn
  // down and rebound on every keystroke.
  const stateRef = useRef({ open, selected, flat })
  useEffect(() => {
    stateRef.current = { open, selected, flat }
  })

  const close = () => setOpen(false)
  const navigate = (href: string) => {
    setOpen(false)
    window.location.href = href
  }

  // Reset to a blank search each time the palette opens and move focus into
  // the input; on close, focus always returns to the trigger button — however
  // the palette was opened (click, ⌘K, or "/"), that button is the one
  // sensible, always-present place for focus to land back on. */
  const wasOpen = useRef(false)
  useEffect(() => {
    if (open) {
      setQuery('')
      setSelected(0)
      wasOpen.current = true
      const raf = requestAnimationFrame(() => inputRef.current?.focus())
      return () => cancelAnimationFrame(raf)
    }
    /* Only restore focus when a palette that WAS open has closed. This effect
     * also runs once on mount with open=false, and focusing the trigger then
     * steals focus during hydration — which the browser answers by scrolling
     * the element into view, dragging the horizontally-scrollable mobile nav
     * to its far right and hiding every link behind the sticky brand. */
    if (wasOpen.current) {
      wasOpen.current = false
      triggerRef.current?.focus()
    }
    return undefined
  }, [open])

  // Selection resets whenever the result set changes shape (a keystroke
  // narrowing or widening it) so it never points past the end of the list.
  useEffect(() => {
    setSelected(0)
  }, [q])

  // Keep the active option scrolled into view as ArrowUp/ArrowDown move it —
  // otherwise arrowing past the visible rows leaves the "selection" invisible.
  useEffect(() => {
    if (!open) return
    const item = flat[selected]
    if (!item) return
    document.getElementById(`cmdk-option-${item.id}`)?.scrollIntoView({ block: 'nearest' })
  }, [open, selected, flat])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const { open, selected, flat } = stateRef.current
      const mod = e.metaKey || e.ctrlKey

      if (mod && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
        return
      }

      if (!open) {
        if (e.key === '/') {
          const el = document.activeElement as HTMLElement | null
          const tag = el?.tagName
          const editable = tag === 'INPUT' || tag === 'TEXTAREA' || el?.isContentEditable
          if (!editable) {
            e.preventDefault()
            setOpen(true)
          }
        }
        return
      }

      switch (e.key) {
        case 'Escape':
          e.preventDefault()
          setOpen(false)
          break
        case 'ArrowDown':
          e.preventDefault()
          setSelected((i) => (flat.length ? (i + 1) % flat.length : 0))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelected((i) => (flat.length ? (i - 1 + flat.length) % flat.length : 0))
          break
        case 'Enter': {
          e.preventDefault()
          const item = flat[selected]
          if (item) navigate(item.href)
          break
        }
        case 'Tab': {
          // Focus trap: with the input focused there are only two focusable
          // elements in the dialog (the input and the close button) — cycle
          // between them rather than letting Tab escape to the page behind.
          const root = dialogRef.current
          if (!root) break
          const focusables = Array.from(
            root.querySelectorAll<HTMLElement>('input, button, a[href], [tabindex]:not([tabindex="-1"])'),
          ).filter((el) => !el.hasAttribute('disabled'))
          if (focusables.length === 0) break
          const first = focusables[0]
          const last = focusables[focusables.length - 1]
          const active = document.activeElement
          if (e.shiftKey && active === first) {
            e.preventDefault()
            last.focus()
          } else if (!e.shiftKey && active === last) {
            e.preventDefault()
            first.focus()
          }
          break
        }
        default:
          break
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    if (/Mac|iPhone|iPad/.test(navigator.platform ?? navigator.userAgent)) {
      setShortcut('⌘K')
    }
  }, [])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="cmdk-trigger"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
      >
        <Icon name="search" size="sm" label="Search" />
        <span className="cmdk-trigger__label">Search</span>
        <kbd className="cmdk-kbd">{shortcut}</kbd>
      </button>

      {open &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className="cmdk-overlay" onMouseDown={close}>
            <div
              ref={dialogRef}
              className="cmdk-dialog"
              role="dialog"
              aria-modal="true"
              aria-label="Search components, templates and blocks"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className="cmdk-header">
                <Icon name="search" size="sm" />
                <input
                  ref={inputRef}
                  className="cmdk-input"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search components, templates, blocks…"
                  role="combobox"
                  aria-expanded="true"
                  aria-controls="cmdk-listbox"
                  aria-autocomplete="list"
                  aria-activedescendant={flat.length ? `cmdk-option-${flat[selected]?.id}` : undefined}
                  autoComplete="off"
                  spellCheck={false}
                />
                <button type="button" className="cmdk-close" onClick={close} aria-label="Close search">
                  <Icon name="close" size="sm" />
                </button>
              </div>

              <div className="cmdk-list">
                <div id="cmdk-listbox" role="listbox" aria-label="Results">
                  {groups.map((g) => (
                    <div className="cmdk-group" role="group" aria-label={g.label} key={g.kind}>
                      <div className="cmdk-group__label" aria-hidden="true">
                        {g.label}
                      </div>
                      {g.items.map((item) => {
                        const flatIndex = indexById.get(item.id) ?? 0
                        const active = flatIndex === selected
                        return (
                          <div
                            key={item.id}
                            id={`cmdk-option-${item.id}`}
                            role="option"
                            aria-selected={active}
                            tabIndex={-1}
                            className={active ? 'cmdk-option cmdk-option--active' : 'cmdk-option'}
                            onMouseEnter={() => setSelected(flatIndex)}
                            onClick={() => navigate(item.href)}
                          >
                            <div className="cmdk-option__text">
                              <div className="cmdk-option__title">{item.title}</div>
                              <div className="cmdk-option__blurb">{item.blurb}</div>
                            </div>
                            <span className="cmdk-option__tag">{item.group}</span>
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
                {flat.length === 0 && (
                  <p className="cmdk-empty" role="status">
                    No results for &ldquo;{query}&rdquo;.
                  </p>
                )}
              </div>

              <div className="cmdk-footer">
                <span><kbd className="cmdk-kbd cmdk-kbd--sm">↑</kbd><kbd className="cmdk-kbd cmdk-kbd--sm">↓</kbd> navigate</span>
                <span><kbd className="cmdk-kbd cmdk-kbd--sm">↵</kbd> open</span>
                <span><kbd className="cmdk-kbd cmdk-kbd--sm">esc</kbd> close</span>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
