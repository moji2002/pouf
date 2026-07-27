import * as RRadio from '@radix-ui/react-radio-group'
import { useId } from 'react'

interface RadioOption {
  value: string
  label: string
}

interface RadioGroupProps {
  value: string
  onChange: (value: string) => void
  options: RadioOption[]
  label: string
  disabled?: boolean
}

export function RadioGroup({ value, onChange, options, label, disabled }: RadioGroupProps) {
  const groupId = useId()
  return (
    <RRadio.Root
      className="pouf-radio-group flex flex-col gap-(--s2)"
      value={value}
      onValueChange={onChange}
      disabled={disabled}
      aria-label={label}
    >
      {options.map((o) => {
        const optionId = `${groupId}-${o.value}`
        return (
          <div key={o.value} className="pouf-radio-row flex items-center gap-(--s2)">
            <RRadio.Item id={optionId} value={o.value} aria-label={o.label} className={[
              /* Sized with the checkbox — they sit in the same forms. */
              'pouf-radio w-7 h-7 rounded-[50%] bg-bg border-none p-0 cursor-pointer cushion-field flex-none',
              'flex items-center justify-center [transition:background_160ms_ease]',
              'data-[state=checked]:bg-purple disabled:opacity-50 disabled:cursor-not-allowed',
            ].join(' ')}>
              <RRadio.Indicator className={[
                /* A white dot on the purple disc, not a dark one: an ink dot on
                 * lavender read as a pupil in a puffy eye. */
                'pouf-radio__indicator w-2.5 h-2.5 rounded-[50%] bg-surface',
                '[box-shadow:0_1px_1px_rgba(58,46,92,0.3)]',
              ].join(' ')} />
            </RRadio.Item>
            <label htmlFor={optionId} className="pouf-radio__label text-[15px] font-bold text-ink cursor-pointer">
              {o.label}
            </label>
          </div>
        )
      })}
    </RRadio.Root>
  )
}
