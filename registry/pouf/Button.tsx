import clsx from 'clsx'
import type { ReactNode } from 'react'
import { toneClass, type Tone } from './tone'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  tone?: Tone
  size?: 'sm' | 'md' | 'lg'
  /** quiet: no cushion until hover — for tertiary actions that shouldn't
   *  compete with the primary cushion on the same row. */
  variant?: 'solid' | 'quiet'
  block?: boolean
  disabled?: boolean
  /** Shows a spinner and blocks the click. A "Flatten All" that fires twice
   *  because it looked idle is a real position closed twice, so pending state
   *  is not decoration here — it's a safety property. */
  loading?: boolean
  type?: 'button' | 'submit'
  /** Required when the label alone isn't descriptive (icon-only buttons). */
  label?: string
}

export function Button({
  children,
  onClick,
  tone = 'purple',
  size = 'md',
  variant = 'solid',
  block,
  disabled,
  loading,
  type = 'button',
  label,
}: ButtonProps) {
  return (
    <button
      type={type}
      className={clsx(
        'pouf-btn',
        size === 'sm' && 'pouf-btn--sm',
        size === 'lg' && 'pouf-btn--lg',
        variant === 'quiet' && 'pouf-btn--quiet',
        block && 'pouf-btn--block',
        toneClass(tone),
      )}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      aria-label={label}
    >
      {loading && <span className="pouf-btn__spinner" aria-hidden="true" />}
      {children}
    </button>
  )
}
