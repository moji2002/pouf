import { useState } from 'react'
import { Card, RowCard } from '../surface'
import { Stack, Row, Spacer } from '../layout'
import { Heading, Text } from '../text'
import { Avatar } from '../avatar'
import { Dot, Badge } from '../media'
import { Input } from '../Input'
import { Button } from '../Button'
import { Icon } from '../Icon'

interface Message {
  id: string
  from: 'me' | 'them'
  text: string
  time: string
}

const CONVOS = [
  { id: 'maya', name: 'Maya B.', last: 'depth is the whole personality', tone: 'mint' as const, unread: 0, online: true },
  { id: 'grace', name: 'Grace H.', last: 'zero visual drift, love it', tone: 'blue' as const, unread: 2, online: true },
  { id: 'kat', name: 'Katherine J.', last: 'sent the optical-centering note', tone: 'pink' as const, unread: 0, online: false },
  { id: 'alan', name: 'Alan T.', last: 'variants over classNames, always', tone: 'purple' as const, unread: 0, online: false },
]

const SEED: Message[] = [
  { id: '1', from: 'them', text: 'hey! did you try the new cushion buttons?', time: '9:41' },
  { id: '2', from: 'me', text: 'yes — they literally press in. so satisfying', time: '9:42' },
  { id: '3', from: 'them', text: 'right?? depth is the whole personality', time: '9:42' },
  { id: '4', from: 'me', text: 'shipping the dashboard with them today', time: '9:44' },
]

/** An example chat screen: a conversation list beside a live thread with a
 * composer. Two panes of Pouf primitives plus a little layout glue. */
export function ChatBlock() {
  const [messages, setMessages] = useState(SEED)
  const [draft, setDraft] = useState('')
  const [active, setActive] = useState('maya')

  function send() {
    const text = draft.trim()
    if (!text) return
    setMessages((m) => [...m, { id: String(m.length + 1), from: 'me', text, time: '9:45' }])
    setDraft('')
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <Card variant="flush">
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 280px) minmax(0, 1fr)', minHeight: 520 }}>
          {/* Conversation list */}
          <div style={{ borderRight: '1px solid rgba(201,168,255,0.3)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: 20 }}>
              <Row justify="between">
                <Heading level={3}>Messages</Heading>
                <Badge tone="pink">2 new</Badge>
              </Row>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 12px 12px' }}>
              {CONVOS.map((c) => (
                <RowCard key={c.id} onClick={() => setActive(c.id)} selected={c.id === active}>
                  <Row gap={3} wrap={false}>
                    <Avatar fallback={c.name.slice(0, 2)} tone={c.tone} />
                    <Stack gap={1}>
                      <Row gap={2} wrap={false}>
                        <Text truncate>{c.name}</Text>
                        {c.online && <Dot tone="mint" />}
                      </Row>
                      <Text size="sm" muted truncate>{c.last}</Text>
                    </Stack>
                    <Spacer />
                    {c.unread > 0 && <Badge tone="purple">{c.unread}</Badge>}
                  </Row>
                </RowCard>
              ))}
            </div>
          </div>

          {/* Active thread */}
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <div style={{ padding: 20, borderBottom: '1px solid rgba(201,168,255,0.3)' }}>
              <Row gap={3} wrap={false}>
                <Avatar fallback="MB" tone="mint" />
                <Stack gap={1}>
                  <Heading level={3}>Maya B.</Heading>
                  <Row gap={2} wrap={false}><Dot tone="mint" /><Text size="sm" muted>Online</Text></Row>
                </Stack>
                <Spacer />
                <Button variant="quiet" size="sm" label="Call"><Icon name="alerts" size="sm" /></Button>
              </Row>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 20, flex: 1, minHeight: 260, maxHeight: 340, overflowY: 'auto' }}>
              <Row justify="center"><Badge tone="blue">Today</Badge></Row>
              {messages.map((m) => (
                <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: m.from === 'me' ? 'flex-end' : 'flex-start', gap: 4 }}>
                  <div
                    style={{
                      maxWidth: '78%',
                      padding: '12px 16px',
                      borderRadius: 20,
                      fontWeight: 700,
                      color: 'var(--ink)',
                      background: m.from === 'me' ? 'var(--purple)' : 'var(--surface)',
                      boxShadow: m.from === 'me' ? 'var(--pouf-control)' : 'var(--pouf-row)',
                    }}
                  >
                    {m.text}
                  </div>
                  <Text size="sm" muted>{m.time}</Text>
                </div>
              ))}
            </div>

            <div style={{ padding: 16, borderTop: '1px solid rgba(201,168,255,0.3)' }}>
              <Row gap={2} wrap={false}>
                <Button variant="quiet" size="sm" label="Attach"><Icon name="add" size="sm" /></Button>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Input value={draft} onChange={setDraft} placeholder="Message Maya…" label="Message" />
                </div>
                <Button onClick={send} label="Send"><Icon name="send" size="sm" /></Button>
              </Row>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
