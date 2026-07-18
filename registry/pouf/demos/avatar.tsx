import { Avatar } from '../avatar'
import { Row } from '../layout'
import type { Demo } from './types'

export const avatarDemos: Demo[] = [
  { id: 'fallback', render: () => (
      <Row gap={5}>
        <Avatar fallback="MB" tone="purple" />
        <Avatar fallback="JD" tone="pink" size="sm" />
      </Row>
    ) },
  { id: 'icon', render: () => (
      <Row gap={5}>
        <Avatar icon="settings" tone="mint" />
        <Avatar icon="channels" tone="blue" size="lg" />
      </Row>
    ) },
  { id: 'sizes', render: () => (
      <Row gap={5}>
        <Avatar fallback="SM" size="sm" />
        <Avatar fallback="MD" size="md" />
        <Avatar fallback="LG" size="lg" />
      </Row>
    ) },
]
