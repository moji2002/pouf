import { Button } from '../../../registry/pouf/Button'
import { Card } from '../../../registry/pouf/surface'
import { Stat } from '../../../registry/pouf/readout'
import { Badge, Blob } from '../../../registry/pouf/media'
import { Switch } from '../../../registry/pouf/controls'
import { Segmented } from '../../../registry/pouf/Segmented'
import { Stack, Row } from '../../../registry/pouf/layout'
import { Heading, Text } from '../../../registry/pouf/text'
import { useState } from 'react'

/** A live collage of real Pouf components — the landing's proof that the site
 * runs on the library it documents. */
export function HeroShowcase() {
  const [on, setOn] = useState(true)
  const [seg, setSeg] = useState('day')
  return (
    <Card>
      <Stack gap={5}>
        <Row justify="between">
          <Row gap={3} wrap={false}>
            <Blob icon="target" tone="purple" />
            <Stack gap={1}>
              <Heading level={3}>Dashboard</Heading>
              <Text size="sm" muted>Everything a cushion.</Text>
            </Stack>
          </Row>
          <Badge tone="mint">Live</Badge>
        </Row>
        <Row gap={4}>
          <Stat label="Revenue" value="$48.2k" icon="ok" tone="mint" />
          <Stat label="Signups" value="1,204" icon="add" tone="blue" />
        </Row>
        <Segmented
          label="Range"
          value={seg}
          onChange={setSeg}
          options={[
            { value: 'day', label: 'Day' },
            { value: 'week', label: 'Week' },
            { value: 'month', label: 'Month' },
          ]}
        />
        <Row justify="between">
          <Row gap={2} wrap={false}>
            <Switch checked={on} onChange={setOn} label="Notifications" />
            <Text size="sm">Notifications</Text>
          </Row>
          <Button tone="pink">Get started</Button>
        </Row>
      </Stack>
    </Card>
  )
}
