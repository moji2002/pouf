import { allDemos } from '../../../registry/pouf/demos'

/* Components in this set take their meaning from the width of their
 * container: progress bars, fields, ratios, data layouts, and full chrome.
 * Rendering them as shrink-to-fit flex items collapses tracks to a few pixels
 * and makes percentages wrap one character per line. */
const CANVAS_DEMOS = new Set([
  'stack', 'row', 'grid', 'shell', 'sidebar',
  'heading', 'text', 'card', 'row-card', 'stat', 'metric', 'figure',
  'input', 'number-input', 'slider', 'segmented',
  'status', 'mode-banner', 'error-note', 'empty', 'skeleton', 'progress',
  'tabs', 'accordion', 'collapsible', 'nav-link', 'breadcrumb', 'pagination',
  'bottom-nav', 'menubar', 'navbar', 'footer', 'cta',
  'scroll-area', 'aspect-ratio', 'table',
  'area-chart', 'bar-chart', 'line-chart', 'pie-chart',
])

/** Renders one live demo by key/id inside a padded surface. A React island —
 * only the demos ship JS, the rest of the page is static Astro HTML. The demo
 * `render()` returns real Pouf components against the real pouf.css theme. */
export function DemoBox({ component, id, compact = false }: { component: string; id: string; compact?: boolean }) {
  const demo = allDemos[component]?.find((d) => d.id === id)
  if (!demo) return <div style={{ color: 'var(--muted)' }}>Demo not found: {component}/{id}</div>
  /* mobile-viewport demos (BottomNav) render fixed-position chrome; the
   * transform makes `position: fixed` resolve to THIS box, not the page, so a
   * fixed bar stays inside the preview instead of sticking to the window. */
  const contains = demo.viewport === 'mobile'
  const canvas = CANVAS_DEMOS.has(component)
  return (
    <div
      data-demo-root
      data-demo-component={component}
      data-demo-layout={canvas ? 'canvas' : 'cluster'}
      style={{
        position: 'relative',
        /* Normal previews need room for thumbs, focus rings, cushion shadows,
         * and popovers. Only fixed-position mobile chrome is deliberately
         * contained inside its simulated viewport. */
        overflow: contains ? 'hidden' : 'visible',
        transform: contains ? 'translateZ(0)' : undefined,
        padding: compact ? 24 : 40,
        borderRadius: 'var(--r-card)',
        background: 'var(--bg)',
        boxShadow: 'var(--pouf-field)',
        minHeight: contains ? 300 : compact ? 84 : 120,
      }}
    >
      <div
        data-demo-content
        style={{
          width: '100%',
          minWidth: 0,
          minHeight: contains ? 252 : compact ? 36 : 40,
          display: canvas ? 'block' : 'flex',
          flexWrap: canvas ? undefined : 'wrap',
          gap: canvas ? undefined : compact ? 12 : 16,
          alignItems: canvas ? undefined : 'center',
          justifyContent: canvas ? undefined : 'center',
        }}
      >
        {demo.render()}
      </div>
    </div>
  )
}

/** All demos for a component, stacked with their ids as captions. */
export function DemoGroup({ component }: { component: string }) {
  const demos = allDemos[component] ?? []
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {demos.map((d) => (
        <div key={d.id} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--muted)' }}>
            {d.id}
          </span>
          <DemoBox component={component} id={d.id} />
        </div>
      ))}
    </div>
  )
}
