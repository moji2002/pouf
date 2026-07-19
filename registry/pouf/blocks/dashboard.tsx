import { useState } from 'react'
import { Shell, Sidebar, Stack, Row, Grid, Spacer } from '../layout'
import { Card } from '../surface'
import { Heading, Text, Eyebrow } from '../text'
import { Stat } from '../readout'
import { Badge, Blob } from '../media'
import { NavLink } from '../NavLink'
import { Segmented } from '../Segmented'
import { AreaChart } from '../charts'
import { Table } from '../table'
import { Status } from '../status'

interface Order {
  id: string
  customer: string
  amount: string
  state: 'paid' | 'pending' | 'failed'
}

const ORDERS: Order[] = [
  { id: '1', customer: 'Apple Inc.', amount: '$1,204.00', state: 'paid' },
  { id: '2', customer: 'Banana Co.', amount: '$860.50', state: 'pending' },
  { id: '3', customer: 'Cherry LLC', amount: '$432.00', state: 'paid' },
  { id: '4', customer: 'Date & Sons', amount: '$98.25', state: 'failed' },
]

const STATE_TONE = { paid: 'mint', pending: 'yellow', failed: 'pink' } as const

const REVENUE = [
  { day: 'Mon', total: 40 },
  { day: 'Tue', total: 55 },
  { day: 'Wed', total: 70 },
  { day: 'Thu', total: 52 },
  { day: 'Fri', total: 85 },
  { day: 'Sat', total: 60 },
  { day: 'Sun', total: 92 },
]

/** An example dashboard: sidebar nav, a KPI row, a chart, and a data table —
 * all Pouf primitives. Swap the data for yours; edit the source to reshape. */
export function DashboardBlock() {
  const [range, setRange] = useState('week')

  return (
    <Shell>
      <Sidebar>
        <Row gap={2} wrap={false}>
          <Blob icon="target" tone="purple" size="sm" />
          <Heading level={3}>Acme</Heading>
        </Row>
        <NavLink href="/" currentPath="/" icon="overview">Overview</NavLink>
        <NavLink href="/orders" currentPath="/" icon="log" tone="blue">Orders</NavLink>
        <NavLink href="/customers" currentPath="/" icon="channels" tone="mint">Customers</NavLink>
        <NavLink href="/settings" currentPath="/" icon="settings" tone="pink">Settings</NavLink>
      </Sidebar>

      <Stack gap={5}>
        <Row justify="between">
          <Stack gap={1}>
            <Eyebrow>Dashboard</Eyebrow>
            <Heading level={1}>Good morning</Heading>
          </Stack>
          <Status label="All systems go" tone="up" at={Date.now()} />
        </Row>

        <Grid cols={3}>
          <Stat label="Revenue" value="$48.2k" icon="ok" tone="mint" />
          <Stat label="Orders" value="1,204" icon="add" tone="blue" />
          <Stat label="Refunds" value="12" icon="down" tone="pink" />
        </Grid>

        <Card>
          <Stack gap={4}>
            <Row justify="between">
              <Heading level={3}>Revenue</Heading>
              <Segmented
                label="Range"
                value={range}
                onChange={setRange}
                options={[
                  { value: 'day', label: 'Day' },
                  { value: 'week', label: 'Week' },
                  { value: 'month', label: 'Month' },
                ]}
              />
            </Row>
            <AreaChart data={REVENUE} dataKey="day" height={220} series={[{ key: 'total', label: 'Revenue', tone: 'purple' }]} />
          </Stack>
        </Card>

        <Card>
          <Stack gap={4}>
            <Row justify="between">
              <Heading level={3}>Recent orders</Heading>
              <Badge tone="blue">{ORDERS.length} new</Badge>
            </Row>
            <Table
              rows={ORDERS}
              getKey={(o) => o.id}
              columns={[
                { key: 'customer', header: 'Customer', render: (o) => <Text>{o.customer}</Text> },
                { key: 'amount', header: 'Amount', align: 'right', mono: true, render: (o) => <Text num>{o.amount}</Text> },
                { key: 'state', header: 'Status', align: 'right', render: (o) => <Badge tone={STATE_TONE[o.state]}>{o.state}</Badge> },
              ]}
            />
          </Stack>
        </Card>
        <Spacer />
      </Stack>
    </Shell>
  )
}
