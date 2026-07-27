import {
  areaChartDemos,
  barChartDemos,
  lineChartDemos,
  pieChartDemos,
} from '../../../registry/pouf/demos/charts'
import type { Demo } from '../../../registry/pouf/demos/types'
import { DemoFrame } from './DemoFrame'

const chartDemos: Record<string, Demo[]> = {
  'area-chart': areaChartDemos,
  'bar-chart': barChartDemos,
  'line-chart': lineChartDemos,
  'pie-chart': pieChartDemos,
}

/** Visibility-loaded chart island. Recharts is fetched only when this island
 * approaches the viewport, not with the first layout demo near the page top. */
export function ChartDemoBox({ component, id, compact = false }: { component: string; id: string; compact?: boolean }) {
  const demo = chartDemos[component]?.find((candidate) => candidate.id === id)
  if (!demo) return <div style={{ color: 'var(--muted)' }}>Demo not found: {component}/{id}</div>
  return <DemoFrame component={component} id={id} compact={compact} demo={demo} />
}
