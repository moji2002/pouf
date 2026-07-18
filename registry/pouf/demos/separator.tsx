import { Separator } from '../separator'
import { Card } from '../surface'
import { Stack } from '../layout'
import { Text } from '../text'
import type { Demo } from './types'

export const separatorDemos: Demo[] = [
  { id: 'default', render: () => (
      <Card variant="tight">
        <Stack gap={3}>
          <Text>Above the line.</Text>
          <Separator />
          <Text size="sm" muted>Below the line.</Text>
        </Stack>
      </Card>
    ) },
]
