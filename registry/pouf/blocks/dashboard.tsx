import { useState } from 'react'
import { Shell, Sidebar, Stack, Row, Grid, Spacer } from '../layout'
import { Card } from '../surface'
import { Heading, Text, Eyebrow } from '../text'
import { Stat } from '../readout'
import { Badge, Blob } from '../media'
import { NavLink } from '../NavLink'
import { BottomNav, type NavItem } from '../BottomNav'
import { Segmented } from '../Segmented'
import { AreaChart } from '../charts'
import { Table } from '../table'
import { Status } from '../status'

/* The five screens of this example app. Every template block ships the same
 * list and differs only in `currentPath` — so installing two of them gives you
 * two routes of one product rather than two unrelated demos. Swap in your own
 * routes; `NavLink`/`BottomNav` take whatever paths you give them. */
const NAV: NavItem[] = [
  { href: '/', label: 'Overview', icon: 'overview', tone: 'purple' },
  { href: '/inbox', label: 'Inbox', icon: 'mail', tone: 'blue' },
  { href: '/board', label: 'Board', icon: 'log', tone: 'mint' },
  { href: '/messages', label: 'Messages', icon: 'comment', tone: 'pink' },
  { href: '/settings', label: 'Settings', icon: 'settings', tone: 'orange' },
]

const HERE = '/'

interface Order {
  id: string
  customer: string
  /** A number, not a display string: the Amount column sorts on it, and
   *  "$1,204.00" < "$860.50" is true under string comparison. */
  amount: number
  state: 'paid' | 'pending' | 'failed'
}

const ORDERS: Order[] = [
  { id: '1', customer: 'Apple Inc.', amount: 1204, state: 'paid' },
  { id: '2', customer: 'Banana Co.', amount: 860.5, state: 'pending' },
  { id: '3', customer: 'Cherry LLC', amount: 432, state: 'paid' },
  { id: '4', customer: 'Date & Sons', amount: 98.25, state: 'failed' },
]

const STATE_TONE = { paid: 'mint', pending: 'yellow', failed: 'pink' } as const
/* Sort order for Status is severity, not alphabetical — "failed, pending, paid"
 * is what you actually want to see when you sort a payments column. */
const STATE_RANK = { failed: 0, pending: 1, paid: 2 } as const

const money = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD' })

/* One dataset per range, so the Segmented picker has something to switch. */
const REVENUE = {
  day: [
    { label: '9a', total: 4 }, { label: '11a', total: 9 }, { label: '1p', total: 7 },
    { label: '3p', total: 14 }, { label: '5p', total: 11 }, { label: '7p', total: 18 },
  ],
  week: [
    { label: 'Mon', total: 40 }, { label: 'Tue', total: 55 }, { label: 'Wed', total: 70 },
    { label: 'Thu', total: 52 }, { label: 'Fri', total: 85 }, { label: 'Sat', total: 60 },
    { label: 'Sun', total: 92 },
  ],
  month: [
    { label: 'W1', total: 210 }, { label: 'W2', total: 288 }, { label: 'W3', total: 245 },
    { label: 'W4', total: 331 },
  ],
} as const

type Range = keyof typeof REVENUE

const TOTALS: Record<Range, string> = { day: '$2.4k', week: '$48.2k', month: '$186k' }

/** An example dashboard: sidebar nav, a KPI row, a chart the range picker
 * actually redraws, and a sortable orders table — all 1st-Pouf primitives. Swap the
 * data for yours; edit the source to reshape. */
export function DashboardBlock() {
  const [range, setRange] = useState<Range>('week')

  return (
    <>
      <Shell>
        <Sidebar mobile="hide">
          <Row gap={2} wrap={false}>
            <Blob icon="target" tone="purple" size="sm" />
            <Heading level={3}>Acme</Heading>
          </Row>
          {NAV.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              currentPath={HERE}
              icon={item.icon}
              tone={item.tone}
            >
              {item.label}
            </NavLink>
          ))}
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
            <Stat label="Revenue" value={TOTALS[range]} icon="ok" tone="mint" />
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
                  onChange={(v) => setRange(v as Range)}
                  options={[
                    { value: 'day', label: 'Day' },
                    { value: 'week', label: 'Week' },
                    { value: 'month', label: 'Month' },
                  ]}
                />
              </Row>
              <AreaChart
                data={[...REVENUE[range]]}
                dataKey="label"
                height={220}
                series={[{ key: 'total', label: 'Revenue', tone: 'purple' }]}
              />
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
                  {
                    key: 'customer',
                    header: 'Customer',
                    render: (o) => <Text>{o.customer}</Text>,
                    sort: (a, b) => a.customer.localeCompare(b.customer),
                  },
                  {
                    key: 'amount',
                    header: 'Amount',
                    align: 'right',
                    mono: true,
                    render: (o) => <Text num>{money(o.amount)}</Text>,
                    sort: (a, b) => a.amount - b.amount,
                  },
                  {
                    key: 'state',
                    header: 'Status',
                    align: 'right',
                    render: (o) => <Badge tone={STATE_TONE[o.state]}>{o.state}</Badge>,
                    sort: (a, b) => STATE_RANK[a.state] - STATE_RANK[b.state],
                  },
                ]}
              />
            </Stack>
          </Card>
          <Spacer />
        </Stack>
      </Shell>
      <BottomNav primary={NAV.slice(0, 4)} groups={[{ title: 'App', items: NAV }]} currentPath={HERE} />
    </>
  )
}
