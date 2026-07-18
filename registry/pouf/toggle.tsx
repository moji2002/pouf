import * as RToggle from '@radix-ui/react-toggle-group'
import clsx from 'clsx'
import { toneClass, type Tone } from './tone'
import { Icon } from './Icon'
import type { IconName } from './Icon'

export interface ToggleOption {
  value: string
  label: string
  icon?: IconName
}

interface ToggleGroupProps {
  value: string[]
  onChange: (value: string[]) => void
  options: ToggleOption[]
  label: string
  tone?: Tone
}

export function ToggleGroup({ value, onChange, options, label, tone = 'purple' }: ToggleGroupProps) {
  return (
    <RToggle.Root
      type="multiple"
      value={value}
      onValueChange={onChange}
      className="pouf-toggle"
      aria-label={label}
    >
      {options.map((o) => (
        // Literal pouf-btn classes, like Segmented: an "on" item is pressed in
        // (pouf-toggle__item[data-state='on']), never merely re-coloured.
        <RToggle.Item
          key={o.value}
          value={o.value}
          className={clsx('pouf-btn', 'pouf-btn--sm', 'pouf-toggle__item', toneClass(tone))}
        >
          {o.icon && <Icon name={o.icon} size="sm" />}
          {o.label}
        </RToggle.Item>
      ))}
    </RToggle.Root>
  )
}
