import type { Demo } from '../../../registry/pouf/demos/types'

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
  'bottom-nav', 'navbar', 'footer', 'cta',
  'scroll-area', 'aspect-ratio', 'table',
  'area-chart', 'bar-chart', 'line-chart', 'pie-chart',
])

/** Shared visual frame for core and chart demo islands. Keeping the frame
 * dependency-free lets chart code live in a separate, visibility-loaded
 * bundle without duplicating preview geometry. */
export function DemoFrame({
  component,
  id,
  compact = false,
  demo,
}: {
  component: string
  id: string
  compact?: boolean
  demo: Demo
}) {
  /* mobile-viewport demos (BottomNav) render fixed-position chrome; the
   * transform makes `position: fixed` resolve to THIS box, not the page, so a
   * fixed bar stays inside the preview instead of sticking to the window. */
  const contains = demo.viewport === 'mobile'
  const canvas = CANVAS_DEMOS.has(component)
  const reservesPanel = component === 'alert-bell' && id === 'disconnected'
  return (
    <div
      data-demo-root
      data-demo-component={component}
      data-demo-id={id}
      data-demo-layout={canvas ? 'canvas' : 'cluster'}
      data-demo-viewport={demo.viewport ?? 'responsive'}
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
        minHeight: contains ? 300 : reservesPanel ? 480 : compact ? 84 : 120,
      }}
    >
      <div
        data-demo-content
        style={{
          width: '100%',
          minWidth: 0,
          minHeight: contains ? 252 : reservesPanel ? 432 : compact ? 36 : 40,
          display: canvas ? 'block' : 'flex',
          flexWrap: canvas ? undefined : 'wrap',
          gap: canvas ? undefined : compact ? 12 : 16,
          alignItems: canvas ? undefined : reservesPanel ? 'flex-start' : 'center',
          justifyContent: canvas ? undefined : 'center',
        }}
      >
        {demo.render()}
      </div>
    </div>
  )
}
