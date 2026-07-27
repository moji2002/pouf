import { useState } from 'react'
import { Slider } from '../slider'
import { Stack } from '../layout'
import { Text } from '../text'
import type { Demo } from './types'

function InteractiveSlider({
  initial,
  label,
  subject = false,
}: {
  initial: number[]
  label: string
  subject?: boolean
}) {
  const [value, setValue] = useState(initial)
  const shown = value.length === 1 ? `${value[0]}%` : `${value[0]}–${value[1]}%`
  const content = (
    <Stack gap={2}>
      <Text size="sm" muted>{label}: {shown}</Text>
      <Slider value={value} onChange={setValue} label={label} />
    </Stack>
  )
  return subject ? <span data-subject style={{ display: 'block', width: '100%' }}>{content}</span> : content
}

export const sliderDemos: Demo[] = [
  { id: 'single', states: ['hover', 'focus'], render: () => (
      <InteractiveSlider initial={[40]} label="Volume" subject />
    ) },
  { id: 'range', render: () => <InteractiveSlider initial={[20, 80]} label="Price range" /> },
  { id: 'disabled', render: () => <Slider value={[50]} onChange={() => {}} disabled label="Disabled" /> },
]
