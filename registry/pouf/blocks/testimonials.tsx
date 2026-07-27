import { useState } from 'react'
import { Avatar } from '../avatar'
import { IconButton } from '../Button'
import { Icon } from '../Icon'
import { Grid, Row, Stack } from '../layout'
import { Badge, Blob } from '../media'
import { Segmented } from '../Segmented'
import { Card } from '../surface'
import { Eyebrow, Heading, Text } from '../text'

interface Story {
  id: string
  group: 'Design' | 'Engineering' | 'Founders'
  quote: string
  name: string
  role: string
  result: string
  tone: 'purple' | 'pink' | 'blue' | 'mint'
}

const STORIES: Story[] = [
  {
    id: 'ada',
    group: 'Design',
    quote: 'The depth system gave every interaction a physical answer. Our prototypes finally felt like the product.',
    name: 'Ada L.',
    role: 'Design director, Looma',
    result: '2× faster prototyping',
    tone: 'purple',
  },
  {
    id: 'grace',
    group: 'Engineering',
    quote: 'Closed variants stopped one-off styling at the source. The team ships changes without a cleanup week afterward.',
    name: 'Grace H.',
    role: 'Staff engineer, Relay',
    result: '41% less UI churn',
    tone: 'blue',
  },
  {
    id: 'maya',
    group: 'Founders',
    quote: 'We launched with a real personality instead of another grey dashboard. Customers remembered us.',
    name: 'Maya B.',
    role: 'Founder, Pollen',
    result: '18% higher activation',
    tone: 'pink',
  },
  {
    id: 'alan',
    group: 'Engineering',
    quote: 'The components are strict in the useful places and editable everywhere else. That balance is rare.',
    name: 'Alan T.',
    role: 'Engineering lead, Tally',
    result: '6 routes in 9 days',
    tone: 'mint',
  },
]

const FILTERS = ['All', 'Design', 'Engineering', 'Founders'] as const
type Filter = (typeof FILTERS)[number]

/** A filterable testimonial section with keyboard-friendly carousel controls. */
export function TestimonialsBlock() {
  const [filter, setFilter] = useState<Filter>('All')
  const [index, setIndex] = useState(0)
  const shown = filter === 'All' ? STORIES : STORIES.filter((story) => story.group === filter)
  const story = shown[index % shown.length]!

  const changeFilter = (next: Filter) => {
    setFilter(next)
    setIndex(0)
  }

  const move = (direction: 1 | -1) => {
    setIndex((current) => (current + direction + shown.length) % shown.length)
  }

  return (
    <div style={{ maxWidth: 1060, margin: '0 auto', padding: 24 }}>
      <Stack gap={6}>
        <Row justify="between" align="top">
          <Stack gap={2}>
            <Eyebrow>Customer stories</Eyebrow>
            <Heading level={1}>Loved by teams with taste.</Heading>
          </Stack>
          <Badge tone="yellow">4.9 average rating</Badge>
        </Row>

        <Segmented
          label="Filter stories"
          value={filter}
          onChange={changeFilter}
          options={FILTERS.map((value) => ({ value, label: value }))}
        />

        <Grid cols="sidebar" gap={5}>
          <Card motion="tilt-left">
            <div aria-live="polite" aria-atomic="true">
              <Stack gap={5}>
                <Row justify="between" wrap={false}>
                  <Blob icon="comment" tone={story.tone} size="md" />
                  <Badge tone={story.tone}>{story.group}</Badge>
                </Row>
                <blockquote style={{ margin: 0 }}>
                  <Heading level={2}>{story.quote}</Heading>
                </blockquote>
                <Row justify="between">
                  <Row gap={3} wrap={false}>
                    <Avatar fallback={story.name.slice(0, 2)} tone={story.tone} />
                    <Stack gap={1}>
                      <Text>{story.name}</Text>
                      <Text size="sm" muted>{story.role}</Text>
                    </Stack>
                  </Row>
                  <Row gap={2} wrap={false}>
                    <IconButton
                      icon={<Icon name="prev" size="sm" />}
                      label="Previous story"
                      onClick={() => move(-1)}
                    />
                    <IconButton
                      icon={<Icon name="next" size="sm" />}
                      label="Next story"
                      onClick={() => move(1)}
                    />
                  </Row>
                </Row>
              </Stack>
            </div>
          </Card>

          <Stack gap={3}>
            <Card variant="tight">
              <Stack gap={2}>
                <Text size="sm" muted>Reported outcome</Text>
                <Heading level={2}>{story.result}</Heading>
              </Stack>
            </Card>
            <Card variant="tight">
              <Stack gap={2}>
                <Text size="sm" muted>Story</Text>
                <Heading level={2}>{index % shown.length + 1} of {shown.length}</Heading>
              </Stack>
            </Card>
            <Card variant="tight">
              <Row gap={2}>
                {shown.map((item, itemIndex) => (
                  <span
                    key={item.id}
                    aria-hidden="true"
                    style={{
                      width: itemIndex === index % shown.length ? 28 : 10,
                      height: 10,
                      borderRadius: 999,
                      background: itemIndex === index % shown.length ? 'var(--purple)' : 'var(--bg)',
                      boxShadow: 'var(--pouf-field)',
                    }}
                  />
                ))}
              </Row>
            </Card>
          </Stack>
        </Grid>
      </Stack>
    </div>
  )
}
