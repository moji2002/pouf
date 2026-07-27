import { useState } from 'react'
import { RadioGroup } from '../radiogroup'
import type { Demo } from './types'

const sortOptions = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'alpha', label: 'Alphabetical' },
]

function InteractiveRadioGroup({ subject = false }: { subject?: boolean }) {
  const [value, setValue] = useState('weekly')
  const control = (
    <RadioGroup
      label="Sort by"
      value={value}
      onChange={setValue}
      options={sortOptions}
    />
  )
  return subject ? <span data-subject>{control}</span> : control
}

export const radioGroupDemos: Demo[] = [
  { id: 'default', states: ['hover', 'focus'], render: () => (
      <InteractiveRadioGroup subject />
    ) },
  { id: 'disabled', render: () => (
      <RadioGroup
        label="Sort by"
        value="weekly"
        onChange={() => {}}
        disabled
        options={[
          { value: 'weekly', label: 'Weekly' },
          { value: 'monthly', label: 'Monthly' },
        ]}
      />
    ) },
]
