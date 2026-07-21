import { Stat, Metric } from '../readout'
import { Row, Grid } from '../layout'
import type { Demo } from './types'

export const statDemos: Demo[] = [
  { id: 'default', render: () => (
      <Grid cols={4}>
        <Stat label="Users" value="1,284" icon="users" tone="idle" />
        <Stat label="Active" value="312" icon="target" tone="up" />
        <Stat label="Revenue" value="+$4,290" icon="up" tone="up" />
        <Stat label="Churn" value="−0.4%" icon="performance" tone="down" />
      </Grid>
    ) },
]

export const metricDemos: Demo[] = [
  // The point of Metric: null renders an em-dash, never "0" — shown next to a
  // real zero so the difference between "known zero" and "unknown" is visible.
  { id: 'default', render: () => (
      <Row gap={6} wrap={false}>
        <Metric label="Projects" value={0} />
        <Metric label="Completion" value={null} />
        <Metric label="Score" value={null} />
        <Metric label="Balance" value="$0.00" />
        <Metric label="Plan" value="Free" num={false} />
      </Row>
    ) },
]
