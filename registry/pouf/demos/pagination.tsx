import { Pagination } from '../pagination'
import type { Demo } from './types'

export const paginationDemos: Demo[] = [
  { id: 'middle', states: ['hover', 'focus'], render: () => (
      <span data-subject><Pagination page={2} total={5} onChange={() => {}} /></span>
    ) },
  { id: 'first-page', render: () => <Pagination page={1} total={5} onChange={() => {}} /> },
  { id: 'last-page', render: () => <Pagination page={5} total={5} onChange={() => {}} /> },
]
