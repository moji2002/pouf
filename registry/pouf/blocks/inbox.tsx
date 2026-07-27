import { useMemo, useState } from 'react'
import clsx from 'clsx'
import { Card, RowCard } from '../surface'
import { Shell, Sidebar, Stack, Row, Spacer } from '../layout'
import { Heading, Text, Eyebrow } from '../text'
import { Avatar } from '../avatar'
import { Badge, Blob, Dot } from '../media'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { Input, Textarea } from '../Input'
import { Empty } from '../feedback'
import { NavLink } from '../NavLink'
import { BottomNav, type NavItem } from '../BottomNav'

const NAV: NavItem[] = [
  { href: '/', label: 'Overview', icon: 'overview', tone: 'purple' },
  { href: '/inbox', label: 'Inbox', icon: 'mail', tone: 'blue' },
  { href: '/board', label: 'Board', icon: 'log', tone: 'mint' },
  { href: '/messages', label: 'Messages', icon: 'comment', tone: 'pink' },
  { href: '/settings', label: 'Settings', icon: 'settings', tone: 'orange' },
]

const HERE = '/inbox'

interface Mail {
  id: string
  from: string
  subject: string
  preview: string
  body: string
  time: string
  tone: 'purple' | 'pink' | 'blue' | 'mint'
  unread: boolean
}

const MAIL: Mail[] = [
  { id: '1', from: 'Maya Bloom', subject: 'The cushion buttons shipped', preview: 'Just merged — depth really does sell it.', body: 'Just merged — depth really does sell it. Take a look when you get a sec.', time: '9:41', tone: 'mint', unread: true },
  { id: '2', from: 'Grace Hopper', subject: 'Migration is green', preview: 'Zero visual drift across 2,700 lines.', body: 'Zero visual drift across 2,700 lines. The snapshot gate paid off.', time: '8:12', tone: 'blue', unread: true },
  { id: '3', from: 'Katherine J.', subject: 'Optical centering notes', preview: 'Attached the write-up.', body: 'Attached the write-up on why a centered glyph looks low on a cushion.', time: 'Yesterday', tone: 'pink', unread: false },
  { id: '4', from: 'Alan Turing', subject: 'Variants over classNames', preview: 'A short argument for the strict API.', body: 'A short argument for why the strict API keeps everything on-system.', time: 'Yesterday', tone: 'purple', unread: false },
]

const PANES =
  'grid [grid-template-columns:minmax(0,320px)_minmax(0,1fr)] min-h-[520px] max-[900px]:[grid-template-columns:minmax(0,1fr)]'

/** An example email inbox: app shell, a mail list you can actually search, and
 * a reading pane that replies. Below 900px the two panes become one — the list,
 * then the message — because side-by-side at phone width reads neither. */
export function InboxBlock() {
  const [active, setActive] = useState('1')
  const [query, setQuery] = useState('')
  const [read, setRead] = useState<string[]>([])
  const [replying, setReplying] = useState(false)
  const [draft, setDraft] = useState('')
  const [sent, setSent] = useState<string[]>([])
  /* Only consulted below 900px, where exactly one pane shows at a time. Above
   * it both panes are always visible and this is inert. */
  const [pane, setPane] = useState<'list' | 'detail'>('list')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return MAIL
    return MAIL.filter((m) =>
      `${m.from} ${m.subject} ${m.body}`.toLowerCase().includes(q),
    )
  }, [query])

  const current = MAIL.find((m) => m.id === active) ?? MAIL[0]!
  const unreadCount = MAIL.filter((m) => m.unread && !read.includes(m.id)).length

  function open(id: string) {
    setActive(id)
    setRead((r) => (r.includes(id) ? r : [...r, id]))
    setReplying(false)
    setDraft('')
    setPane('detail')
  }

  function send() {
    if (!draft.trim()) return
    setSent((s) => [...s, draft.trim()])
    setDraft('')
    setReplying(false)
  }

  return (
    <>
      <Shell>
        <Sidebar mobile="hide">
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
              <Eyebrow>Mail</Eyebrow>
              <Heading level={1}>Inbox</Heading>
            </Stack>
            {unreadCount > 0 && <Badge tone="pink">{unreadCount} unread</Badge>}
          </Row>

          <Card variant="flush">
            <div className={PANES}>
              {/* List pane */}
              <div
                className={clsx(
                  'flex flex-col [border-right:1px_solid_rgba(201,168,255,0.3)]',
                  'max-[900px]:[border-right:none]',
                  pane === 'detail' && 'max-[900px]:hidden',
                )}
              >
                <div className="p-(--s5) pb-(--s3)">
                  <Input
                    value={query}
                    onChange={setQuery}
                    placeholder="Search mail…"
                    label="Search mail"
                  />
                </div>
                <div className="flex flex-col gap-(--s2) px-(--s3) pb-(--s3)">
                  {results.length === 0 ? (
                    <div className="p-(--s4)">
                      <Empty icon="search" title="No matches">
                        <Text size="sm" muted>Nothing here matches “{query}”.</Text>
                      </Empty>
                    </div>
                  ) : (
                    results.map((m) => (
                      <RowCard key={m.id} onClick={() => open(m.id)} selected={m.id === active}>
                        <Row gap={3} wrap={false}>
                          <Avatar fallback={m.from.slice(0, 2)} tone={m.tone} />
                          <Stack gap={1}>
                            <Row gap={2} wrap={false}>
                              <Text truncate>{m.from}</Text>
                              {m.unread && !read.includes(m.id) && <Dot tone="pink" />}
                            </Row>
                            <Text size="sm" truncate>{m.subject}</Text>
                          </Stack>
                          <Spacer />
                          <Text size="sm" muted>{m.time}</Text>
                        </Row>
                      </RowCard>
                    ))
                  )}
                </div>
              </div>

              {/* Reading pane */}
              <div
                className={clsx(
                  'flex flex-col min-w-0',
                  pane === 'list' && 'max-[900px]:hidden',
                )}
              >
                <div className="p-(--s5) [border-bottom:1px_solid_rgba(201,168,255,0.3)]">
                  <Row justify="between">
                    <Row gap={2} wrap={false}>
                      {/* Phone-only: the list is gone, so this is the way back. */}
                      <span className="hidden max-[900px]:inline-flex">
                        <Button size="sm" variant="quiet" onClick={() => setPane('list')} label="Back to list">
                          <Icon name="prev" size="sm" />
                        </Button>
                      </span>
                      <Heading level={3}>{current.subject}</Heading>
                    </Row>
                    <Row gap={2} wrap={false}>
                      <Button size="sm" variant="quiet" label="Archive"><Icon name="ok" size="sm" /></Button>
                      <Button size="sm" variant="quiet" label="Delete"><Icon name="remove" size="sm" /></Button>
                    </Row>
                  </Row>
                </div>
                <div className="p-(--s5) flex-1">
                  <Stack gap={4}>
                    <Row gap={3} wrap={false}>
                      <Avatar fallback={current.from.slice(0, 2)} tone={current.tone} />
                      <Stack gap={1}>
                        <Text>{current.from}</Text>
                        <Text size="sm" muted>to me · {current.time}</Text>
                      </Stack>
                    </Row>
                    <Text>{current.body}</Text>
                    <Text muted>Let me know what you think — happy to walk through it on a call.</Text>

                    {sent.map((s, i) => (
                      <div key={i} className="[border-left:3px_solid_var(--mint)] pl-(--s4)">
                        <Stack gap={1}>
                          <Text size="sm" muted>You replied</Text>
                          <Text>{s}</Text>
                        </Stack>
                      </div>
                    ))}

                    {replying ? (
                      <Stack gap={3}>
                        <Textarea
                          value={draft}
                          onChange={setDraft}
                          placeholder={`Reply to ${current.from}…`}
                          label="Your reply"
                        />
                        <Row gap={2}>
                          <Button onClick={send} tone="mint" label="Send reply">
                            <Icon name="send" size="sm" /> Send
                          </Button>
                          <Button variant="quiet" onClick={() => { setReplying(false); setDraft('') }}>
                            Cancel
                          </Button>
                        </Row>
                      </Stack>
                    ) : (
                      <Row gap={2}>
                        <Button onClick={() => setReplying(true)} label="Reply">
                          <Icon name="rewind" size="sm" /> Reply
                        </Button>
                        <Button variant="quiet" label="Forward">
                          <Icon name="forward" size="sm" /> Forward
                        </Button>
                      </Row>
                    )}
                  </Stack>
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
