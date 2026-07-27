import { useState } from 'react'
import clsx from 'clsx'
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  type DragEndEvent,
} from '@dnd-kit/core'
import { Shell, Sidebar, Stack, Row, Grid, Spacer } from '../layout'
import { Heading, Text, Eyebrow } from '../text'
import { RowCard } from '../surface'
import { Badge, Blob } from '../media'
import { Avatar } from '../avatar'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { NavLink } from '../NavLink'
import { BottomNav, type NavItem } from '../BottomNav'

const NAV: NavItem[] = [
  { href: '/', label: 'Overview', icon: 'overview', tone: 'purple' },
  { href: '/inbox', label: 'Inbox', icon: 'mail', tone: 'blue' },
  { href: '/board', label: 'Board', icon: 'log', tone: 'mint' },
  { href: '/messages', label: 'Messages', icon: 'comment', tone: 'pink' },
  { href: '/settings', label: 'Settings', icon: 'settings', tone: 'orange' },
]

const HERE = '/board'

interface Task {
  id: string
  title: string
  priority: 'low' | 'med' | 'high'
  who: string
}

type ColumnKey = 'todo' | 'doing' | 'done'

const COLUMNS: { key: ColumnKey; title: string; tone: 'blue' | 'yellow' | 'mint' }[] = [
  { key: 'todo', title: 'To do', tone: 'blue' },
  { key: 'doing', title: 'In progress', tone: 'yellow' },
  { key: 'done', title: 'Done', tone: 'mint' },
]

const SEED: Record<ColumnKey, Task[]> = {
  todo: [
    { id: '1', title: 'Design the empty states', priority: 'med', who: 'AL' },
    { id: '2', title: 'Audit colour contrast', priority: 'high', who: 'GH' },
  ],
  doing: [
    { id: '3', title: 'Migrate the table to Tailwind', priority: 'high', who: 'AT' },
    { id: '4', title: 'Write the changelog script', priority: 'low', who: 'KJ' },
  ],
  done: [{ id: '5', title: 'Ship the snapshot gate', priority: 'high', who: 'AL' }],
}

const PRIORITY_TONE = { low: 'blue', med: 'yellow', high: 'pink' } as const
const ORDER: ColumnKey[] = ['todo', 'doing', 'done']

/** A draggable card. The ←/→ buttons are not decoration: pointer drag is
 *  unavailable on touch and awkward with a screen reader, so the same move is
 *  always reachable as a plain button press. */
function Card({
  task,
  column,
  onMove,
}: {
  task: Task
  column: ColumnKey
  onMove: (id: string, from: ColumnKey, dir: -1 | 1) => void
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
    data: { from: column },
  })
  const i = ORDER.indexOf(column)

  return (
    <div ref={setNodeRef} className={clsx(isDragging && 'opacity-40')}>
      <RowCard>
        <Stack gap={2}>
          {/* The drag handle is the title row, not the whole card — otherwise
            * the move buttons inside would start a drag instead of firing. */}
          <div className="cursor-grab active:cursor-grabbing" {...listeners} {...attributes}>
            <Text>{task.title}</Text>
          </div>
          <Row justify="between">
            <Badge tone={PRIORITY_TONE[task.priority]}>{task.priority}</Badge>
            <Row gap={2} wrap={false}>
              <Button
                size="sm"
                variant="quiet"
                disabled={i === 0}
                onClick={() => onMove(task.id, column, -1)}
                label={`Move “${task.title}” left`}
              >
                <Icon name="prev" size="sm" />
              </Button>
              <Button
                size="sm"
                variant="quiet"
                disabled={i === ORDER.length - 1}
                onClick={() => onMove(task.id, column, 1)}
                label={`Move “${task.title}” right`}
              >
                <Icon name="next" size="sm" />
              </Button>
              <Avatar fallback={task.who} size="sm" tone="purple" />
            </Row>
          </Row>
        </Stack>
      </RowCard>
    </div>
  )
}

function Column({
  col,
  tasks,
  onMove,
}: {
  col: (typeof COLUMNS)[number]
  tasks: Task[]
  onMove: (id: string, from: ColumnKey, dir: -1 | 1) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: col.key })

  return (
    <Stack gap={3}>
      <Row justify="between">
        <Heading level={3}>{col.title}</Heading>
        <Badge tone={col.tone}>{tasks.length}</Badge>
      </Row>
      {/* The highlight appears only while a card is dragged over this column;
        * a permanent one would add noise to the board.
        *
        * Everything visual here is an inline style on purpose. Tailwind
        * registers an @property for each theme token a utility touches, and
        * those registrations are DOCUMENT-WIDE — two such utilities here put
        * two custom properties onto the computed styles of every element on
        * the page and drifted 223 unrelated snapshots in the gate.
        *
        * Worse, the scanner reads source as plain text and cannot tell prose,
        * or a style object's key, from a class name — so the obvious CSS
        * property for this effect regenerated the very utility it was written
        * to avoid, from inside the comment warning against it. Any bare
        * one-word utility name is unsafe anywhere in this file. */}
      <div
        ref={setNodeRef}
        className="flex flex-col gap-(--s2) p-(--s2)"
        style={{
          minHeight: 120,
          borderRadius: 18,
          transition: 'background 120ms ease, box-shadow 120ms ease',
          background: isOver ? 'rgba(201,168,255,0.16)' : 'transparent',
          boxShadow: isOver ? 'inset 0 0 0 2px var(--purple)' : 'none',
        }}
      >
        {tasks.length === 0 ? (
          <div className="grid place-items-center flex-1 py-(--s5)">
            <Text size="sm" muted>Drop a card here</Text>
          </div>
        ) : (
          tasks.map((t) => <Card key={t.id} task={t} column={col.key} onMove={onMove} />)
        )}
      </div>
    </Stack>
  )
}

/** An example kanban board: app shell and columns you can actually move cards
 * between — by dragging, or with the arrow buttons on every card. */
export function KanbanBlock() {
  const [board, setBoard] = useState<Record<ColumnKey, Task[]>>(SEED)

  /* PointerSensor with a small distance constraint so a click on the move
   * buttons is not swallowed as a micro-drag. */
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  )

  function move(id: string, from: ColumnKey, to: ColumnKey) {
    if (from === to) return
    setBoard((b) => {
      const task = b[from].find((t) => t.id === id)
      if (!task) return b
      return {
        ...b,
        [from]: b[from].filter((t) => t.id !== id),
        [to]: [...b[to], task],
      }
    })
  }

  function onDragEnd({ active, over }: DragEndEvent) {
    if (!over) return
    const from = active.data.current?.from as ColumnKey | undefined
    if (from) move(String(active.id), from, over.id as ColumnKey)
  }

  function step(id: string, from: ColumnKey, dir: -1 | 1) {
    const to = ORDER[ORDER.indexOf(from) + dir]
    if (to) move(id, from, to)
  }

  const total = ORDER.reduce((n, k) => n + board[k].length, 0)

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
              <Eyebrow>Sprint 12</Eyebrow>
              <Heading level={1}>Board</Heading>
            </Stack>
            <Badge tone="purple">{total} cards</Badge>
          </Row>

          <DndContext sensors={sensors} onDragEnd={onDragEnd}>
            <Grid cols={3}>
              {COLUMNS.map((col) => (
                <Column key={col.key} col={col} tasks={board[col.key]} onMove={step} />
              ))}
            </Grid>
          </DndContext>
          <Spacer />
        </Stack>
      </Shell>
      <BottomNav primary={NAV.slice(0, 4)} groups={[{ title: 'App', items: NAV }]} currentPath={HERE} />
    </>
  )
}
