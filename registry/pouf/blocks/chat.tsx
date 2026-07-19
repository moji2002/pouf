import { useState } from 'react'
import { Card } from '../surface'
import { Stack, Row, Spacer } from '../layout'
import { Heading, Text } from '../text'
import { Avatar } from '../avatar'
import { Dot } from '../media'
import { Input } from '../Input'
import { Button } from '../Button'

interface Message {
  id: string
  from: 'me' | 'them'
  text: string
}

const SEED: Message[] = [
  { id: '1', from: 'them', text: 'hey! did you try the new cushion buttons?' },
  { id: '2', from: 'me', text: 'yes — they literally press in. so satisfying' },
  { id: '3', from: 'them', text: 'right?? depth is the whole personality' },
  { id: '4', from: 'me', text: 'shipping the dashboard with them today 🎉' },
]

/** An example chat screen: a conversation header, a scrolling message list with
 * sent/received bubbles, and a composer — all Pouf primitives plus a little
 * layout glue. Wire `send` to your transport. */
export function ChatBlock() {
  const [messages, setMessages] = useState(SEED)
  const [draft, setDraft] = useState('')

  function send() {
    const text = draft.trim()
    if (!text) return
    setMessages((m) => [...m, { id: String(m.length + 1), from: 'me', text }])
    setDraft('')
  }

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: 24 }}>
      <Card variant="flush">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: 20, borderBottom: '1px solid rgba(201,168,255,0.3)' }}>
            <Row gap={3} wrap={false}>
              <Avatar fallback="MB" tone="mint" />
              <Stack gap={1}>
                <Heading level={3}>Maya B.</Heading>
                <Row gap={2} wrap={false}>
                  <Dot tone="mint" />
                  <Text size="sm" muted>Online</Text>
                </Row>
              </Stack>
            </Row>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 20, minHeight: 320, maxHeight: 420, overflowY: 'auto' }}>
            {messages.map((m) => (
              <div key={m.id} style={{ display: 'flex', justifyContent: m.from === 'me' ? 'flex-end' : 'flex-start' }}>
                <div
                  style={{
                    maxWidth: '75%',
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
              </div>
            ))}
          </div>

          <div style={{ padding: 16, borderTop: '1px solid rgba(201,168,255,0.3)' }}>
            <Row gap={2} wrap={false}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Input value={draft} onChange={setDraft} placeholder="Message…" label="Message" />
              </div>
              <Spacer />
              <Button onClick={send} label="Send">Send</Button>
            </Row>
          </div>
        </div>
      </Card>
    </div>
  )
}
