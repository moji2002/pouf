import { cva } from 'class-variance-authority'
import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react'

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
    <div className="pouf-field flex flex-col gap-(--s2)">
      {/* Labels use ink so their compact uppercase treatment stays emphatic. */}
      <label className="pouf-label text-[13px] font-black tracking-[0.6px] uppercase text-ink" htmlFor={id}>
        {label}
      </label>
      {children(id, describedBy)}
      {hint && !error && (
        <span className="pouf-hint text-[13px] font-bold text-muted" id={`${id}-hint`}>
          {hint}
        </span>
      )}
      {/* FIELD-level validation message: a compact one-liner under a control.
        * NOT the page alert cushion (ErrorNote) — this one must stay quiet, so
        * it keeps the flat little pill it always was. self-start: hug the
        * message rather than stretch to fill a flex/grid cell. */}
      {error && (
        <span
          className="pouf-error text-[13px] font-extrabold text-[var(--on-accent)] bg-orange rounded-xl py-(--s2) px-(--s3) [align-self:start] max-w-full"
          id={`${id}-err`}
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  )
}

/* One cva for every input voice in the system, exported because the Select and
 * Combobox triggers (and Combobox's search input) wear the same field chrome.
 * `bare` is the NumberInput-capsule voice: the capsule carries the chrome, so
 * the input inside goes transparent and shadowless, and even its disabled fade
 * is suppressed (the capsule already fades; double-fading blurs the value).
 * Shadow ownership is per-variant because same-property utilities don't
 * cascade; a focused invalid input shows the focus ring (pseudo specificity),
 * matching the original selector order. */
export const inputClasses = cva(
  'pouf-input font-bold text-[15px] text-ink border-none rounded-control w-full placeholder:text-muted',
  {
    variants: {
      bare: {
        false: 'bg-bg px-5 pt-[14px] pb-[18px] min-h-[52px] focus:outline-none focus-visible:outline-none disabled:opacity-55 disabled:cursor-not-allowed',
        true: 'bg-transparent flex-1 min-w-0 min-h-0 text-center px-0 pt-[6px] pb-[10px] [box-shadow:none] focus:[box-shadow:none] focus:outline-none focus-visible:outline-none disabled:opacity-100 disabled:cursor-not-allowed',
      },
      invalid: { true: '', false: '' },
      /* mono OWNS font-family — a base font-pouf would fight it (same-property
       * utilities don't cascade; stylesheet order is not the cascade). */
      mono: {
        true: "[font-family:ui-monospace,'SF_Mono',Menlo,monospace] [font-variant-numeric:tabular-nums]",
        false: 'font-pouf',
      },
    },
    compoundVariants: [
      { bare: false, invalid: false, className: 'cushion-field focus:[box-shadow:var(--pouf-field-focus)]' },
      {
        bare: false,
        invalid: true,
        className:
          '[box-shadow:var(--pouf-field),inset_0_0_0_3px_var(--orange)] focus:[box-shadow:var(--pouf-field-focus)]',
      },
    ],
    defaultVariants: { bare: false, invalid: false, mono: false },
  },
)

interface InputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'children' | 'className' | 'style' | 'value' | 'onChange'
  > {
  value: string
  onChange: (value: string) => void
  onBlur?: InputHTMLAttributes<HTMLInputElement>['onBlur']
  id?: string
  name?: string
  describedBy?: string
  placeholder?: string
  type?: InputHTMLAttributes<HTMLInputElement>['type']
  autoComplete?: string
  inputMode?: InputHTMLAttributes<HTMLInputElement>['inputMode']
  autoCapitalize?: string
  spellCheck?: boolean
  required?: boolean
  mono?: boolean
  invalid?: boolean
  disabled?: boolean
  label?: string
  /** Internal: the NumberInput capsule carries the chrome. */
  bare?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    value,
    onChange,
    describedBy,
    type = 'text',
    mono,
    invalid,
    label,
    bare,
    ...nativeProps
  },
  ref,
) {
  return (
    <input
      ref={ref}
      {...nativeProps}
      className={inputClasses({ bare: !!bare, invalid: !!invalid, mono })}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      type={type}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      aria-label={label}
    />
  )
})

/* ------------------------------------------------------------------ */
/* Textarea                                                            */
/* ------------------------------------------------------------------ */

interface TextareaProps
  extends Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    'children' | 'className' | 'style' | 'value' | 'onChange'
  > {
  value: string
  onChange: (value: string) => void
  onBlur?: TextareaHTMLAttributes<HTMLTextAreaElement>['onBlur']
  id?: string
  name?: string
  describedBy?: string
  placeholder?: string
  autoComplete?: string
  spellCheck?: boolean
  required?: boolean
  rows?: number
  mono?: boolean
  invalid?: boolean
  disabled?: boolean
  label?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    value,
    onChange,
    describedBy,
    rows = 4,
    mono,
    invalid,
    label,
    ...nativeProps
  },
  ref,
) {
  return (
    <textarea
      ref={ref}
      {...nativeProps}
      className={`${inputClasses({ invalid: !!invalid, mono })} pouf-textarea resize-y min-h-[100px]`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      aria-label={label}
    />
  )
})
