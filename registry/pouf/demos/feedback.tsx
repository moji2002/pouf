import { Empty, Skeleton, ErrorNote } from '../feedback'
import type { Demo } from './types'

export const emptyDemos: Demo[] = [
  { id: 'default', render: () => <Empty icon="ok" title="Nothing here yet">Add your first item to get started.</Empty> },
  { id: 'no-description', render: () => <Empty icon="idle" title="Nothing here yet" /> },
]

export const skeletonDemos: Demo[] = [
  { id: 'row', render: () => <Skeleton variant="row" count={2} /> },
  { id: 'text', render: () => <Skeleton variant="text" count={3} /> },
  { id: 'card', render: () => <Skeleton variant="card" /> },
]

export const errorNoteDemos: Demo[] = [
  { id: 'default', render: () => <ErrorNote>Exchange rejected the request: insufficient margin.</ErrorNote> },
]
