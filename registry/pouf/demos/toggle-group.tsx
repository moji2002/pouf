import { useState } from 'react'
import { ToggleGroup } from '../toggle'
import type { Demo } from './types'

const richOptions = [
  { value: 'bold', label: 'Bold', icon: 'add' as const },
  { value: 'italic', label: 'Italic', icon: 'draft' as const },
  { value: 'mono', label: 'Mono', icon: 'settings' as const },
]

function InteractiveToggleGroup({
  initial,
  compact = false,
  icons = false,
  subject = false,
}: {
  initial: string[]
  compact?: boolean
  icons?: boolean
  subject?: boolean
}) {
  const [value, setValue] = useState(initial)
  const options = richOptions
    .slice(0, compact ? 2 : 3)
    .map((option) => icons ? option : { value: option.value, label: option.label })
  const control = <ToggleGroup label="Format" value={value} onChange={setValue} options={options} />
  return subject ? <span data-subject>{control}</span> : control
}

export const toggleGroupDemos: Demo[] = [
  { id: 'default', states: ['hover', 'focus'], render: () => <InteractiveToggleGroup initial={['bold']} icons subject /> },
  { id: 'multi-selected', render: () => <InteractiveToggleGroup initial={['bold', 'italic']} /> },
  { id: 'none-selected', render: () => <InteractiveToggleGroup initial={[]} compact /> },
]
