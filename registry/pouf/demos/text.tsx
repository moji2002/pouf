import { Heading, Highlight, Eyebrow, Text } from '../text'
import type { Demo } from './types'

export const headingDemos: Demo[] = [
  { id: 'levels', render: () => (
      <>
        <Heading level={1}>Level one</Heading>
        <Heading level={2}>Level two</Heading>
        <Heading level={3}>Level three</Heading>
      </>
    ) },
  // Highlight folded in here — meaningless as its own demo.
  { id: 'highlight', render: () => (
      <Heading level={1}>
        soft &amp; <Highlight>puffy</Highlight>
      </Heading>
    ) },
  // Eyebrow folded in here — meaningless as its own demo.
  { id: 'eyebrow', render: () => (
      <>
        <Eyebrow>Section label</Eyebrow>
        <Heading level={2}>Section title</Heading>
      </>
    ) },
]

export const textDemos: Demo[] = [
  { id: 'default', render: () => <Text>Regular body copy.</Text> },
  { id: 'sizes', render: () => (
      <>
        <Text>Medium text</Text>
        <Text size="sm">Small text</Text>
      </>
    ) },
  { id: 'muted', render: () => <Text muted>Muted supporting copy.</Text> },
  { id: 'numeric', render: () => <Text num>+2.41%</Text> },
  { id: 'mono', render: () => <Text mono>const value = 42</Text> },
  { id: 'truncate', render: () => (
      <div style={{ maxWidth: 120 }}>
        <Text truncate>A long line of text that should truncate with an ellipsis</Text>
      </div>
    ) },
]
