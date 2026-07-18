import clsx from 'clsx'
import { useId, type ReactNode } from 'react'

interface FieldProps {
  label: string
  children: (id: string, describedBy: string | undefined) => ReactNode
  hint?: string
  error?: string
}

/** Wraps any control with a real <label for>, hint and error text, and wires
 * aria-describedby. Screens pass a render fn so the same wrapper serves Input,
 * Select and Switch without duplicating the a11y plumbing. */
export function Field({ label, children, hint, error }: FieldProps) {
  const id = useId()
  const describedBy = error ? `${id}-err` : hint ? `${id}-hint` : undefined
  return (
    <div className="pouf-field">
      <label className="pouf-label" htmlFor={id}>
        {label}
      </label>
      {children(id, describedBy)}
      {hint && !error && (
        <span className="pouf-hint" id={`${id}-hint`}>
          {hint}
        </span>
      )}
      {error && (
        <span className="pouf-error" id={`${id}-err`} role="alert">
          {error}
        </span>
      )}
    </div>
  )
}

interface InputProps {
  value: string
  onChange: (value: string) => void
  id?: string
  describedBy?: string
  placeholder?: string
  type?: 'text' | 'password'
  mono?: boolean
  invalid?: boolean
  disabled?: boolean
  label?: string
}

export function Input({
  value,
  onChange,
  id,
  describedBy,
  placeholder,
  type = 'text',
  mono,
  invalid,
  disabled,
  label,
}: InputProps) {
  return (
    <input
      id={id}
      className={clsx('pouf-input', mono && 'pouf-input--mono', invalid && 'pouf-input--invalid')}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      type={type}
      disabled={disabled}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      aria-label={label}
    />
  )
}

/* ------------------------------------------------------------------ */
/* Textarea                                                            */
/* ------------------------------------------------------------------ */

interface TextareaProps {
  value: string
  onChange: (value: string) => void
  id?: string
  describedBy?: string
  placeholder?: string
  rows?: number
  mono?: boolean
  invalid?: boolean
  disabled?: boolean
  label?: string
}

export function Textarea({
  value,
  onChange,
  id,
  describedBy,
  placeholder,
  rows = 4,
  mono,
  invalid,
  disabled,
  label,
}: TextareaProps) {
  return (
    <textarea
      id={id}
      className={clsx('pouf-input', 'pouf-textarea', mono && 'pouf-input--mono', invalid && 'pouf-input--invalid')}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      aria-label={label}
    />
  )
}
