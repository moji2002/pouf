import { RadioGroup } from '../radiogroup'
import type { Demo } from './types'

export const radioGroupDemos: Demo[] = [
  { id: 'default', states: ['hover', 'focus'], render: () => (
      <span data-subject>
        <RadioGroup
          label="Sort by"
          value="weekly"
          onChange={() => {}}
          options={[
            { value: 'weekly', label: 'Weekly' },
            { value: 'monthly', label: 'Monthly' },
            { value: 'alpha', label: 'Alphabetical' },
          ]}
        />
      </span>
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
