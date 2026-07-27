import { useState } from 'react'
import { Avatar } from '../avatar'
import { BottomNav, type NavItem } from '../BottomNav'
import { Button } from '../Button'
import { Select } from '../controls'
import { Empty } from '../feedback'
import { Field, Input, Textarea } from '../Input'
import { Row, Shell, Sidebar, Stack } from '../layout'
import { Badge, Blob } from '../media'
import { NavLink } from '../NavLink'
import { Segmented } from '../Segmented'
import { Card, RowCard } from '../surface'
import { Eyebrow, Heading, Text } from '../text'

type Stage = 'lead' | 'active' | 'at-risk'
type StageFilter = 'all' | Stage

interface Customer {
  id: string
  name: string
  company: string
  email: string
  value: number
  stage: Stage
  owner: string
  tone: 'purple' | 'pink' | 'blue' | 'mint'
}

const CUSTOMERS: Customer[] = [
  { id: 'ada', name: 'Ada Lovelace', company: 'Analytical', email: 'ada@example.com', value: 18400, stage: 'active', owner: 'Maya', tone: 'purple' },
  { id: 'grace', name: 'Grace Hopper', company: 'Compiler Co.', email: 'grace@example.com', value: 9200, stage: 'lead', owner: 'Noah', tone: 'blue' },
  { id: 'katherine', name: 'Katherine Johnson', company: 'Orbital', email: 'kj@example.com', value: 24600, stage: 'active', owner: 'Maya', tone: 'mint' },
  { id: 'alan', name: 'Alan Turing', company: 'Bombe Labs', email: 'alan@example.com', value: 7800, stage: 'at-risk', owner: 'Iris', tone: 'pink' },
]

const NAV: NavItem[] = [
  { href: '/crm', label: 'Customers', icon: 'users', tone: 'purple' },
  { href: '/crm/pipeline', label: 'Pipeline', icon: 'log', tone: 'mint' },
  { href: '/crm/activity', label: 'Activity', icon: 'activity', tone: 'blue' },
  { href: '/crm/reports', label: 'Reports', icon: 'chart', tone: 'yellow' },
  { href: '/crm/settings', label: 'Settings', icon: 'settings', tone: 'orange' },
]

const STAGE_TONE = { lead: 'blue', active: 'mint', 'at-risk': 'pink' } as const
const STAGES = [
  { value: 'lead', label: 'Lead' },
  { value: 'active', label: 'Active' },
  { value: 'at-risk', label: 'At risk' },
]
const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

/** A complete customer workspace with filtering, responsive master/detail,
 * editable stages, and notes that persist while the screen is mounted. */
export function CrmBlock() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<StageFilter>('all')
  const [activeId, setActiveId] = useState(CUSTOMERS[0]!.id)
  const [pane, setPane] = useState<'list' | 'detail'>('list')
  const [stages, setStages] = useState<Record<string, Stage>>(
    Object.fromEntries(CUSTOMERS.map((customer) => [customer.id, customer.stage])),
  )
  const [draft, setDraft] = useState('')
  const [notes, setNotes] = useState<Record<string, string[]>>({})

  const customers = CUSTOMERS.filter((customer) => {
    const stage = stages[customer.id]!
    const matchesFilter = filter === 'all' || stage === filter
    const haystack = `${customer.name} ${customer.company} ${customer.email}`.toLowerCase()
    return matchesFilter && haystack.includes(query.toLowerCase())
  })
  const active = CUSTOMERS.find((customer) => customer.id === activeId) ?? CUSTOMERS[0]!

  const open = (id: string) => {
    setActiveId(id)
    setPane('detail')
    setDraft('')
  }

  const addNote = () => {
    const note = draft.trim()
    if (!note) return
    setNotes((current) => ({ ...current, [active.id]: [...(current[active.id] ?? []), note] }))
    setDraft('')
  }

  return (
    <>
      <Shell>
        <Sidebar mobile="hide">
          <Row gap={2} wrap={false}>
            <Blob icon="users" tone="purple" size="sm" />
            <Heading level={3}>Orbit CRM</Heading>
          </Row>
          {NAV.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              currentPath="/crm"
              icon={item.icon}
              tone={item.tone}
            >
              {item.label}
            </NavLink>
          ))}
        </Sidebar>

        <Stack gap={5}>
          <Row justify="between" align="top">
            <Stack gap={1}>
              <Eyebrow>Customers</Eyebrow>
              <Heading level={1}>Keep every relationship warm.</Heading>
            </Stack>
            <Button size="sm">Add customer</Button>
          </Row>

          <div className="grid [grid-template-columns:minmax(0,360px)_minmax(0,1fr)] gap-(--s4) min-h-[620px] max-[900px]:[grid-template-columns:minmax(0,1fr)]">
            <div className={pane === 'detail' ? 'max-[900px]:hidden' : ''}>
              <Card>
                <Stack gap={4}>
                  <Field label="Search">
                    {(id, describedBy) => (
                      <Input
                        id={id}
                        name="customer-search"
                        value={query}
                        onChange={setQuery}
                        describedBy={describedBy}
                        label="Search customers"
                        autoComplete="off"
                        spellCheck={false}
                        placeholder="Name, company, or email…"
                      />
                    )}
                  </Field>
                  <Segmented
                    label="Filter customers"
                    value={filter}
                    onChange={setFilter}
                    options={[
                      { value: 'all', label: 'All' },
                      { value: 'active', label: 'Active' },
                      { value: 'lead', label: 'Leads' },
                      { value: 'at-risk', label: 'At risk' },
                    ]}
                  />
                  <Stack gap={2}>
                    {customers.length === 0 ? (
                      <Empty icon="search" title="No customers found">
                        Try a broader search or another stage.
                      </Empty>
                    ) : customers.map((customer) => (
                      <RowCard
                        key={customer.id}
                        selected={customer.id === activeId}
                        onClick={() => open(customer.id)}
                      >
                        <Row gap={3} wrap={false}>
                          <Avatar fallback={customer.name.slice(0, 2)} tone={customer.tone} size="sm" />
                          <Stack gap={1}>
                            <Text truncate>{customer.name}</Text>
                            <Text size="sm" muted truncate>{customer.company}</Text>
                          </Stack>
                        </Row>
                      </RowCard>
                    ))}
                  </Stack>
                </Stack>
              </Card>
            </div>

            <div className={pane === 'list' ? 'max-[900px]:hidden' : ''}>
              <Card>
                <Stack gap={5}>
                  <Row justify="between" align="top">
                    <Row gap={3} wrap={false} align="top">
                      <Avatar fallback={active.name.slice(0, 2)} tone={active.tone} size="lg" />
                      <Stack gap={1}>
                        <Heading level={2}>{active.name}</Heading>
                        <Text muted>{active.company}</Text>
                        <Badge tone={STAGE_TONE[stages[active.id]!]}>{stages[active.id]}</Badge>
                      </Stack>
                    </Row>
                    <Button size="sm" variant="quiet" onClick={() => setPane('list')}>
                      Back to customers
                    </Button>
                  </Row>

                  <div className="grid grid-cols-3 gap-(--s3) max-[700px]:grid-cols-1">
                    <Card variant="tight">
                      <Stack gap={1}><Text size="sm" muted>Account value</Text><Heading level={3}>{money.format(active.value)}</Heading></Stack>
                    </Card>
                    <Card variant="tight">
                      <Stack gap={1}><Text size="sm" muted>Owner</Text><Heading level={3}>{active.owner}</Heading></Stack>
                    </Card>
                    <Card variant="tight">
                      <Stack gap={1}><Text size="sm" muted>Email</Text><Text>{active.email}</Text></Stack>
                    </Card>
                  </div>

                  <Field label="Lifecycle stage">
                    {(id, describedBy) => (
                      <Select
                        id={id}
                        value={stages[active.id]!}
                        onChange={(value) => setStages((current) => ({ ...current, [active.id]: value as Stage }))}
                        options={STAGES}
                        describedBy={describedBy}
                      />
                    )}
                  </Field>

                  <Stack gap={3}>
                    <Heading level={3}>Notes</Heading>
                    {(notes[active.id] ?? []).map((note, index) => (
                      <Card key={`${active.id}-${index}`} variant="tight">
                        <Text>{note}</Text>
                      </Card>
                    ))}
                    <Field label="Add a note">
                      {(id, describedBy) => (
                        <Textarea
                          id={id}
                          name="customer-note"
                          value={draft}
                          onChange={setDraft}
                          describedBy={describedBy}
                          autoComplete="off"
                          placeholder="Capture the next step…"
                          rows={3}
                        />
                      )}
                    </Field>
                    <Row justify="end">
                      <Button size="sm" onClick={addNote} disabled={!draft.trim()}>Save note</Button>
                    </Row>
                  </Stack>
                </Stack>
              </Card>
            </div>
          </div>
        </Stack>
      </Shell>
      <BottomNav primary={NAV.slice(0, 4)} groups={[{ title: 'CRM', items: NAV }]} currentPath="/crm" />
    </>
  )
}
