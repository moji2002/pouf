import { Card, RowCard } from '../surface'
import { Row } from '../layout'
import { Text } from '../text'
import { Badge, Blob } from '../media'
import type { Demo } from './types'

export const cardDemos: Demo[] = [
  { id: 'default', render: () => (
      <Card>
        <Text>Default card — 32px padding, full radius.</Text>
      </Card>
    ) },
  { id: 'tight', render: () => (
      <Card variant="tight">
        <Text size="sm">Tight card — 16px padding.</Text>
      </Card>
    ) },
  { id: 'flush', render: () => (
      <Card variant="flush">
        <Text size="sm">Flush card — no padding, clipped.</Text>
      </Card>
    ) },
]

export const rowCardDemos: Demo[] = [
  { id: 'default', render: () => (
      <RowCard>
        <Row justify="between" wrap={false}>
          <Row gap={3} wrap={false}>
            <Blob tone="up" size="sm" icon="up" />
            <Text>Apple</Text>
            <Badge tone="up">Trending</Badge>
          </Row>
          <Text num>+2.41%</Text>
        </Row>
      </RowCard>
    ) },
  { id: 'interactive', states: ['hover', 'active', 'focus'], render: () => (
      <span data-subject>
        <RowCard onClick={() => {}}>
          <Row justify="between" wrap={false}>
            <Text>Banana</Text>
            <Text num>−0.87%</Text>
          </Row>
        </RowCard>
      </span>
    ) },
  { id: 'selected', render: () => (
      <RowCard selected onClick={() => {}}>
        <Row justify="between" wrap={false}>
          <Text>Cherry — selected</Text>
          <Text num>+0.00%</Text>
        </Row>
      </RowCard>
    ) },
]
