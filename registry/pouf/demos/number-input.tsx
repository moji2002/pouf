import { Field } from '../Input'
import { NumberInput } from '../NumberInput'
import type { Demo } from './types'

export const numberInputDemos: Demo[] = [
  { id: 'default', states: ['hover', 'focus'], render: () => (
      <span data-subject>
        <Field label="Stepper" hint="Steps by 0.1; floor at 0.">
          {(id, d) => <NumberInput id={id} describedBy={d} value="1.5" onChange={() => {}} step={0.1} min={0} />}
        </Field>
      </span>
    ) },
  { id: 'at-min', render: () => (
      <Field label="At minimum">
        {(id, d) => <NumberInput id={id} describedBy={d} value="0" onChange={() => {}} step={1} min={0} max={10} />}
      </Field>
    ) },
  { id: 'at-max', render: () => (
      <Field label="At maximum">
        {(id, d) => <NumberInput id={id} describedBy={d} value="10" onChange={() => {}} step={1} min={0} max={10} />}
      </Field>
    ) },
  { id: 'invalid', render: () => (
      <Field label="Invalid" error="Must be a number">
        {(id, d) => <NumberInput id={id} describedBy={d} value="abc" onChange={() => {}} invalid />}
      </Field>
    ) },
  { id: 'disabled', render: () => (
      <Field label="Disabled">
        {(id, d) => <NumberInput id={id} describedBy={d} value="5" onChange={() => {}} disabled />}
      </Field>
    ) },
]
