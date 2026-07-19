import { useState } from 'react'
import { Card } from '../surface'
import { Stack, Row, Spacer } from '../layout'
import { Heading, Text, Eyebrow } from '../text'
import { Button } from '../Button'
import { Badge } from '../media'
import { Empty as EmptyState } from '../feedback'
import { Icon } from '../Icon'

interface Event {
  time: string
  title: string
  who: string
  tone: 'purple' | 'pink' | 'blue' | 'mint' | 'yellow'
}

const DAYS: { weekday: string; date: string; events: Event[] }[] = [
  { weekday: 'Wednesday', date: 'July 18', events: [
    { time: '11:00', title: 'Customer call', who: 'Sales', tone: 'blue' },
    { time: '15:00', title: 'Retro', who: 'Whole team', tone: 'purple' },
  ] },
  { weekday: 'Thursday', date: 'July 19', events: [
    { time: '09:00', title: 'Standup', who: 'Whole team', tone: 'blue' },
    { time: '10:30', title: 'Design review — cushions', who: 'Maya, Grace', tone: 'purple' },
    { time: '12:00', title: 'Lunch & learn', who: 'Optional', tone: 'yellow' },
    { time: '14:00', title: '1:1 with Alan', who: 'Alan T.', tone: 'mint' },
    { time: '16:00', title: 'Ship review', who: 'Katherine, you', tone: 'pink' },
  ] },
  { weekday: 'Friday', date: 'July 20', events: [
    { time: '13:00', title: 'Deep work', who: 'You', tone: 'mint' },
  ] },
]

/** An example day agenda: a header with working navigation and a list of
 * time-slotted event cards. */
export function CalendarBlock() {
  const [i, setI] = useState(1)
  const day = DAYS[i]!
  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: 24 }}>
      <Card>
        <Stack gap={5}>
          <Row justify="between">
            <Stack gap={1}>
              <Eyebrow>{day.weekday}</Eyebrow>
              <Heading level={2}>{day.date}</Heading>
            </Stack>
            <Row gap={2} wrap={false}>
              <Button size="sm" variant="quiet" disabled={i === 0} label="Previous day" onClick={() => setI((x) => Math.max(0, x - 1))}><Icon name="prev" size="sm" /></Button>
              <Button size="sm" variant="quiet" onClick={() => setI(1)}>Today</Button>
              <Button size="sm" variant="quiet" disabled={i === DAYS.length - 1} label="Next day" onClick={() => setI((x) => Math.min(DAYS.length - 1, x + 1))}><Icon name="next" size="sm" /></Button>
            </Row>
          </Row>

          <Stack gap={2}>
            {day.events.map((e) => (
              <Row key={e.time} gap={3} wrap={false} align="top">
                <div style={{ width: 52, flex: 'none', paddingTop: 4 }}>
                  <Text size="sm" muted num>{e.time}</Text>
                </div>
                <div style={{ flex: 1, minWidth: 0, borderRadius: 18, padding: '14px 16px', background: `var(--${e.tone})`, boxShadow: 'var(--pouf-control)' }}>
                  <Row justify="between" wrap={false}>
                    <Stack gap={1}>
                      <Text>{e.title}</Text>
                      <Text size="sm">{e.who}</Text>
                    </Stack>
                    <Spacer />
                    <Icon name="calendar" size="sm" />
                  </Row>
                </div>
              </Row>
            ))}
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
