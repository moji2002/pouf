import type { ReactNode } from 'react'
import { Text } from './text'

/* ------------------------------------------------------------------ */
/* Table                                                               */
/* ------------------------------------------------------------------ */

interface TableColumn<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
  align?: 'left' | 'right'
  mono?: boolean
  truncate?: boolean
}

interface TableProps<T> {
  columns: TableColumn<T>[]
  rows: T[]
  getKey: (row: T) => string
  /** Makes every row an interactive target (button semantics: Enter/Space work,
   *  and it lands in the tab order). Use for "open this record", never for
   *  destructive actions — a click has no confirm step. */
  onRowClick?: (row: T) => void
}

export function Table<T>({ columns, rows, getKey, onRowClick }: TableProps<T>) {
  return (
    <div className="clay-table__wrap">
      <table className="clay-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={col.align === 'right' ? 'clay-table__h--right' : ''}
              >
                <Text size="sm" muted>{col.header}</Text>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="clay-table__empty">
                <Text size="sm" muted>No data.</Text>
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={getKey(row)}
                className={onRowClick ? 'clay-table__row clay-table__row--click' : 'clay-table__row'}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                onKeyDown={
                  onRowClick
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          onRowClick(row)
                        }
                      }
                    : undefined
                }
                tabIndex={onRowClick ? 0 : undefined}
                role={onRowClick ? 'button' : undefined}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={
                      col.align === 'right' ? 'clay-table__cell--right' : ''
                    }
                  >
                    <Text
                      size="sm"
                      mono={col.mono}
                      num={col.align === 'right'}
                      truncate={col.truncate}
                    >
                      {col.render(row)}
                    </Text>
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
