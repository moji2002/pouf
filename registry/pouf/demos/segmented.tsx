import { Segmented } from '../Segmented'
import { Row } from '../layout'
import { Text } from '../text'
import type { Demo } from './types'

export const segmentedDemos: Demo[] = [
  { id: 'default', states: ['hover', 'active', 'focus'], render: () => (
      <span data-subject>
        <Row gap={3}>
          <Segmented
            label="Mode"
            value="paper"
            onChange={() => {}}
            options={[
              { value: 'paper', label: 'paper' },
              { value: 'live', label: 'live' },
            ]}
          />
          <Text size="sm" muted>Showing paper</Text>
        </Row>
      </span>
    ) },
  { id: 'tone', render: () => (
      <Segmented
        label="Sort"
        value="alpha"
        onChange={() => {}}
        tone="mint"
        options={[
          { value: 'alpha', label: 'A–Z' },
          { value: 'recent', label: 'Recent' },
        ]}
      />
    ) },
]
