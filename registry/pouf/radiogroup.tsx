import * as RRadio from '@radix-ui/react-radio-group'

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
  return (
    <RRadio.Root
      className="pouf-radio-group"
      value={value}
      onValueChange={onChange}
      disabled={disabled}
      aria-label={label}
    >
      {options.map((o) => (
        <div key={o.value} className="pouf-radio-row">
          <RRadio.Item id={`radio-${o.value}`} value={o.value} className="pouf-radio">
            <RRadio.Indicator className="pouf-radio__indicator" />
          </RRadio.Item>
          <label htmlFor={`radio-${o.value}`} className="pouf-radio__label">
            {o.label}
          </label>
        </div>
      ))}
    </RRadio.Root>
  )
}
