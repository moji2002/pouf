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
      className="clay-radio-group"
      value={value}
      onValueChange={onChange}
      disabled={disabled}
      aria-label={label}
    >
      {options.map((o) => (
        <div key={o.value} className="clay-radio-row">
          <RRadio.Item id={`radio-${o.value}`} value={o.value} className="clay-radio">
            <RRadio.Indicator className="clay-radio__indicator" />
          </RRadio.Item>
          <label htmlFor={`radio-${o.value}`} className="clay-radio__label">
            {o.label}
          </label>
        </div>
      ))}
    </RRadio.Root>
  )
}
