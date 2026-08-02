import * as RCheck from '@radix-ui/react-checkbox'
import clsx from 'clsx'
import { useId } from 'react'

interface CheckboxProps {
  checked: boolean | 'indeterminate'
  onChange: (checked: boolean | 'indeterminate') => void
  id?: string
  disabled?: boolean
  label?: string
  /** Keep `label` as the accessible name but stop rendering it visibly.
   *  For rows that already display the text themselves — without this, the
   *  only way to give the box an accessible name was to also print a second
   *  copy of the text next to it. Opt-in, so existing call sites are
   *  unchanged. */
  hideLabel?: boolean
}

export function Checkbox({ checked, onChange, id, disabled, label, hideLabel }: CheckboxProps) {
  const generatedId = useId()
  const controlId = id ?? generatedId
  return (
    <div className="pouf-checkbox-row inline-flex items-center gap-(--s2)">
      <RCheck.Root
        id={controlId}
        className={clsx([
          'pouf-checkbox w-7 h-7 rounded-[9px] border-none p-0 cursor-pointer cushion-field flex-none',
          'flex items-center justify-center',
          '[transition:background_160ms_ease,transform_160ms_cubic-bezier(0.23,1,0.32,1)]',
          'enabled:active:[transform:scale(0.92)]',
          'data-[state=checked]:bg-purple disabled:opacity-50 disabled:cursor-not-allowed',
        ],
        checked === 'indeterminate' ? 'bg-purple' : 'bg-bg')}
        // Pass the real tri-state to Radix. Passing `checked === true` collapsed
        // indeterminate to false, so Radix hid the Indicator entirely and the box
        // painted a blank purple blob with no dash. Radix renders the Indicator for
        // 'indeterminate' too, so the minus glyph below now shows.
        checked={checked === 'indeterminate' ? 'indeterminate' : checked}
        onCheckedChange={onChange}
        disabled={disabled}
        aria-label={label}
      >
        <RCheck.Indicator className={[
            'pouf-checkbox__indicator text-[var(--on-accent)] flex [&_svg]:w-5 [&_svg]:h-5',
            /* Radix mounts the indicator on check, so animate that HTML wrapper
             * with compositor-friendly properties instead of animating the SVG
             * path's stroke. Reduced motion keeps a short opacity-only fade. */
            '[animation:pouf-check-pop_250ms_cubic-bezier(0.23,1,0.32,1)_both]',
            'motion-reduce:[animation-name:pouf-check-fade]',
          ].join(' ')}>
          {/* Inline rather than Icon so the indeterminate state can swap the
              stroke while keeping geometry consistent with the Tabler set. */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {checked === 'indeterminate' ? (
              <path d="M5 12h14" />
            ) : (
              <path d="M5 12l5 5L20 7" />
            )}
          </svg>
        </RCheck.Indicator>
      </RCheck.Root>
      {label && !hideLabel && (
        <label htmlFor={controlId} className="pouf-checkbox__label text-[15px] font-bold text-ink cursor-pointer">
          {label}
        </label>
      )}
    </div>
  )
}
