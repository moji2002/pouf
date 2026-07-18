import * as RCheck from '@radix-ui/react-checkbox'
import clsx from 'clsx'

interface CheckboxProps {
  checked: boolean | 'indeterminate'
  onChange: (checked: boolean | 'indeterminate') => void
  id?: string
  disabled?: boolean
  label?: string
}

export function Checkbox({ checked, onChange, id, disabled, label }: CheckboxProps) {
  return (
    <div className="clay-checkbox-row">
      <RCheck.Root
        id={id}
        className={clsx('clay-checkbox', checked === 'indeterminate' && 'clay-checkbox--indeterminate')}
        // Pass the real tri-state to Radix. Passing `checked === true` collapsed
        // indeterminate to false, so Radix hid the Indicator entirely and the box
        // painted a blank purple blob with no dash. Radix renders the Indicator for
        // 'indeterminate' too, so the minus glyph below now shows.
        checked={checked === 'indeterminate' ? 'indeterminate' : checked}
        onCheckedChange={onChange}
        disabled={disabled}
        aria-label={label}
      >
        <RCheck.Indicator className="clay-checkbox__indicator">
          {/* Inline rather than Icon: the draw-in animation needs pathLength=1
              on the stroke, which the shared icon vocabulary has no reason to
              carry. Geometry and stroke match the Tabler set (24 viewbox, 2.4
              stroke, round caps) so the glyphs read as the same hand. */}
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
              <path d="M5 12h14" pathLength={1} />
            ) : (
              <path d="M5 12l5 5L20 7" pathLength={1} />
            )}
          </svg>
        </RCheck.Indicator>
      </RCheck.Root>
      {label && (
        <label htmlFor={id} className="clay-checkbox__label">
          {label}
        </label>
      )}
    </div>
  )
}
