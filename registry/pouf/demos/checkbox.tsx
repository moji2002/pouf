import { Checkbox } from '../checkbox'
import type { Demo } from './types'

export const checkboxDemos: Demo[] = [
  { id: 'unchecked', states: ['hover', 'focus'], render: () => (
      <span data-subject><Checkbox checked={false} onChange={() => {}} label="Enable notifications" /></span>
    ) },
  { id: 'checked', render: () => <Checkbox checked onChange={() => {}} label="Enable notifications" /> },
  { id: 'indeterminate', render: () => <Checkbox checked="indeterminate" onChange={() => {}} label="Select all" /> },
  { id: 'disabled', render: () => <Checkbox checked={false} onChange={() => {}} disabled label="Disabled" /> },
]
