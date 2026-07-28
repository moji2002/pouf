import { useMemo, useState } from 'react'
import { Button } from '../Button'
import { BottomNav, type NavItem } from '../BottomNav'
import { NavLink } from '../NavLink'
import { Blob, Badge } from '../media'
import { Grid, Row, Shell, Sidebar, Stack } from '../layout'
import { Progress } from '../progress'
import { Card, RowCard } from '../surface'
import { Eyebrow, Heading, Text } from '../text'

const NAV: NavItem[] = [
  { href: '/', label: 'Home', icon: 'home', tone: 'purple' },
  { href: '/learn', label: 'Learn', icon: 'wand', tone: 'yellow' },
  { href: '/practice', label: 'Practice', icon: 'target', tone: 'mint' },
  { href: '/community', label: 'Community', icon: 'users', tone: 'pink' },
  { href: '/profile', label: 'Profile', icon: 'user', tone: 'blue' },
]

const HERE = '/learn'

interface Lesson {
  id: string
  title: string
  duration: number
  kind: 'Lesson' | 'Exercise' | 'Quiz'
}

const LESSONS: Lesson[] = [
  { id: 'hierarchy', title: 'Build a clear visual hierarchy', duration: 8, kind: 'Lesson' },
  { id: 'spacing', title: 'Use spacing as a system', duration: 12, kind: 'Exercise' },
  { id: 'contrast', title: 'Make contrast do real work', duration: 7, kind: 'Lesson' },
  { id: 'review', title: 'Review a dashboard', duration: 10, kind: 'Quiz' },
]

const MINUTES = new Intl.NumberFormat('en-US', { style: 'unit', unit: 'minute' })

/** A responsive learning dashboard with a meaningful course outline, progress
 * that updates as lessons are completed, and a focused current-lesson panel. */
export function CourseBlock() {
  const [completed, setCompleted] = useState<string[]>(['hierarchy'])
  const [activeId, setActiveId] = useState('spacing')

  const active = LESSONS.find((lesson) => lesson.id === activeId) ?? LESSONS[0]!
  const progress = Math.round((completed.length / LESSONS.length) * 100)
  const remaining = useMemo(
    () => LESSONS.filter((lesson) => !completed.includes(lesson.id)).reduce((sum, lesson) => sum + lesson.duration, 0),
    [completed],
  )

  function toggleLesson(id: string, checked: boolean | 'indeterminate') {
    setCompleted((current) =>
      checked === true
        ? current.includes(id) ? current : [...current, id]
        : current.filter((lessonId) => lessonId !== id),
    )
  }

  function completeActive() {
    toggleLesson(active.id, true)
    const next = LESSONS.find((lesson) => !completed.includes(lesson.id) && lesson.id !== active.id)
    if (next) setActiveId(next.id)
  }

  return (
    <>
      <Shell>
        <Sidebar mobile="hide">
          <Row gap={2} wrap={false}>
            <Blob icon="wand" tone="yellow" size="sm" />
            <Heading level={3}>Small Steps</Heading>
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
              <Eyebrow>Design Foundations</Eyebrow>
              <Heading level={1}>Learn by Doing</Heading>
              <Text muted>A compact course with progress you can actually complete.</Text>
            </Stack>
            <Badge tone="yellow">Course 2 of 4</Badge>
          </Row>

          <Card>
            <Grid cols="sidebar" gap={5}>
              <Stack gap={3}>
                <Text size="sm" muted>Current Course</Text>
                <Heading level={2}>Designing Interfaces That Read Clearly</Heading>
                <Text muted>Turn hierarchy, spacing, and contrast into repeatable decisions.</Text>
                <Progress value={progress} tone="mint" label="Course completion" />
                <Row justify="between">
                  <Text size="sm">{progress}% complete</Text>
                  <Text size="sm" muted>{MINUTES.format(remaining)} remaining</Text>
                </Row>
              </Stack>
              <div className="flex items-center justify-center">
                <Blob icon={progress === 100 ? 'trophy' : 'target'} tone={progress === 100 ? 'yellow' : 'purple'} size="lg" />
              </div>
            </Grid>
          </Card>

          <Grid cols="sidebar" gap={4}>
            <Stack gap={3}>
              {LESSONS.map((lesson, index) => (
                <RowCard
                  key={lesson.id}
                  selected={lesson.id === active.id}
                  onClick={() => setActiveId(lesson.id)}
                >
                  <Row justify="between" wrap={false}>
                    <Row gap={3} wrap={false}>
                      <Blob
                        icon={completed.includes(lesson.id) ? 'ok' : lesson.kind === 'Quiz' ? 'wand' : 'play'}
                        tone={completed.includes(lesson.id) ? 'mint' : index % 2 === 0 ? 'blue' : 'purple'}
                        size="sm"
                      />
                      <Stack gap={1}>
                        <Text size="sm" muted>{lesson.kind} · {MINUTES.format(lesson.duration)}</Text>
                        <Heading level={3}>{lesson.title}</Heading>
                      </Stack>
                    </Row>
                    <Badge tone={completed.includes(lesson.id) ? 'up' : 'idle'}>
                      {completed.includes(lesson.id) ? 'Done' : 'Next'}
                    </Badge>
                  </Row>
                </RowCard>
              ))}
            </Stack>

            <Card>
              <Stack gap={4}>
                <Badge tone={active.kind === 'Quiz' ? 'yellow' : 'blue'}>{active.kind}</Badge>
                <Heading level={2}>{active.title}</Heading>
                <Text muted>
                  Work through a focused example, then apply the idea to a real interface.
                </Text>
                <Row justify="between">
                  <Text muted>Time</Text>
                  <Text num>{MINUTES.format(active.duration)}</Text>
                </Row>
                <Button
                  tone={completed.includes(active.id) ? 'purple' : 'mint'}
                  block
                  onClick={completeActive}
                >
                  {completed.includes(active.id) ? 'Continue to Next Lesson' : 'Mark Complete'}
                </Button>
              </Stack>
            </Card>
          </Grid>
        </Stack>
      </Shell>

      <BottomNav primary={NAV.slice(0, 3)} groups={[{ title: 'Learning', items: NAV }]} currentPath={HERE} />
    </>
  )
}
