import { Table } from '../table'
import { Badge } from '../media'
import type { Demo } from './types'

interface Row { fruit: string; kind: string; qty: string; total: string }

const rows: Row[] = [
  { fruit: 'Apple', kind: 'Fresh', qty: '0.4', total: '+$31.20' },
  { fruit: 'Banana', kind: 'Dried', qty: '2.1', total: '−$8.05' },
  { fruit: 'Cherry', kind: 'Fresh', qty: '5.0', total: '+$12.40' },
]

const columns = [
  { key: 'fruit', header: 'Fruit', render: (r: Row) => r.fruit },
  { key: 'kind', header: 'Kind', render: (r: Row) => <Badge tone={r.kind === 'Fresh' ? 'up' : 'down'}>{r.kind}</Badge> },
  { key: 'qty', header: 'Qty', render: (r: Row) => r.qty, align: 'right' as const, mono: true },
  { key: 'total', header: 'Total', render: (r: Row) => r.total, align: 'right' as const, mono: true },
]

export const tableDemos: Demo[] = [
  { id: 'default', render: () => <Table columns={columns} rows={rows} getKey={(r) => r.fruit} /> },
  { id: 'empty', render: () => <Table columns={columns} rows={[]} getKey={(r) => r.fruit} /> },
  { id: 'clickable-rows', states: ['hover', 'focus'], render: () => (
      <span data-subject>
        <Table columns={columns} rows={rows} getKey={(r) => r.fruit} onRowClick={() => {}} />
      </span>
    ) },
]
