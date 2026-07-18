import { Field, Input, Textarea } from '../Input'
import type { Demo } from './types'

// Field's `children` is a render prop `(id, describedBy) => ReactNode` (it
// wires a real <label for>, hint/error text, and aria-describedby) rather
// than plain JSX children — Input/Textarea need those two values passed
// through explicitly.

export const inputDemos: Demo[] = [
  { id: 'basic', states: ['focus', 'hover'], render: () => (
      <span data-subject>
        <Field label="Name">
          {(id, describedBy) => <Input id={id} describedBy={describedBy} value="Pouf" onChange={() => {}} />}
        </Field>
      </span>
    ) },
  { id: 'placeholder', render: () => (
      <Field label="Email">
        {(id, describedBy) => (
          <Input id={id} describedBy={describedBy} value="" placeholder="you@example.com" onChange={() => {}} />
        )}
      </Field>
    ) },
  { id: 'invalid', render: () => (
      <Field label="Age" error="Must be a number">
        {(id, describedBy) => <Input id={id} describedBy={describedBy} value="abc" invalid onChange={() => {}} />}
      </Field>
    ) },
  { id: 'disabled', render: () => (
      <Field label="Locked">
        {(id, describedBy) => <Input id={id} describedBy={describedBy} value="read only" disabled onChange={() => {}} />}
      </Field>
    ) },
  { id: 'textarea', states: ['focus'], render: () => (
      <span data-subject>
        <Field label="Notes">
          {(id, describedBy) => (
            <Textarea id={id} describedBy={describedBy} value={'Puffy.\nChunky.'} onChange={() => {}} />
          )}
        </Field>
      </span>
    ) },
]
