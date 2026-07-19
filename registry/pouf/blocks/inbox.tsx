import { useState } from 'react'
import { Card, RowCard } from '../surface'
import { Stack, Row, Spacer } from '../layout'
import { Heading, Text } from '../text'
import { Avatar } from '../avatar'
import { Badge, Dot } from '../media'
import { Button } from '../Button'
import { Icon } from '../Icon'

interface Mail {
  id: string
  from: string
  subject: string
  preview: string
  time: string
  tone: 'purple' | 'pink' | 'blue' | 'mint'
  unread: boolean
}

const MAIL: Mail[] = [
  { id: '1', from: 'Maya Bloom', subject: 'The cushion buttons shipped', preview: 'Just merged — depth really does sell it. Take a look when you get a sec.', time: '9:41', tone: 'mint', unread: true },
  { id: '2', from: 'Grace Hopper', subject: 'Migration is green', preview: 'Zero visual drift across 2,700 lines. The snapshot gate paid off.', time: '8:12', tone: 'blue', unread: true },
  { id: '3', from: 'Katherine J.', subject: 'Optical centering notes', preview: 'Attached the write-up on why a centered glyph looks low on a cushion.', time: 'Yesterday', tone: 'pink', unread: false },
  { id: '4', from: 'Alan Turing', subject: 'Variants over classNames', preview: 'A short argument for why the strict API keeps everything on-system.', time: 'Yesterday', tone: 'purple', unread: false },
]

/** An example email inbox: a message list beside a reading pane. */
export function InboxBlock() {
  const [active, setActive] = useState('1')
  const current = MAIL.find((m) => m.id === active) ?? MAIL[0]!

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>
      <Card variant="flush">
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 320px) minmax(0, 1fr)', minHeight: 520 }}>
          <div style={{ borderRight: '1px solid rgba(201,168,255,0.3)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: 20 }}>
              <Row justify="between">
                <Heading level={3}>Inbox</Heading>
                <Badge tone="pink">2 unread</Badge>
              </Row>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 12px 12px' }}>
              {MAIL.map((m) => (
                <RowCard key={m.id} onClick={() => setActive(m.id)} selected={m.id === active}>
                  <Row gap={3} wrap={false}>
                    <Avatar fallback={m.from.slice(0, 2)} tone={m.tone} />
                    <Stack gap={1}>
                      <Row gap={2} wrap={false}>
                        <Text truncate>{m.from}</Text>
                        {m.unread && <Dot tone="pink" />}
                      </Row>
                      <Text size="sm" truncate>{m.subject}</Text>
                    </Stack>
                    <Spacer />
                    <Text size="sm" muted>{m.time}</Text>
                  </Row>
                </RowCard>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <div style={{ padding: 20, borderBottom: '1px solid rgba(201,168,255,0.3)' }}>
              <Row justify="between">
                <Heading level={3}>{current.subject}</Heading>
                <Row gap={2} wrap={false}>
                  <Button size="sm" variant="quiet" label="Archive"><Icon name="ok" size="sm" /></Button>
                  <Button size="sm" variant="quiet" label="Delete"><Icon name="remove" size="sm" /></Button>
                </Row>
              </Row>
            </div>
            <div style={{ padding: 20, flex: 1 }}>
              <Stack gap={4}>
                <Row gap={3} wrap={false}>
                  <Avatar fallback={current.from.slice(0, 2)} tone={current.tone} />
                  <Stack gap={1}>
                    <Text>{current.from}</Text>
                    <Text size="sm" muted>to me · {current.time}</Text>
                  </Stack>
                </Row>
                <Text>{current.preview}</Text>
                <Text muted>Let me know what you think — happy to walk through it on a call.</Text>
                <Row gap={2}>
                  <Button label="Reply"><Icon name="rewind" size="sm" /> Reply</Button>
                  <Button variant="quiet" label="Forward"><Icon name="forward" size="sm" /> Forward</Button>
                </Row>
              </Stack>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
