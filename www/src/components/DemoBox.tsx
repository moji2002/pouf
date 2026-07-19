import { allDemos } from '../../../registry/pouf/demos'

/** Renders one live demo by key/id inside a padded surface. A React island —
 * only the demos ship JS, the rest of the page is static Astro HTML. The demo
 * `render()` returns real Pouf components against the real pouf.css theme. */
export function DemoBox({ component, id }: { component: string; id: string }) {
  const demo = allDemos[component]?.find((d) => d.id === id)
  if (!demo) return <div style={{ color: 'var(--muted)' }}>Demo not found: {component}/{id}</div>
  /* mobile-viewport demos (BottomNav) render fixed-position chrome; the
   * transform makes `position: fixed` resolve to THIS box, not the page, so a
   * fixed bar stays inside the preview instead of sticking to the window. */
  const contains = demo.viewport === 'mobile'
  return (
    <div
      data-demo-root
      style={{
        position: 'relative',
        overflow: 'hidden',
        transform: contains ? 'translateZ(0)' : undefined,
        padding: 40,
        borderRadius: 'var(--r-card)',
        background: 'var(--bg)',
        boxShadow: 'var(--pouf-field)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 16,
        alignItems: 'center',
        minHeight: contains ? 300 : 120,
      }}
    >
      {demo.render()}
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
