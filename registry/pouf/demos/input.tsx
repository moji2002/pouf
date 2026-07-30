import { useState } from 'react'
import { Field, Input, Textarea } from '../Input'
import type { Demo } from './types'

// Field's `children` is a render prop `(id, describedBy) => ReactNode` (it
// wires a real <label for>, hint/error text, and aria-describedby) rather
// than plain JSX children — Input/Textarea need those two values passed
// through explicitly.

function InteractiveInput({
  label,
  initial,
  placeholder,
  invalid = false,
  subject = false,
}: {
  label: string
  initial: string
  placeholder?: string
  invalid?: boolean
  subject?: boolean
}) {
  const [value, setValue] = useState(initial)
  const field = (
    <Field label={label} error={invalid ? 'Must be a number' : undefined}>
      {(id, describedBy) => (
        <Input
          id={id}
          name={label.toLowerCase()}
          describedBy={describedBy}
          value={value}
          placeholder={placeholder}
          invalid={invalid}
          onChange={setValue}
          autoComplete="off"
        />
      )}
    </Field>
  )
  return subject ? <span data-subject style={{ display: 'block', width: '100%' }}>{field}</span> : field
}

function InteractiveTextarea() {
  const [value, setValue] = useState('Puffy.\nChunky.')
  return (
    <span data-subject style={{ display: 'block', width: '100%' }}>
      <Field label="Notes">
        {(id, describedBy) => (
          <Textarea
            id={id}
            name="notes"
            describedBy={describedBy}
            value={value}
            onChange={setValue}
            autoComplete="off"
          />
        )}
      </Field>
    </span>
  )
}

export const inputDemos: Demo[] = [
  { id: 'basic', states: ['focus', 'hover'], render: () => <InteractiveInput label="Name" initial="1st-Pouf" subject /> },
  { id: 'placeholder', render: () => <InteractiveInput label="Email" initial="" placeholder="you@example.com…" /> },
  { id: 'invalid', render: () => <InteractiveInput label="Age" initial="abc" invalid /> },
  { id: 'disabled', render: () => (
      <Field label="Locked">
        {(id, describedBy) => <Input id={id} describedBy={describedBy} value="read only" disabled onChange={() => {}} />}
      </Field>
    ) },
  { id: 'textarea', states: ['focus'], render: () => <InteractiveTextarea /> },
]
