import { useState } from 'react'
import { Checkbox } from '../checkbox'
import type { Demo } from './types'

function InteractiveCheckbox({
  initial,
  label,
  subject = false,
}: {
  initial: boolean | 'indeterminate'
  label: string
  subject?: boolean
}) {
  const [checked, setChecked] = useState<boolean | 'indeterminate'>(initial)
  const control = <Checkbox checked={checked} onChange={setChecked} label={label} />
  return subject ? <span data-subject>{control}</span> : control
}

export const checkboxDemos: Demo[] = [
  { id: 'unchecked', states: ['hover', 'focus'], render: () => (
      <InteractiveCheckbox initial={false} label="Enable notifications" subject />
    ) },
  { id: 'checked', render: () => <InteractiveCheckbox initial label="Enable notifications" /> },
  { id: 'indeterminate', render: () => <InteractiveCheckbox initial="indeterminate" label="Select all" /> },
  { id: 'disabled', render: () => <Checkbox checked={false} onChange={() => {}} disabled label="Disabled" /> },
]
