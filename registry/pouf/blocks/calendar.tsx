import { useState } from 'react'
import { Card } from '../surface'
import { Stack, Row, Spacer } from '../layout'
import { Heading, Text, Eyebrow } from '../text'
import { Button } from '../Button'
import { Segmented } from '../Segmented'
import { Badge } from '../media'
import { Empty as EmptyState } from '../feedback'
import { Icon } from '../Icon'

interface Event {
  time: string
  /** Minutes the event occupies — the free-slot math below needs an end, not
   *  just a start. */
  duration: number
  title: string
  who: string
  tone: 'purple' | 'pink' | 'blue' | 'mint' | 'yellow'
}

interface Day {
  weekday: string
  date: string
  events: Event[]
}

const DAYS: Day[] = [
  { weekday: 'Wednesday', date: 'July 18', events: [
    { time: '11:00', duration: 60, title: 'Customer call', who: 'Sales', tone: 'blue' },
    { time: '15:00', duration: 45, title: 'Retro', who: 'Whole team', tone: 'purple' },
  ] },
  { weekday: 'Thursday', date: 'July 19', events: [
    { time: '09:00', duration: 15, title: 'Standup', who: 'Whole team', tone: 'blue' },
    { time: '10:30', duration: 30, title: 'Design review — cushions', who: 'Maya, Grace', tone: 'purple' },
    { time: '12:00', duration: 45, title: 'Lunch & learn', who: 'Optional', tone: 'yellow' },
    { time: '14:00', duration: 30, title: '1:1 with Alan', who: 'Alan T.', tone: 'mint' },
    { time: '16:00', duration: 45, title: 'Ship review', who: 'Katherine, you', tone: 'pink' },
  ] },
  { weekday: 'Friday', date: 'July 20', events: [
    { time: '13:00', duration: 120, title: 'Deep work', who: 'You', tone: 'mint' },
  ] },
]

// Bounds for the visible day and the point "now" sits at — fixed rather than
// wall-clock so the demo always renders the same free slots and now-line.
const DAY_START = 9 * 60
const DAY_END = 17 * 60
const FREE_THRESHOLD = 60
const NOW_MINUTES = 11 * 60 + 15
const TODAY_INDEX = 1

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return (h ?? 0) * 60 + (m ?? 0)
}

function fromMinutes(mins: number): string {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

type TimelineItem =
  | { kind: 'event'; start: number; event: Event }
  | { kind: 'free'; start: number; end: number }
  | { kind: 'now' }

/* Turns a day's sparse event list into a full timeline: gaps of at least
 * FREE_THRESHOLD become "free" rows, and — only for the day that is actually
 * "today" — a now-line is spliced in wherever NOW_MINUTES falls. */
function buildTimeline(day: Day, showNow: boolean): TimelineItem[] {
  const events = [...day.events].sort((a, b) => toMinutes(a.time) - toMinutes(b.time))
  const items: TimelineItem[] = []
  let cursor = DAY_START
  let nowPlaced = !showNow

  function placeNowBefore(start: number) {
    if (!nowPlaced && start > NOW_MINUTES) {
      items.push({ kind: 'now' })
      nowPlaced = true
    }
  }

  for (const event of events) {
    const start = toMinutes(event.time)
    if (start - cursor >= FREE_THRESHOLD) {
      placeNowBefore(start)
      items.push({ kind: 'free', start: cursor, end: start })
    }
    placeNowBefore(start)
    items.push({ kind: 'event', start, event })
    cursor = Math.max(cursor, start + event.duration)
  }
  if (DAY_END - cursor >= FREE_THRESHOLD) {
    placeNowBefore(DAY_END)
    items.push({ kind: 'free', start: cursor, end: DAY_END })
  }
  if (!nowPlaced) items.push({ kind: 'now' })

  return items
}

function EventRow({ event }: { event: Event }) {
  return (
    <Row gap={3} wrap={false} align="top">
      <div style={{ width: 52, flex: 'none', paddingTop: 4 }}>
        <Text size="sm" muted num>{event.time}</Text>
      </div>
      <div style={{ flex: 1, minWidth: 0, borderRadius: 18, padding: '14px 16px', background: `var(--${event.tone})`, color: 'var(--on-accent)', boxShadow: 'var(--pouf-control)' }}>
        <Row justify="between" wrap={false}>
          <Stack gap={1}>
            <Text>{event.title}</Text>
            <Text size="sm">{event.who}</Text>
          </Stack>
          <Spacer />
          <Icon name="calendar" size="sm" />
        </Row>
      </div>
    </Row>
  )
}

function FreeRow({ start, end }: { start: number; end: number }) {
  return (
    <Row gap={3} wrap={false} align="center">
      <div style={{ width: 52, flex: 'none' }}>
        <Text size="sm" muted num>{fromMinutes(start)}</Text>
      </div>
      <Row gap={2} wrap={false} align="center">
        <Icon name="clock" size="sm" />
        <Text size="sm" muted>Free until {fromMinutes(end)}</Text>
      </Row>
    </Row>
  )
}

function NowLine() {
  return (
    <Row gap={3} wrap={false} align="center">
      <div style={{ width: 52, flex: 'none' }}>
        <Text size="sm" num>{fromMinutes(NOW_MINUTES)}</Text>
      </div>
      <div style={{ flex: 1, height: 2, borderRadius: 999, background: 'var(--pink)' }} />
    </Row>
  )
}

/** An example day agenda: a day picker across the week, timed events, a
 *  now-line pinned to the current moment on today's timeline, and the free
 *  slots between events. */
export function CalendarBlock() {
  const [i, setI] = useState(TODAY_INDEX)
  const day = DAYS[i]!
  const isToday = i === TODAY_INDEX
  const timeline = buildTimeline(day, isToday)

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: 24 }}>
      <Card>
        <Stack gap={5}>
          <Row justify="between">
            <Stack gap={1}>
              <Row gap={2} wrap={false}>
                <Eyebrow>{day.weekday}</Eyebrow>
                {isToday && <Badge tone="mint">Today</Badge>}
              </Row>
              <Heading level={2}>{day.date}</Heading>
            </Stack>
            <Row gap={2} wrap={false}>
              <Button size="sm" variant="quiet" disabled={i === 0} label="Previous day" onClick={() => setI((x) => Math.max(0, x - 1))}><Icon name="prev" size="sm" /></Button>
              <Button size="sm" variant="quiet" disabled={isToday} onClick={() => setI(TODAY_INDEX)}>Today</Button>
              <Button size="sm" variant="quiet" disabled={i === DAYS.length - 1} label="Next day" onClick={() => setI((x) => Math.min(DAYS.length - 1, x + 1))}><Icon name="next" size="sm" /></Button>
            </Row>
          </Row>

          <Segmented
            label="Day"
            value={day.date}
            onChange={(date) => setI(DAYS.findIndex((d) => d.date === date))}
            options={DAYS.map((d) => ({ value: d.date, label: `${d.weekday.slice(0, 3)} ${d.date.split(' ')[1]}` }))}
            tone="blue"
          />

          <Stack gap={2}>
            {timeline.map((item, idx) => {
              if (item.kind === 'now') return <NowLine key="now" />
              if (item.kind === 'free') return <FreeRow key={`free-${idx}`} start={item.start} end={item.end} />
              return <EventRow key={item.event.time} event={item.event} />
            })}
            {day.events.length === 0 && <EmptyState icon="ok" title="Nothing scheduled">Enjoy the quiet.</EmptyState>}
          </Stack>

          <Row justify="between">
            <Badge tone="mint">{day.events.length} {day.events.length === 1 ? 'event' : 'events'}</Badge>
            <Button size="sm"><Icon name="add" size="sm" /> New event</Button>
          </Row>
        </Stack>
      </Card>
    </div>
  )
}
