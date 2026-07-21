import { useMemo, useState, type ReactNode } from 'react'
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
  /** Supply a comparator to make this column's header a sort control.
   *  Opt-in on purpose: a column without `sort` renders the same inert header
   *  it always has, so adding sorting to the system changed no existing
   *  snapshot. Sorting is internal state — `rows` stays the source order. */
  sort?: (a: T, b: T) => number
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
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [desc, setDesc] = useState(false)

  const active = sortKey ? columns.find((c) => c.key === sortKey) : undefined

  /* Sort a copy: mutating `rows` would reorder the caller's array, and a caller
   * that memoised it would see its own data silently rearranged. */
  const sorted = useMemo(() => {
    if (!active?.sort) return rows
    const out = [...rows].sort(active.sort)
    return desc ? out.reverse() : out
  }, [rows, active, desc])

  function toggle(col: TableColumn<T>) {
    if (col.key === sortKey) setDesc((d) => !d)
    else {
      setSortKey(col.key)
      setDesc(false)
    }
  }

  return (
    <div className="pouf-table__wrap">
      <table className="pouf-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={col.align === 'right' ? 'pouf-table__h--right' : ''}
                aria-sort={
                  col.sort
                    ? col.key === sortKey
                      ? desc
                        ? 'descending'
                        : 'ascending'
                      : 'none'
                    : undefined
                }
              >
                {col.sort ? (
                  <button
                    type="button"
                    className="pouf-table__sort"
                    onClick={() => toggle(col)}
                  >
                    <Text size="sm" muted>{col.header}</Text>
                    {/* Both arrows always render, the inactive one faded, so the
                      * header never changes width when you sort it. */}
                    <span aria-hidden="true" className="pouf-table__caret">
                      {col.key === sortKey ? (desc ? '▾' : '▴') : '⇅'}
                    </span>
                  </button>
                ) : (
                  <Text size="sm" muted>{col.header}</Text>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="pouf-table__empty">
                <Text size="sm" muted>No data.</Text>
              </td>
            </tr>
          ) : (
            sorted.map((row) => (
              <tr
                key={getKey(row)}
                className={onRowClick ? 'pouf-table__row pouf-table__row--click' : 'pouf-table__row'}
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
                      col.align === 'right' ? 'pouf-table__cell--right' : ''
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
