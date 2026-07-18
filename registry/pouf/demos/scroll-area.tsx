import { ScrollArea } from '../scrollarea'
import { Stack } from '../layout'
import { Text } from '../text'
import type { Demo } from './types'

const LINES = ['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5', 'Line 6', 'Line 7', 'Line 8']

export const scrollAreaDemos: Demo[] = [
  { id: 'default', render: () => (
      <ScrollArea maxHeight="120px">
        <Stack gap={2}>
          {LINES.map((line) => (
            <Text key={line} size="sm" muted>{line}: some scrollable content inside the ScrollArea primitive.</Text>
          ))}
        </Stack>
      </ScrollArea>
    ) },
]
