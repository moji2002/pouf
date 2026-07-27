import { useState } from 'react'
import { Field } from '../Input'
import { NumberInput } from '../NumberInput'
import type { Demo } from './types'

function InteractiveNumberInput({
  label,
  initial,
  step = 1,
  min,
  max,
  invalid = false,
  subject = false,
}: {
  label: string
  initial: string
  step?: number
  min?: number
  max?: number
  invalid?: boolean
  subject?: boolean
}) {
  const [value, setValue] = useState(initial)
  const field = (
    <Field
      label={label}
      hint={label === 'Stepper' ? 'Steps by 0.1; floor at 0.' : undefined}
      error={invalid ? 'Must be a number' : undefined}
    >
      {(id, d) => (
        <NumberInput
          id={id}
          describedBy={d}
          value={value}
          onChange={setValue}
          step={step}
          min={min}
          max={max}
          invalid={invalid}
        />
      )}
    </Field>
  )
  return subject ? <span data-subject style={{ display: 'block', width: '100%' }}>{field}</span> : field
}

export const numberInputDemos: Demo[] = [
  { id: 'default', states: ['hover', 'focus'], render: () => <InteractiveNumberInput label="Stepper" initial="1.5" step={0.1} min={0} subject /> },
  { id: 'at-min', render: () => <InteractiveNumberInput label="At minimum" initial="0" min={0} max={10} /> },
  { id: 'at-max', render: () => <InteractiveNumberInput label="At maximum" initial="10" min={0} max={10} /> },
  { id: 'invalid', render: () => <InteractiveNumberInput label="Invalid" initial="abc" invalid /> },
  { id: 'disabled', render: () => (
      <Field label="Disabled">
        {(id, d) => <NumberInput id={id} describedBy={d} value="5" onChange={() => {}} disabled />}
      </Field>
    ) },
]
