import { AreaChart, BarChart, LineChart, PieChart } from '../charts'
import type { Demo } from './types'

export const areaChartDemos: Demo[] = [
  { id: 'default', render: () => (
      <AreaChart
        data={[
          { day: 'Mon', a: 40, b: 240 },
          { day: 'Tue', a: 55, b: 295 },
          { day: 'Wed', a: 70, b: 365 },
          { day: 'Thu', a: 32, b: 397 },
          { day: 'Fri', a: 85, b: 482 },
          { day: 'Sat', a: 60, b: 542 },
          { day: 'Sun', a: 90, b: 632 },
        ]}
        dataKey="day"
        series={[
          { key: 'a', label: 'Daily total', tone: 'mint' },
          { key: 'b', label: 'Running total', tone: 'purple' },
        ]}
      />
    ) },
  { id: 'stacked', render: () => (
      <AreaChart
        data={[
          { day: 'Mon', a: 10, b: 20 },
          { day: 'Tue', a: 15, b: 18 },
          { day: 'Wed', a: 12, b: 24 },
        ]}
        dataKey="day"
        stacked
        series={[
          { key: 'a', label: 'A', tone: 'blue' },
          { key: 'b', label: 'B', tone: 'yellow' },
        ]}
      />
    ) },
]

export const barChartDemos: Demo[] = [
  { id: 'default', render: () => (
      <BarChart
        data={[
          { fruit: 'Apple', wins: 14, losses: 3 },
          { fruit: 'Banana', wins: 9, losses: 7 },
          { fruit: 'Cherry', wins: 6, losses: 4 },
          { fruit: 'Date', wins: 3, losses: 5 },
        ]}
        dataKey="fruit"
        series={[
          { key: 'wins', label: 'Wins', tone: 'up' },
          { key: 'losses', label: 'Losses', tone: 'down' },
        ]}
      />
    ) },
  // Single series, per-datum tone via toneKey.
  { id: 'tone-key', render: () => (
      <BarChart
        data={[
          { source: 'alpha', total: 91, tone: 'up' },
          { source: 'beta', total: -24, tone: 'down' },
          { source: 'gamma', total: 3, tone: 'up' },
        ]}
        dataKey="source"
        toneKey="tone"
        height={220}
        series={[{ key: 'total', label: 'Total' }]}
      />
    ) },
]

export const lineChartDemos: Demo[] = [
  { id: 'default', render: () => (
      <LineChart
        data={[
          { week: 'W1', a: 100, b: 110, c: 90 },
          { week: 'W2', a: 120, b: 105, c: 95 },
          { week: 'W3', a: 115, b: 125, c: 105 },
          { week: 'W4', a: 140, b: 130, c: 120 },
          { week: 'W5', a: 150, b: 145, c: 135 },
        ]}
        dataKey="week"
        series={[
          { key: 'a', label: 'Apple', tone: 'purple' },
          { key: 'b', label: 'Banana', tone: 'blue' },
          { key: 'c', label: 'Cherry', tone: 'mint' },
        ]}
      />
    ) },
]

export const pieChartDemos: Demo[] = [
  { id: 'donut', render: () => (
      <PieChart donut data={[
        { key: 'a', label: 'Apple', value: 45, tone: 'purple' },
        { key: 'b', label: 'Banana', value: 30, tone: 'blue' },
        { key: 'c', label: 'Cherry', value: 15, tone: 'mint' },
        { key: 'd', label: 'Date', value: 10, tone: 'yellow' },
      ]} />
    ) },
  { id: 'pie-labelled', render: () => (
      <PieChart donut={false} labelled data={[
        { key: 'win', label: 'Won', value: 72, tone: 'up' },
        { key: 'loss', label: 'Lost', value: 28, tone: 'down' },
      ]} />
    ) },
]
