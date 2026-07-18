import { Stat, Metric } from '../readout'
import { Row, Grid } from '../layout'
import type { Demo } from './types'

export const statDemos: Demo[] = [
  { id: 'default', render: () => (
      <Grid cols={4}>
        <Stat label="Orders" value="128" icon="log" tone="idle" />
        <Stat label="Wins / losses" value="74 / 54" icon="target" tone="up" />
        <Stat label="Realized" value="+$412.90" icon="up" tone="up" />
        <Stat label="Avg R" value="−0.42" icon="performance" tone="down" />
      </Grid>
    ) },
]

export const metricDemos: Demo[] = [
  // The point of Metric: null renders an em-dash, never "0" — shown next to a
  // real zero so the difference between "known zero" and "unknown" is visible.
  { id: 'default', render: () => (
      <Row gap={6} wrap={false}>
        <Metric label="Orders" value={0} />
        <Metric label="Win rate" value={null} />
        <Metric label="Avg R" value={null} />
        <Metric label="Realized" value="+$0.00" />
        <Metric label="Sizing" value="fixed-fractional" num={false} />
      </Row>
    ) },
]
