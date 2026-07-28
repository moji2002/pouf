import { useMemo, useState } from 'react'
import { Button } from '../Button'
import { Input, Field } from '../Input'
import { BottomNav, type NavItem } from '../BottomNav'
import { NavLink } from '../NavLink'
import { Empty } from '../feedback'
import { Blob, Badge } from '../media'
import { Grid, Row, Shell, Sidebar, Spacer, Stack } from '../layout'
import { Stat } from '../readout'
import { Segmented } from '../Segmented'
import { Card } from '../surface'
import { Table } from '../table'
import { Eyebrow, Heading, Text } from '../text'

const NAV: NavItem[] = [
  { href: '/', label: 'Overview', icon: 'overview', tone: 'purple' },
  { href: '/inventory', label: 'Inventory', icon: 'database', tone: 'blue' },
  { href: '/orders', label: 'Orders', icon: 'cart', tone: 'mint' },
  { href: '/suppliers', label: 'Suppliers', icon: 'users', tone: 'yellow' },
  { href: '/settings', label: 'Settings', icon: 'settings', tone: 'orange' },
]

const HERE = '/inventory'
const NUMBER = new Intl.NumberFormat('en-US')
const MONEY = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

interface StockItem {
  id: string
  sku: string
  name: string
  category: string
  stock: number
  reorderAt: number
  price: number
}

const INITIAL_ITEMS: StockItem[] = [
  { id: 'cloud-lamp', sku: 'LMP-104', name: 'Cloud lamp', category: 'Lighting', stock: 18, reorderAt: 8, price: 64 },
  { id: 'pebble-mug', sku: 'MUG-220', name: 'Pebble mug', category: 'Kitchen', stock: 6, reorderAt: 10, price: 24 },
  { id: 'soft-clock', sku: 'CLK-018', name: 'Soft clock', category: 'Decor', stock: 0, reorderAt: 5, price: 42 },
  { id: 'loop-vase', sku: 'VAS-431', name: 'Loop vase', category: 'Decor', stock: 24, reorderAt: 8, price: 48 },
  { id: 'pocket-tray', sku: 'TRY-092', name: 'Pocket tray', category: 'Storage', stock: 9, reorderAt: 6, price: 18 },
]

type StockFilter = 'all' | 'low' | 'out'

function stockTone(item: StockItem): 'up' | 'warn' | 'down' {
  if (item.stock === 0) return 'down'
  if (item.stock <= item.reorderAt) return 'warn'
  return 'up'
}

function stockLabel(item: StockItem): string {
  if (item.stock === 0) return 'Out of stock'
  if (item.stock <= item.reorderAt) return 'Low stock'
  return 'In stock'
}

/** A complete inventory workspace with searchable stock, meaningful status
 * filters, sortable columns, record detail, and a working receiving action. */
export function InventoryBlock() {
  const [items, setItems] = useState(INITIAL_ITEMS)
  const [filter, setFilter] = useState<StockFilter>('all')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(INITIAL_ITEMS[0]!.id)

  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return items.filter((item) => {
      const matchesQuery =
        !normalized ||
        `${item.name} ${item.sku} ${item.category}`.toLowerCase().includes(normalized)
      const matchesFilter =
        filter === 'all' ||
        (filter === 'low' && item.stock > 0 && item.stock <= item.reorderAt) ||
        (filter === 'out' && item.stock === 0)
      return matchesQuery && matchesFilter
    })
  }, [filter, items, query])

  const selected = items.find((item) => item.id === selectedId) ?? items[0]!
  const lowCount = items.filter((item) => item.stock > 0 && item.stock <= item.reorderAt).length
  const outCount = items.filter((item) => item.stock === 0).length
  const inventoryValue = items.reduce((sum, item) => sum + item.stock * item.price, 0)

  function receive(id: string) {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, stock: item.stock + 12 } : item)),
    )
  }

  return (
    <>
      <Shell>
        <Sidebar mobile="hide">
          <Row gap={2} wrap={false}>
            <Blob icon="database" tone="blue" size="sm" />
            <Heading level={3}>Stockroom</Heading>
          </Row>
          {NAV.map((item) => (
            <NavLink key={item.href} href={item.href} currentPath={HERE} icon={item.icon} tone={item.tone}>
              {item.label}
            </NavLink>
          ))}
        </Sidebar>

        <Stack gap={5}>
          <Row justify="between" align="top">
            <Stack gap={1}>
              <Eyebrow>Operations</Eyebrow>
              <Heading level={1}>Inventory</Heading>
              <Text muted>Know what is ready to sell and what needs attention.</Text>
            </Stack>
            <Button tone="blue" size="sm" onClick={() => receive(selected.id)}>Receive 12</Button>
          </Row>

          <Grid cols={3} gap={3}>
            <Stat label="Inventory value" value={MONEY.format(inventoryValue)} icon="card" tone="purple" />
            <Stat label="Low stock" value={NUMBER.format(lowCount)} icon="warn" tone="warn" />
            <Stat label="Out of stock" value={NUMBER.format(outCount)} icon="fail" tone="down" />
          </Grid>

          <Card variant="tight">
            <Stack gap={3}>
              <Row gap={3}>
                <div className="flex-[1_1_260px] min-w-0">
                  <Field label="Search Inventory">
                    {(id, describedBy) => (
                      <Input
                        id={id}
                        name="inventory-search"
                        value={query}
                        onChange={setQuery}
                        describedBy={describedBy}
                        placeholder="Try a product, SKU, or category…"
                        autoComplete="off"
                      />
                    )}
                  </Field>
                </div>
                <Spacer />
                <Segmented
                  label="Stock status"
                  value={filter}
                  onChange={setFilter}
                  options={[
                    { value: 'all', label: 'All' },
                    { value: 'low', label: 'Low' },
                    { value: 'out', label: 'Out' },
                  ]}
                />
              </Row>
            </Stack>
          </Card>

          <Grid cols="sidebar" gap={4}>
            <Card variant="flush">
              {visible.length > 0 ? (
                <Table
                  rows={visible}
                  getKey={(item) => item.id}
                  onRowClick={(item) => setSelectedId(item.id)}
                  getRowLabel={(item) => `Open ${item.name}`}
                  columns={[
                    {
                      key: 'product',
                      header: 'Product',
                      truncate: true,
                      render: (item) => item.name,
                      sort: (a, b) => a.name.localeCompare(b.name),
                    },
                    { key: 'sku', header: 'SKU', mono: true, render: (item) => item.sku },
                    {
                      key: 'stock',
                      header: 'Stock',
                      align: 'right',
                      render: (item) => NUMBER.format(item.stock),
                      sort: (a, b) => a.stock - b.stock,
                    },
                  ]}
                />
              ) : (
                <div className="p-(--s6)">
                  <Empty icon="search" title="No inventory matches">
                    Try another search or stock filter.
                  </Empty>
                </div>
              )}
            </Card>

            <Card>
              <Stack gap={4}>
                <Row justify="between" align="top">
                  <Stack gap={1}>
                    <Text size="sm" muted mono>{selected.sku}</Text>
                    <Heading level={2}>{selected.name}</Heading>
                    <Text muted>{selected.category}</Text>
                  </Stack>
                  <Badge tone={stockTone(selected)}>{stockLabel(selected)}</Badge>
                </Row>
                <Row justify="between">
                  <Text muted>On hand</Text>
                  <Text num>{NUMBER.format(selected.stock)}</Text>
                </Row>
                <Row justify="between">
                  <Text muted>Reorder at</Text>
                  <Text num>{NUMBER.format(selected.reorderAt)}</Text>
                </Row>
                <Row justify="between">
                  <Text muted>Unit price</Text>
                  <Text num>{MONEY.format(selected.price)}</Text>
                </Row>
                <Button tone="mint" block onClick={() => receive(selected.id)}>
                  Receive 12 Units
                </Button>
              </Stack>
            </Card>
          </Grid>
        </Stack>
      </Shell>

      <BottomNav primary={NAV.slice(0, 3)} groups={[{ title: 'Workspace', items: NAV }]} currentPath={HERE} />
    </>
  )
}
