import { useState } from 'react'
import { Segmented } from '../Segmented'
import { Row } from '../layout'
import { Text } from '../text'
import type { Demo } from './types'

function InteractiveViewSegmented() {
  const [value, setValue] = useState('grid')
  return (
    <span data-subject style={{ display: 'block', width: '100%' }}>
      <Row gap={3}>
        <Segmented
          label="View"
          value={value}
          onChange={setValue}
          options={[
            { value: 'grid', label: 'grid' },
            { value: 'list', label: 'list' },
          ]}
        />
        <Text size="sm" muted>Showing {value}</Text>
      </Row>
    </span>
  )
}

function InteractiveSortSegmented() {
  const [value, setValue] = useState('alpha')
  return (
    <Segmented
      label="Sort"
      value={value}
      onChange={setValue}
      tone="mint"
      options={[
        { value: 'alpha', label: 'A–Z' },
        { value: 'recent', label: 'Recent' },
      ]}
    />
  )
}

export const segmentedDemos: Demo[] = [
  { id: 'default', states: ['hover', 'active', 'focus'], render: () => <InteractiveViewSegmented /> },
  { id: 'tone', render: () => <InteractiveSortSegmented /> },
]
