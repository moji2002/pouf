import { Slider } from '../slider'
import { Stack } from '../layout'
import { Text } from '../text'
import type { Demo } from './types'

export const sliderDemos: Demo[] = [
  { id: 'single', states: ['hover', 'focus'], render: () => (
      <span data-subject>
        <Stack gap={2}>
          <Text size="sm" muted>Volume: 40%</Text>
          <Slider value={[40]} onChange={() => {}} label="Volume" />
        </Stack>
      </span>
    ) },
  { id: 'range', render: () => (
      <Stack gap={2}>
        <Text size="sm" muted>Price range: 20–80%</Text>
        <Slider value={[20, 80]} onChange={() => {}} label="Price range" />
      </Stack>
    ) },
  { id: 'disabled', render: () => <Slider value={[50]} onChange={() => {}} disabled label="Disabled" /> },
]
