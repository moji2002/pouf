import { useState } from 'react'
import clsx from 'clsx'
import { Card, RowCard } from '../surface'
import { Shell, Sidebar, Stack, Row, Spacer } from '../layout'
import { Heading, Text, Eyebrow } from '../text'
import { Avatar } from '../avatar'
import { Dot, Badge, Blob } from '../media'
import { Input } from '../Input'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { NavLink } from '../NavLink'
import { BottomNav, type NavItem } from '../BottomNav'

const NAV: NavItem[] = [
  { href: '/', label: 'Overview', icon: 'overview', tone: 'purple' },
  { href: '/inbox', label: 'Inbox', icon: 'mail', tone: 'blue' },
  { href: '/board', label: 'Board', icon: 'log', tone: 'mint' },
  { href: '/messages', label: 'Messages', icon: 'comment', tone: 'pink' },
  { href: '/settings', label: 'Settings', icon: 'settings', tone: 'orange' },
]

const HERE = '/messages'

interface Message {
  id: string
  from: 'me' | 'them'
  text: string
  time: string
}

interface Convo {
  id: string
  name: string
  tone: 'purple' | 'pink' | 'blue' | 'mint'
  online: boolean
  unread: number
}

const CONVOS: Convo[] = [
  { id: 'maya', name: 'Maya B.', tone: 'mint', online: true, unread: 0 },
  { id: 'grace', name: 'Grace H.', tone: 'blue', online: true, unread: 2 },
  { id: 'kat', name: 'Katherine J.', tone: 'pink', online: false, unread: 0 },
  { id: 'alan', name: 'Alan T.', tone: 'purple', online: false, unread: 0 },
]

/* One thread per conversation. The previous version kept a single flat message
 * list and a hardcoded "Maya B." header, so picking another person in the list
 * showed you Maya's messages under their name. */
const SEED: Record<string, Message[]> = {
  maya: [
    { id: 'm1', from: 'them', text: 'hey! did you try the new cushion buttons?', time: '9:41' },
    { id: 'm2', from: 'me', text: 'yes — they literally press in. so satisfying', time: '9:42' },
    { id: 'm3', from: 'them', text: 'right?? depth is the whole personality', time: '9:42' },
    { id: 'm4', from: 'me', text: 'shipping the dashboard with them today', time: '9:44' },
  ],
  grace: [
    { id: 'g1', from: 'them', text: 'migration finished — zero visual drift', time: '8:10' },
    { id: 'g2', from: 'them', text: 'across 2,700 lines. the gate paid for itself', time: '8:12' },
  ],
  kat: [
    { id: 'k1', from: 'them', text: 'sent the optical-centering note', time: 'Tue' },
    { id: 'k2', from: 'me', text: 'read it twice. the glyph offset finally makes sense', time: 'Tue' },
  ],
  alan: [
    { id: 'a1', from: 'them', text: 'variants over classNames, always', time: 'Mon' },
  ],
}

const PANES =
  'grid [grid-template-columns:minmax(0,280px)_minmax(0,1fr)] min-h-[520px] max-[900px]:[grid-template-columns:minmax(0,1fr)]'

/** An example chat screen: app shell, a conversation list that actually
 * switches threads, message bubbles, and a working composer. Below 900px the
 * list and thread take turns rather than splitting a phone in half. */
export function ChatBlock() {
  const [threads, setThreads] = useState<Record<string, Message[]>>(SEED)
  const [draft, setDraft] = useState('')
  const [active, setActive] = useState('maya')
  const [read, setRead] = useState<string[]>([])
  const [pane, setPane] = useState<'list' | 'detail'>('list')

  const convo = CONVOS.find((c) => c.id === active) ?? CONVOS[0]!
  const messages = threads[active] ?? []
  const unreadTotal = CONVOS.filter((c) => !read.includes(c.id)).reduce((n, c) => n + c.unread, 0)

  function open(id: string) {
    setActive(id)
    setRead((r) => (r.includes(id) ? r : [...r, id]))
    setDraft('')
    setPane('detail')
  }

  function send() {
    const text = draft.trim()
    if (!text) return
    setThreads((t) => ({
      ...t,
      [active]: [
        ...(t[active] ?? []),
        { id: `${active}-${(t[active]?.length ?? 0) + 1}`, from: 'me', text, time: 'now' },
      ],
    }))
    setDraft('')
  }

  return (
    <>
      <Shell>
        <Sidebar>
          <Row gap={2} wrap={false}>
            <Blob icon="target" tone="purple" size="sm" />
            <Heading level={3}>Acme</Heading>
          </Row>
          {NAV.map((item) => (
            <NavLink key={item.href} href={item.href} currentPath={HERE} icon={item.icon} tone={item.tone}>
              {item.label}
            </NavLink>
          ))}
        </Sidebar>

        <Stack gap={5}>
          <Row justify="between">
            <Stack gap={1}>
              <Eyebrow>Team</Eyebrow>
              <Heading level={1}>Messages</Heading>
            </Stack>
            {unreadTotal > 0 && <Badge tone="pink">{unreadTotal} new</Badge>}
          </Row>

          <Card variant="flush">
            <div className={PANES}>
              {/* Conversation list */}
              <div
                className={clsx(
                  'flex flex-col [border-right:1px_solid_rgba(201,168,255,0.3)]',
                  'max-[900px]:[border-right:none]',
                  pane === 'detail' && 'max-[900px]:hidden',
                )}
              >
                <div className="flex flex-col gap-(--s2) p-(--s3)">
                  {CONVOS.map((c) => {
                    const thread = threads[c.id] ?? []
                    const last = thread[thread.length - 1]
                    const unread = read.includes(c.id) ? 0 : c.unread
                    return (
                      <RowCard key={c.id} onClick={() => open(c.id)} selected={c.id === active}>
                        <Row gap={3} wrap={false}>
                          <Avatar fallback={c.name.slice(0, 2)} tone={c.tone} />
                          <Stack gap={1}>
                            <Row gap={2} wrap={false}>
                              <Text truncate>{c.name}</Text>
                              {c.online && <Dot tone="mint" />}
                            </Row>
                            <Text size="sm" muted truncate>{last?.text ?? 'No messages yet'}</Text>
                          </Stack>
                          <Spacer />
                          {unread > 0 && <Badge tone="purple">{unread}</Badge>}
                        </Row>
                      </RowCard>
                    )
                  })}
                </div>
              </div>

              {/* Active thread */}
              <div
                className={clsx(
                  'flex flex-col min-w-0',
                  pane === 'list' && 'max-[900px]:hidden',
                )}
              >
                <div className="p-(--s5) [border-bottom:1px_solid_rgba(201,168,255,0.3)]">
                  <Row gap={3} wrap={false}>
                    <span className="hidden max-[900px]:inline-flex">
                      <Button size="sm" variant="quiet" onClick={() => setPane('list')} label="Back to conversations">
                        <Icon name="prev" size="sm" />
                      </Button>
                    </span>
                    <Avatar fallback={convo.name.slice(0, 2)} tone={convo.tone} />
                    <Stack gap={1}>
                      <Heading level={3}>{convo.name}</Heading>
                      <Row gap={2} wrap={false}>
                        <Dot tone={convo.online ? 'mint' : 'purple'} />
                        <Text size="sm" muted>{convo.online ? 'Online' : 'Offline'}</Text>
                      </Row>
                    </Stack>
                    <Spacer />
                    <Button variant="quiet" size="sm" label="Call"><Icon name="alerts" size="sm" /></Button>
                  </Row>
                </div>

                <div className="flex flex-col gap-(--s3) p-(--s5) flex-1 min-h-[260px] max-h-[340px] overflow-y-auto">
                  <Row justify="center"><Badge tone="blue">Today</Badge></Row>
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={clsx(
                        'flex flex-col gap-1',
                        m.from === 'me' ? 'items-end' : 'items-start',
                      )}
                    >
                      <div
                        className={clsx(
                          'max-w-[78%] px-4 py-3 rounded-[20px] font-bold text-ink',
                          m.from === 'me'
                            ? 'bg-purple [box-shadow:var(--pouf-control)]'
                            : 'bg-surface [box-shadow:var(--pouf-row)]',
                        )}
                      >
                        {m.text}
                      </div>
                      <Text size="sm" muted>{m.time}</Text>
                    </div>
                  ))}
                </div>

                <div className="p-(--s4) [border-top:1px_solid_rgba(201,168,255,0.3)]">
                  <Row gap={2} wrap={false}>
                    <Button variant="quiet" size="sm" label="Attach"><Icon name="add" size="sm" /></Button>
                    <div className="flex-1 min-w-0">
                      <Input
                        value={draft}
                        onChange={setDraft}
                        placeholder={`Message ${convo.name}…`}
                        label={`Message ${convo.name}`}
                      />
                    </div>
                    <Button onClick={send} disabled={!draft.trim()} label="Send">
                      <Icon name="send" size="sm" />
                    </Button>
                  </Row>
                </div>
              </div>
            </div>
          </Card>
          <Spacer />
        </Stack>
      </Shell>
      <BottomNav primary={NAV.slice(0, 4)} groups={[{ title: 'App', items: NAV }]} currentPath={HERE} />
    </>
  )
}
