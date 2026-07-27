import { useState } from 'react'
import { Pagination } from '../pagination'
import type { Demo } from './types'

function InteractivePagination({ initial, subject = false }: { initial: number; subject?: boolean }) {
  const [page, setPage] = useState(initial)
  const control = <Pagination page={page} total={5} onChange={setPage} />
  return subject ? <span data-subject>{control}</span> : control
}

export const paginationDemos: Demo[] = [
  { id: 'middle', states: ['hover', 'focus'], render: () => (
      <InteractivePagination initial={2} subject />
    ) },
  { id: 'first-page', render: () => <InteractivePagination initial={1} /> },
  { id: 'last-page', render: () => <InteractivePagination initial={5} /> },
]
