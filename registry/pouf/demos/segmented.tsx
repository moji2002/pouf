import { Segmented } from '../Segmented'
import { Row } from '../layout'
import { Text } from '../text'
import type { Demo } from './types'

export const segmentedDemos: Demo[] = [
  { id: 'default', states: ['hover', 'active', 'focus'], render: () => (
      <span data-subject>
        <Row gap={3}>
          <Segmented
            label="View"
            value="grid"
            onChange={() => {}}
            options={[
              { value: 'grid', label: 'grid' },
              { value: 'list', label: 'list' },
            ]}
          />
          <Text size="sm" muted>Showing grid</Text>
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
