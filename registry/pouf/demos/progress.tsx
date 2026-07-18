import { Progress } from '../progress'
import { Row, Stack } from '../layout'
import { Text } from '../text'
import type { Demo } from './types'

export const progressDemos: Demo[] = [
  { id: 'default', render: () => (
      <Stack gap={2}>
        <Row gap={3} wrap={false}>
          <Progress value={40} tone="mint" label="Uploading" />
          <Text size="sm" mono num>40%</Text>
        </Row>
        <Row gap={3} wrap={false}>
          <Progress value={85} tone="blue" label="Processing" />
          <Text size="sm" mono num>85%</Text>
        </Row>
      </Stack>
    ) },
  { id: 'zero', render: () => <Progress value={0} tone="purple" label="Not started" /> },
  { id: 'complete', render: () => <Progress value={100} tone="up" label="Done" /> },
]
