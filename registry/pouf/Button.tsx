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

/** The button look as a class string, exported because Segmented, Tabs,
 *  ToggleGroup, and BottomNav's menu compose literal buttons — sharing the
 *  builder means a toggle can never drift from the button it imitates.
 *  'pouf-btn' rides along as an unstyled MARKER class: it carries no rules of
 *  its own anymore, but container selectors (e.g. the dialog head's
 *  `> .pouf-btn` spacing override) still address buttons through it. */
export function buttonClasses(opts: { tone?: Tone; size?: 'sm' | 'md' | 'lg'; variant?: 'solid' | 'quiet'; block?: boolean } = {}): string {
  const { tone = 'purple', size = 'md', variant = 'solid', block } = opts
  return clsx(
    'pouf-btn relative items-center justify-center gap-(--s2) font-pouf font-black leading-none',
    block ? 'flex w-full' : 'inline-flex',
    'text-ink border-none cursor-pointer',
    '[transition:box-shadow_120ms_ease,transform_120ms_ease]',
    'enabled:active:[transform:translateY(2px)] enabled:active:cushion-control-active',
    'disabled:cursor-not-allowed disabled:opacity-50',
    size === 'md' && 'text-[15px] px-[26px] py-[14px] min-h-12 rounded-control',
    size === 'sm' && 'text-[13px] px-4 py-[9px] min-h-[38px] rounded-[14px]',
    size === 'lg' && 'text-[17px] px-8 py-[18px] min-h-14 rounded-control',
    /* Same-property utilities don't cascade like the old selectors did, so
     * solid/quiet each own their background and shadow outright. A disabled
     * cushion must read as pressed-flat, not merely faded: the affordance
     * is the depth, so removing the depth is the real signal — solid goes
     * pressed, quiet (already flat) goes bare. */
    variant === 'solid' &&
      'bg-[var(--tone,var(--purple))] cushion-control disabled:cushion-control-active disabled:[transform:translateY(2px)]',
    variant === 'quiet' &&
      'bg-transparent [box-shadow:inset_0_0_0_2px_rgba(201,168,255,0.55)] enabled:hover:bg-bg enabled:hover:cushion-field disabled:[box-shadow:none]',
    toneClass(tone),
  )
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
      className={buttonClasses({ tone, size, variant, block })}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      aria-label={label}
    >
      {loading && (
        <span
          className="size-[15px] rounded-[50%] border-[3px] border-solid border-[rgba(58,46,92,0.25)] border-t-ink [animation:pouf-spin_620ms_linear_infinite]"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  )
}
