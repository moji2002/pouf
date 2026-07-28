import { useMemo, useState } from 'react'
import { Button } from '../Button'
import { BottomNav, type NavItem } from '../BottomNav'
import { NavLink } from '../NavLink'
import { Empty } from '../feedback'
import { Blob, Badge, Dot } from '../media'
import { Grid, Row, Shell, Sidebar, Stack } from '../layout'
import { Segmented } from '../Segmented'
import { Card, RowCard } from '../surface'
import { Eyebrow, Heading, Text } from '../text'

const NAV: NavItem[] = [
  { href: '/', label: 'Overview', icon: 'overview', tone: 'purple' },
  { href: '/editorial', label: 'Editorial', icon: 'draft', tone: 'orange' },
  { href: '/calendar', label: 'Calendar', icon: 'calendar', tone: 'blue' },
  { href: '/team', label: 'Team', icon: 'users', tone: 'mint' },
  { href: '/settings', label: 'Settings', icon: 'settings', tone: 'yellow' },
]

const HERE = '/editorial'
const DATE = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })
const NUMBER = new Intl.NumberFormat('en-US')

type StoryStatus = 'draft' | 'scheduled' | 'published'

interface Story {
  id: string
  title: string
  section: string
  author: string
  due: string
  status: StoryStatus
  words: number
}

const INITIAL_STORIES: Story[] = [
  { id: 'soft-ui', title: 'Why soft interfaces still need sharp decisions', section: 'Design', author: 'Maya', due: '2026-08-04T09:00:00Z', status: 'draft', words: 1240 },
  { id: 'local-first', title: 'A practical guide to local-first notes', section: 'Engineering', author: 'Noah', due: '2026-08-05T13:00:00Z', status: 'scheduled', words: 1860 },
  { id: 'launch', title: 'Inside a calm product launch', section: 'Company', author: 'Iris', due: '2026-08-07T10:30:00Z', status: 'draft', words: 920 },
  { id: 'motion', title: 'Motion that explains instead of decorates', section: 'Design', author: 'Maya', due: '2026-08-01T08:00:00Z', status: 'published', words: 1580 },
]

const STATUS_TONE: Record<StoryStatus, 'orange' | 'blue' | 'up'> = {
  draft: 'orange',
  scheduled: 'blue',
  published: 'up',
}

/** An editorial workspace that filters the queue, selects stories, and moves a
 * draft through scheduling and publication without leaving the screen. */
export function EditorialBlock() {
  const [stories, setStories] = useState(INITIAL_STORIES)
  const [status, setStatus] = useState<StoryStatus>('draft')
  const [selectedId, setSelectedId] = useState(INITIAL_STORIES[0]!.id)

  const visible = useMemo(
    () => stories.filter((story) => story.status === status),
    [status, stories],
  )
  const selected = visible.find((story) => story.id === selectedId) ?? visible[0] ?? stories[0]!

  function updateStatus(next: StoryStatus) {
    setStories((current) =>
      current.map((story) => (story.id === selected.id ? { ...story, status: next } : story)),
    )
    setStatus(next)
  }

  return (
    <>
      <Shell>
        <Sidebar mobile="hide">
          <Row gap={2} wrap={false}>
            <Blob icon="draft" tone="orange" size="sm" />
            <Heading level={3}>Field Notes</Heading>
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
              <Eyebrow>Publishing</Eyebrow>
              <Heading level={1}>Editorial Desk</Heading>
              <Text muted>Move every story from a good idea to a clean launch.</Text>
            </Stack>
            <Badge tone="yellow">{stories.length} stories</Badge>
          </Row>

          <Card variant="tight">
            <Row justify="between">
              <Segmented
                label="Story status"
                value={status}
                onChange={setStatus}
                options={[
                  { value: 'draft', label: 'Drafts' },
                  { value: 'scheduled', label: 'Scheduled' },
                  { value: 'published', label: 'Published' },
                ]}
              />
              <Row gap={2} wrap={false}>
                <Dot tone={STATUS_TONE[status]} />
                <Text size="sm">{visible.length} in this stage</Text>
              </Row>
            </Row>
          </Card>

          <Grid cols="sidebar" gap={4}>
            <Stack gap={3}>
              {visible.length > 0 ? (
                visible.map((story) => (
                  <RowCard
                    key={story.id}
                    selected={story.id === selected.id}
                    onClick={() => setSelectedId(story.id)}
                  >
                    <Row justify="between" align="top" wrap={false}>
                      <Stack gap={1}>
                        <Text size="sm" muted>{story.section}</Text>
                        <Heading level={3}>{story.title}</Heading>
                        <Text size="sm" muted>
                          {story.author} · {DATE.format(new Date(story.due))}
                        </Text>
                      </Stack>
                      <Badge tone={STATUS_TONE[story.status]}>{story.status}</Badge>
                    </Row>
                  </RowCard>
                ))
              ) : (
                <Card>
                  <Empty icon="draft" title={`No ${status} stories`}>
                    Move a story here when it is ready.
                  </Empty>
                </Card>
              )}
            </Stack>

            <Card>
              <Stack gap={4}>
                <Row justify="between" align="top">
                  <Stack gap={1}>
                    <Text size="sm" muted>{selected.section}</Text>
                    <Heading level={2}>{selected.title}</Heading>
                  </Stack>
                  <Badge tone={STATUS_TONE[selected.status]}>{selected.status}</Badge>
                </Row>
                <Row justify="between">
                  <Text muted>Author</Text>
                  <Text>{selected.author}</Text>
                </Row>
                <Row justify="between">
                  <Text muted>Target</Text>
                  <Text num>{DATE.format(new Date(selected.due))}</Text>
                </Row>
                <Row justify="between">
                  <Text muted>Length</Text>
                  <Text num>{NUMBER.format(selected.words)} words</Text>
                </Row>
                {selected.status === 'draft' && (
                  <Button tone="blue" block onClick={() => updateStatus('scheduled')}>
                    Schedule Story
                  </Button>
                )}
                {selected.status === 'scheduled' && (
                  <Button tone="mint" block onClick={() => updateStatus('published')}>
                    Publish Story
                  </Button>
                )}
                {selected.status === 'published' && (
                  <Button variant="quiet" block onClick={() => updateStatus('draft')}>
                    Return to Drafts
                  </Button>
                )}
              </Stack>
            </Card>
          </Grid>
        </Stack>
      </Shell>

      <BottomNav primary={NAV.slice(0, 3)} groups={[{ title: 'Workspace', items: NAV }]} currentPath={HERE} />
    </>
  )
}
