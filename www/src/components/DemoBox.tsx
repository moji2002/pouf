import { coreDemos } from '../../../registry/pouf/demos/core-index'
import { DemoFrame } from './DemoFrame'

/** Renders a non-chart live demo. Chart demos intentionally use a separate
 * island so this primary bundle never imports Recharts. */
export function DemoBox({ component, id, compact = false }: { component: string; id: string; compact?: boolean }) {
  const demo = coreDemos[component]?.find((candidate) => candidate.id === id)
  if (!demo) return <div style={{ color: 'var(--muted)' }}>Demo not found: {component}/{id}</div>
  return <DemoFrame component={component} id={id} compact={compact} demo={demo} />
}

/** All non-chart demos for a component, stacked with their ids as captions. */
export function DemoGroup({ component }: { component: string }) {
  const demos = coreDemos[component] ?? []
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {demos.map((demo) => (
        <div key={demo.id} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--muted)' }}>
            {demo.id}
          </span>
          <DemoFrame component={component} id={demo.id} demo={demo} />
        </div>
      ))}
    </div>
  )
}
