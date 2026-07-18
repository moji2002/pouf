import { Blob, Badge, Dot, Figure } from '../media'
import { Row } from '../layout'
import { Text } from '../text'
import type { Demo } from './types'

const SAMPLE_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180">
       <rect width="320" height="180" fill="#c7b9f5"/>
       <text x="160" y="96" font-family="sans-serif" font-size="20" font-weight="bold"
             fill="#3a2e5c" text-anchor="middle">sample image</text>
     </svg>`,
  )

export const blobDemos: Demo[] = [
  { id: 'tones', render: () => (
      <Row>
        <Blob tone="pink" icon="up" />
        <Blob tone="purple" icon="channels" />
        <Blob tone="blue" icon="signals" />
        <Blob tone="mint" icon="ok" />
        <Blob tone="yellow" icon="overview" />
        <Blob tone="orange" icon="live" />
      </Row>
    ) },
  { id: 'sizes', render: () => (
      <Row>
        <Blob tone="purple" icon="settings" size="sm" />
        <Blob tone="purple" icon="settings" size="md" />
        <Blob tone="purple" icon="settings" size="lg" />
      </Row>
    ) },
  { id: 'labelled', render: () => <Blob tone="mint" icon="ok" label="Connected" /> },
]

export const badgeDemos: Demo[] = [
  { id: 'tones', render: () => (
      <Row>
        <Badge tone="up">Long</Badge>
        <Badge tone="down">Short</Badge>
        <Badge tone="warn">Breaker</Badge>
        <Badge tone="info">Paper</Badge>
      </Row>
    ) },
]

export const dotDemos: Demo[] = [
  { id: 'tones', render: () => (
      <Row gap={5}>
        <Row gap={2} wrap={false}>
          <Dot tone="up" /><Text size="sm">Connected</Text>
        </Row>
        <Row gap={2} wrap={false}>
          <Dot tone="down" /><Text size="sm">Disconnected</Text>
        </Row>
        <Row gap={2} wrap={false}>
          <Dot tone="warn" /><Text size="sm">Degraded</Text>
        </Row>
      </Row>
    ) },
]

export const figureDemos: Demo[] = [
  { id: 'default', render: () => <Figure src={SAMPLE_IMAGE} alt="A worked example screenshot" /> },
]
