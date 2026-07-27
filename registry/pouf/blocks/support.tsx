import { useMemo, useState } from 'react'
import clsx from 'clsx'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { Card, RowCard } from '../surface'
import { Shell, Sidebar, Stack, Row, Spacer } from '../layout'
import { Heading, Text, Eyebrow } from '../text'
import { Avatar } from '../avatar'
import { Badge, Blob, Dot } from '../media'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { Field, Input, Textarea } from '../Input'
import { Select } from '../controls'
import { Empty } from '../feedback'
import { NavLink } from '../NavLink'
import { BottomNav, type NavItem } from '../BottomNav'

type TicketStatus = 'open' | 'waiting' | 'solved'
type StatusFilter = 'all' | TicketStatus

interface Ticket {
  id: string
  customer: string
  initials: string
  subject: string
  preview: string
  body: string
  time: string
  status: TicketStatus
  priority: 'normal' | 'urgent'
  tone: 'purple' | 'pink' | 'blue' | 'mint'
}

interface Filters {
  query: string
  status: StatusFilter
}

interface ReplyForm {
  reply: string
}

const NAV: NavItem[] = [
  { href: '/support', label: 'Queue', icon: 'mail', tone: 'purple' },
  { href: '/support/customers', label: 'Customers', icon: 'users', tone: 'blue' },
  { href: '/support/insights', label: 'Insights', icon: 'chart', tone: 'mint' },
  { href: '/support/saved', label: 'Saved replies', icon: 'comment', tone: 'pink' },
  { href: '/support/settings', label: 'Settings', icon: 'settings', tone: 'orange' },
]

const HERE = '/support'

const TICKETS: Ticket[] = [
  {
    id: '1048',
    customer: 'Maya Bloom',
    initials: 'MB',
    subject: 'Can I change the shipping address?',
    preview: 'The order is still marked as processing.',
    body: 'I placed order #L-2048 this morning and noticed my old office is still the delivery address. The order is still marked as processing—can it be updated?',
    time: '4m',
    status: 'open',
    priority: 'urgent',
    tone: 'pink',
  },
  {
    id: '1047',
    customer: 'Alan Turing',
    initials: 'AT',
    subject: 'Focus timer stopped chiming',
    preview: 'The light works, but there is no sound.',
    body: 'My focus timer still counts down and the light flashes, but the completion chime stopped yesterday. I have already tried a fresh battery.',
    time: '18m',
    status: 'open',
    priority: 'normal',
    tone: 'purple',
  },
  {
    id: '1046',
    customer: 'Grace Hopper',
    initials: 'GH',
    subject: 'Return label for the weekend bag',
    preview: 'I need a smaller size instead.',
    body: 'The bag is lovely, but larger than I expected. Could you send a return label? I would like to exchange it for the smaller day bag.',
    time: '1h',
    status: 'waiting',
    priority: 'normal',
    tone: 'blue',
  },
  {
    id: '1045',
    customer: 'Katherine Johnson',
    initials: 'KJ',
    subject: 'Thank you for the replacement',
    preview: 'The new carafe arrived safely.',
    body: 'The replacement carafe arrived safely today. Thank you for making the whole process so easy.',
    time: '3h',
    status: 'solved',
    priority: 'normal',
    tone: 'mint',
  },
]

const STATUS_TONE = {
  open: 'pink',
  waiting: 'yellow',
  solved: 'mint',
} as const

const PANES =
  'grid [grid-template-columns:minmax(0,360px)_minmax(0,1fr)] min-h-[620px] max-[900px]:[grid-template-columns:minmax(0,1fr)]'

/** A complete support workspace: responsive app chrome, searchable and
 * filterable queue, master/detail navigation, mutable ticket status, reply
 * validation, sent replies, empty states, and mobile back navigation. The two
 * forms use React Hook Form while the shared controls remain adapter-friendly. */
export function SupportBlock() {
  const [active, setActive] = useState('1048')
  const [statuses, setStatuses] = useState<Record<string, TicketStatus>>(
    Object.fromEntries(TICKETS.map((ticket) => [ticket.id, ticket.status])),
  )
  const [replies, setReplies] = useState<Record<string, string[]>>({})
  const [pane, setPane] = useState<'list' | 'detail'>('list')
  const [saved, setSaved] = useState(false)

  const { control: filterControl } = useForm<Filters>({
    defaultValues: { query: '', status: 'all' },
  })
  const query = useWatch({ control: filterControl, name: 'query' })
  const status = useWatch({ control: filterControl, name: 'status' })

  const {
    control: replyControl,
    handleSubmit,
    reset: resetReply,
    formState: { errors },
  } = useForm<ReplyForm>({ defaultValues: { reply: '' } })

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return TICKETS.filter((ticket) => {
      const currentStatus = statuses[ticket.id]
      const matchesStatus = status === 'all' || currentStatus === status
      const matchesQuery =
        !needle ||
        `${ticket.customer} ${ticket.subject} ${ticket.preview}`
          .toLowerCase()
          .includes(needle)
      return matchesStatus && matchesQuery
    })
  }, [query, status, statuses])

  const current = TICKETS.find((ticket) => ticket.id === active) ?? TICKETS[0]!
  const currentStatus = statuses[current.id] ?? current.status
  const openCount = Object.values(statuses).filter((value) => value === 'open').length

  function openTicket(id: string) {
    setActive(id)
    setSaved(false)
    resetReply()
    setPane('detail')
  }

  function updateStatus(next: TicketStatus) {
    setStatuses((currentStatuses) => ({ ...currentStatuses, [current.id]: next }))
    setSaved(true)
  }

  const sendReply = handleSubmit(({ reply }) => {
    const message = reply.trim()
    if (!message) return
    setReplies((currentReplies) => ({
      ...currentReplies,
      [current.id]: [...(currentReplies[current.id] ?? []), message],
    }))
    setStatuses((currentStatuses) => ({ ...currentStatuses, [current.id]: 'waiting' }))
    resetReply()
    setSaved(true)
  })

  return (
    <>
      <Shell>
        <Sidebar mobile="hide">
          <Row gap={2} wrap={false}>
            <Blob icon="comment" tone="purple" size="sm" />
            <Heading level={3}>Lumo support</Heading>
          </Row>
          <Text size="sm" muted>Customer care workspace</Text>
          {NAV.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              currentPath={HERE}
              icon={item.icon}
              tone={item.tone}
            >
              {item.label}
            </NavLink>
          ))}
          <Card variant="tight">
            <Stack gap={2}>
              <Row gap={2} wrap={false}>
                <Dot tone="mint" />
                <Text size="sm">SLA healthy</Text>
              </Row>
              <Text size="sm" muted>Median first reply: 8 minutes</Text>
            </Stack>
          </Card>
        </Sidebar>

        <Stack gap={5}>
          <Row justify="between" align="top">
            <Stack gap={1}>
              <Eyebrow>Customer care</Eyebrow>
              <Heading level={1}>Support queue</Heading>
              <Text muted>Prioritize, reply, and resolve without losing context.</Text>
            </Stack>
            <Badge tone={openCount > 0 ? 'pink' : 'mint'}>{openCount} open</Badge>
          </Row>

          <Card variant="flush">
            <div className={PANES}>
              <div
                className={clsx(
                  'flex flex-col [border-right:1px_solid_rgba(201,168,255,0.3)]',
                  'max-[900px]:[border-right:none]',
                  pane === 'detail' && 'max-[900px]:hidden',
                )}
              >
                <form
                  role="search"
                  className="flex flex-col gap-(--s3) p-(--s4) [border-bottom:1px_solid_rgba(201,168,255,0.3)]"
                  onSubmit={(event) => event.preventDefault()}
                >
                  <Field label="Search tickets">
                    {(id, describedBy) => (
                      <Controller
                        name="query"
                        control={filterControl}
                        render={({ field }) => (
                          <Input
                            ref={field.ref}
                            id={id}
                            name={field.name}
                            describedBy={describedBy}
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            placeholder="Customer, subject, or message…"
                            autoComplete="off"
                          />
                        )}
                      />
                    )}
                  </Field>
                  <Field label="Ticket status">
                    {(id, describedBy) => (
                      <Controller
                        name="status"
                        control={filterControl}
                        render={({ field }) => (
                          <Select
                            id={id}
                            describedBy={describedBy}
                            value={field.value}
                            onChange={field.onChange}
                            options={[
                              { value: 'all', label: 'All tickets' },
                              { value: 'open', label: 'Open' },
                              { value: 'waiting', label: 'Waiting on customer' },
                              { value: 'solved', label: 'Solved' },
                            ]}
                          />
                        )}
                      />
                    )}
                  </Field>
                </form>

                <div className="flex flex-col gap-(--s2) p-(--s3)" aria-live="polite">
                  {results.length === 0 ? (
                    <div className="p-(--s4)">
                      <Empty icon="search" title="No tickets found">
                        Clear a filter or try a broader search.
                      </Empty>
                    </div>
                  ) : (
                    results.map((ticket) => {
                      const ticketStatus = statuses[ticket.id] ?? ticket.status
                      return (
                        <RowCard
                          key={ticket.id}
                          onClick={() => openTicket(ticket.id)}
                          selected={ticket.id === active}
                        >
                          <Stack gap={2}>
                            <Row gap={2} wrap={false}>
                              <Avatar fallback={ticket.initials} tone={ticket.tone} size="sm" />
                              <Text truncate>{ticket.customer}</Text>
                              <Spacer />
                              <Text size="sm" muted>{ticket.time}</Text>
                            </Row>
                            <Text size="sm" truncate>{ticket.subject}</Text>
                            <Row gap={2}>
                              <Badge tone={STATUS_TONE[ticketStatus]}>{ticketStatus}</Badge>
                              {ticket.priority === 'urgent' ? <Badge tone="orange">Urgent</Badge> : null}
                            </Row>
                          </Stack>
                        </RowCard>
                      )
                    })
                  )}
                </div>
              </div>

              <div
                className={clsx(
                  'flex flex-col min-w-0',
                  pane === 'list' && 'max-[900px]:hidden',
                )}
              >
                <div className="p-(--s5) [border-bottom:1px_solid_rgba(201,168,255,0.3)]">
                  <Stack gap={3}>
                    <Row gap={3} wrap={false}>
                      <span className="hidden max-[900px]:inline-flex">
                        <Button
                          size="sm"
                          variant="quiet"
                          onClick={() => setPane('list')}
                          label="Back to queue"
                        >
                          <Icon name="prev" size="sm" />
                        </Button>
                      </span>
                      <Avatar fallback={current.initials} tone={current.tone} />
                      <Stack gap={1}>
                        <Heading level={3}>{current.subject}</Heading>
                        <Text size="sm" muted>
                          #{current.id} · {current.customer}
                        </Text>
                      </Stack>
                    </Row>
                    <Row gap={2}>
                      <Badge tone={STATUS_TONE[currentStatus]}>{currentStatus}</Badge>
                      {current.priority === 'urgent' ? <Badge tone="orange">Urgent</Badge> : null}
                      {saved ? <Badge tone="mint">Updated</Badge> : null}
                    </Row>
                  </Stack>
                </div>

                <div className="flex flex-col gap-(--s4) p-(--s5) flex-1">
                  <Card variant="tight">
                    <Stack gap={3}>
                      <Row justify="between">
                        <Row gap={2} wrap={false}>
                          <Avatar fallback={current.initials} tone={current.tone} size="sm" />
                          <Text>{current.customer}</Text>
                        </Row>
                        <Text size="sm" muted>{current.time} ago</Text>
                      </Row>
                      <Text>{current.body}</Text>
                    </Stack>
                  </Card>

                  {(replies[current.id] ?? []).map((reply, index) => (
                    <Card key={`${current.id}-${index}`} variant="tight">
                      <Stack gap={2}>
                        <Row gap={2} wrap={false}>
                          <Avatar fallback="YOU" tone="purple" size="sm" />
                          <Text>You</Text>
                          <Spacer />
                          <Badge tone="blue">Sent</Badge>
                        </Row>
                        <Text>{reply}</Text>
                      </Stack>
                    </Card>
                  ))}

                  <form onSubmit={sendReply}>
                    <Stack gap={3}>
                      <Field
                        label="Reply"
                        hint="The customer will receive this by email."
                        error={errors.reply?.message}
                      >
                        {(id, describedBy) => (
                          <Controller
                            name="reply"
                            control={replyControl}
                            rules={{
                              validate: (value) =>
                                value.trim().length >= 4 || 'Write at least four characters.',
                            }}
                            render={({ field }) => (
                              <Textarea
                                ref={field.ref}
                                id={id}
                                name={field.name}
                                describedBy={describedBy}
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value)
                                  setSaved(false)
                                }}
                                onBlur={field.onBlur}
                                placeholder={`Reply to ${current.customer}…`}
                                invalid={Boolean(errors.reply)}
                              />
                            )}
                          />
                        )}
                      </Field>
                      <Row gap={2} justify="end">
                        <Button
                          variant="quiet"
                          type="button"
                          onClick={() => {
                            resetReply()
                            setSaved(false)
                          }}
                        >
                          Clear draft
                        </Button>
                        <Button type="submit" tone="mint">
                          <Icon name="send" size="sm" />
                          Send reply
                        </Button>
                      </Row>
                    </Stack>
                  </form>
                </div>

                <div className="p-(--s4) [border-top:1px_solid_rgba(201,168,255,0.3)]">
                  <Row justify="between">
                    <Stack gap={1}>
                      <Text size="sm" muted>Ticket status</Text>
                      <Text>{currentStatus === 'solved' ? 'Conversation closed' : 'Needs attention'}</Text>
                    </Stack>
                    <Row gap={2}>
                      <Button
                        size="sm"
                        variant="quiet"
                        disabled={currentStatus === 'waiting'}
                        onClick={() => updateStatus('waiting')}
                      >
                        Set waiting
                      </Button>
                      <Button
                        size="sm"
                        tone="mint"
                        disabled={currentStatus === 'solved'}
                        onClick={() => updateStatus('solved')}
                      >
                        <Icon name="ok" size="sm" />
                        Mark solved
                      </Button>
                    </Row>
                  </Row>
                </div>
              </div>
            </div>
          </Card>
          <Spacer />
        </Stack>
      </Shell>
      <BottomNav
        primary={NAV.slice(0, 4)}
        groups={[{ title: 'Support', items: NAV }]}
        currentPath={HERE}
      />
    </>
  )
}
