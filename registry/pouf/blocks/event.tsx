import { useMemo, useState } from 'react'
import { Button } from '../Button'
import { Input, Field } from '../Input'
import { BottomNav, type NavItem } from '../BottomNav'
import { NavLink } from '../NavLink'
import { Empty } from '../feedback'
import { Avatar } from '../avatar'
import { Blob, Badge, Dot } from '../media'
import { Grid, Row, Shell, Sidebar, Stack } from '../layout'
import { Stat } from '../readout'
import { Segmented } from '../Segmented'
import { Card } from '../surface'
import { Eyebrow, Heading, Text } from '../text'

const NAV: NavItem[] = [
  { href: '/', label: 'Overview', icon: 'overview', tone: 'purple' },
  { href: '/check-in', label: 'Check-in', icon: 'ok', tone: 'mint' },
  { href: '/schedule', label: 'Schedule', icon: 'calendar', tone: 'blue' },
  { href: '/attendees', label: 'Attendees', icon: 'users', tone: 'pink' },
  { href: '/settings', label: 'Settings', icon: 'settings', tone: 'orange' },
]

const HERE = '/check-in'
const NUMBER = new Intl.NumberFormat('en-US')

type AttendanceFilter = 'all' | 'waiting' | 'checked'

interface Attendee {
  id: string
  name: string
  company: string
  ticket: 'Standard' | 'Speaker' | 'VIP'
  checkedIn: boolean
}

const INITIAL_ATTENDEES: Attendee[] = [
  { id: 'maya', name: 'Maya Bloom', company: 'Northstar', ticket: 'Speaker', checkedIn: true },
  { id: 'noah', name: 'Noah Kim', company: 'Pollen', ticket: 'Standard', checkedIn: false },
  { id: 'iris', name: 'Iris Chen', company: 'Fieldwork', ticket: 'VIP', checkedIn: false },
  { id: 'leo', name: 'Leo Martins', company: 'Common Room', ticket: 'Standard', checkedIn: true },
  { id: 'sana', name: 'Sana Ali', company: 'Tandem', ticket: 'Standard', checkedIn: false },
]

function initials(name: string): string {
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2)
}

/** A live event check-in screen with search, attendance filters, real status
 * updates, and a compact arrival summary for the front-desk team. */
export function EventBlock() {
  const [attendees, setAttendees] = useState(INITIAL_ATTENDEES)
  const [filter, setFilter] = useState<AttendanceFilter>('all')
  const [query, setQuery] = useState('')

  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return attendees.filter((attendee) => {
      const matchesQuery =
        !normalized ||
        `${attendee.name} ${attendee.company} ${attendee.ticket}`.toLowerCase().includes(normalized)
      const matchesFilter =
        filter === 'all' ||
        (filter === 'waiting' && !attendee.checkedIn) ||
        (filter === 'checked' && attendee.checkedIn)
      return matchesQuery && matchesFilter
    })
  }, [attendees, filter, query])

  const checkedCount = attendees.filter((attendee) => attendee.checkedIn).length
  const waitingCount = attendees.length - checkedCount

  function toggleCheckIn(id: string) {
    setAttendees((current) =>
      current.map((attendee) =>
        attendee.id === id ? { ...attendee, checkedIn: !attendee.checkedIn } : attendee,
      ),
    )
  }

  return (
    <>
      <Shell>
        <Sidebar mobile="hide">
          <Row gap={2} wrap={false}>
            <Blob icon="calendar" tone="pink" size="sm" />
            <Heading level={3}>Gather</Heading>
          </Row>
          {NAV.map((item) => (
            <NavLink key={item.href} href={item.href} currentPath={HERE} icon={item.icon} tone={item.tone}>
              {item.label}
            </NavLink>
          ))}
        </Sidebar>

        <Stack gap={5}>
          <Row justify="between" align="top">
            <Stack gap={1}>
              <Eyebrow>Design Systems Day</Eyebrow>
              <Heading level={1}>Guest Check-in</Heading>
              <Row gap={2} wrap={false}>
                <Dot tone="up" />
                <Text muted>Doors are open · Hall A</Text>
              </Row>
            </Stack>
            <Badge tone="pink">Live</Badge>
          </Row>

          <Grid cols={3} gap={3}>
            <Stat label="Registered" value={NUMBER.format(attendees.length)} icon="users" tone="purple" />
            <Stat label="Checked in" value={NUMBER.format(checkedCount)} icon="ok" tone="mint" />
            <Stat label="Waiting" value={NUMBER.format(waitingCount)} icon="clock" tone="yellow" />
          </Grid>

          <Card variant="tight">
            <Stack gap={3}>
              <Field label="Find an Attendee">
                {(id, describedBy) => (
                  <Input
                    id={id}
                    name="attendee-search"
                    value={query}
                    onChange={setQuery}
                    describedBy={describedBy}
                    placeholder="Search a name, company, or ticket…"
                    autoComplete="off"
                  />
                )}
              </Field>
              <Segmented
                label="Attendance status"
                value={filter}
                onChange={setFilter}
                options={[
                  { value: 'all', label: 'All' },
                  { value: 'waiting', label: 'Waiting' },
                  { value: 'checked', label: 'Checked In' },
                ]}
              />
            </Stack>
          </Card>

          <Stack gap={3}>
            {visible.length > 0 ? (
              visible.map((attendee) => (
                <Card key={attendee.id} variant="tight">
                  <Row justify="between" wrap={false}>
                    <Row gap={3} wrap={false}>
                      <Avatar fallback={initials(attendee.name)} tone={attendee.checkedIn ? 'mint' : 'purple'} size="md" />
                      <Stack gap={1}>
                        <Heading level={3}>{attendee.name}</Heading>
                        <Text size="sm" muted>{attendee.company} · {attendee.ticket}</Text>
                      </Stack>
                    </Row>
                    <Button
                      size="sm"
                      tone={attendee.checkedIn ? 'purple' : 'mint'}
                      variant={attendee.checkedIn ? 'quiet' : 'solid'}
                      onClick={() => toggleCheckIn(attendee.id)}
                    >
                      {attendee.checkedIn ? 'Undo Check-in' : 'Check In'}
                    </Button>
                  </Row>
                </Card>
              ))
            ) : (
              <Card>
                <Empty icon="search" title="No attendees found">
                  Check the spelling or show all attendance states.
                </Empty>
              </Card>
            )}
          </Stack>
        </Stack>
      </Shell>

      <BottomNav primary={NAV.slice(0, 3)} groups={[{ title: 'Event', items: NAV }]} currentPath={HERE} />
    </>
  )
}
