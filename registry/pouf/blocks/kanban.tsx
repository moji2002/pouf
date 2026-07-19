import { Stack, Row, Grid } from '../layout'
import { Heading, Text, Eyebrow } from '../text'
import { RowCard } from '../surface'
import { Badge } from '../media'
import { Avatar } from '../avatar'

interface Task {
  id: string
  title: string
  priority: 'low' | 'med' | 'high'
  who: string
}

const COLUMNS: { key: string; title: string; tone: 'blue' | 'yellow' | 'mint'; tasks: Task[] }[] = [
  { key: 'todo', title: 'To do', tone: 'blue', tasks: [
    { id: '1', title: 'Design the empty states', priority: 'med', who: 'AL' },
    { id: '2', title: 'Audit colour contrast', priority: 'high', who: 'GH' },
  ] },
  { key: 'doing', title: 'In progress', tone: 'yellow', tasks: [
    { id: '3', title: 'Migrate the table to Tailwind', priority: 'high', who: 'AT' },
    { id: '4', title: 'Write the changelog script', priority: 'low', who: 'KJ' },
  ] },
  { key: 'done', title: 'Done', tone: 'mint', tasks: [
    { id: '5', title: 'Ship the snapshot gate', priority: 'high', who: 'AL' },
  ] },
]

const PRIORITY_TONE = { low: 'blue', med: 'yellow', high: 'pink' } as const

/** An example kanban board: columns of draggable-looking cards with priority
 * badges and assignees. (Wire your own drag handler.) */
export function KanbanBlock() {
  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: 24 }}>
      <Stack gap={5}>
        <Stack gap={1}>
          <Eyebrow>Sprint 12</Eyebrow>
          <Heading level={1}>Board</Heading>
        </Stack>
        <Grid cols={3}>
          {COLUMNS.map((col) => (
            <Stack gap={3} key={col.key}>
              <Row justify="between">
                <Heading level={3}>{col.title}</Heading>
                <Badge tone={col.tone}>{col.tasks.length}</Badge>
              </Row>
              <Stack gap={2}>
                {col.tasks.map((t) => (
                  <RowCard key={t.id} onClick={() => {}}>
                    <Stack gap={2}>
                      <Text>{t.title}</Text>
                      <Row justify="between">
                        <Badge tone={PRIORITY_TONE[t.priority]}>{t.priority}</Badge>
                        <Avatar fallback={t.who} size="sm" tone="purple" />
                      </Row>
                    </Stack>
                  </RowCard>
                ))}
              </Stack>
            </Stack>
          ))}
        </Grid>
      </Stack>
    </div>
  )
}
