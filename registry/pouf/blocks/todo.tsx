import { useState } from 'react'
import { Card } from '../surface'
import { Stack, Row, Spacer } from '../layout'
import { Heading, Text, Eyebrow } from '../text'
import { Checkbox } from '../checkbox'
import { Input } from '../Input'
import { Button } from '../Button'
import { Segmented } from '../Segmented'
import { Empty } from '../feedback'

interface Item {
  id: string
  text: string
  done: boolean
}

const SEED: Item[] = [
  { id: '1', text: 'Register pouf.dev', done: true },
  { id: '2', text: 'Push to GitHub', done: false },
  { id: '3', text: 'Enable Pages', done: false },
  { id: '4', text: 'Tell everyone', done: false },
]

/** An example todo list: add, filter, check off, and clear completed — with a
 *  real empty state whenever the current filter (or the whole list) has
 *  nothing to show. */
export function TodoBlock() {
  const [items, setItems] = useState(SEED)
  const [draft, setDraft] = useState('')
  const [filter, setFilter] = useState('all')

  const shown = items.filter((i) => (filter === 'active' ? !i.done : filter === 'done' ? i.done : true))
  const left = items.filter((i) => !i.done).length

  function add() {
    const text = draft.trim()
    if (!text) return
    setItems((xs) => [...xs, { id: String(xs.length + 1), text, done: false }])
    setDraft('')
  }

  function clearCompleted() {
    setItems((xs) => xs.filter((x) => !x.done))
  }

  const hasCompleted = items.some((i) => i.done)

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: 24 }}>
      <Card>
        <Stack gap={4}>
          <Stack gap={1}>
            <Eyebrow>{left} left</Eyebrow>
            <Heading level={2}>Today</Heading>
          </Stack>

          {/* A real <form> so Enter submits. `Input` exposes no onKeyDown, and
            * adding one would widen a shared component's API for a single call
            * site — whereas a form gets Enter-to-submit from the platform for
            * free. Typing a task and pressing Enter is table stakes here; a todo
            * list that only adds via a mouse click feels broken. */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              add()
            }}
          >
            <Row gap={2} wrap={false}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Input value={draft} onChange={setDraft} placeholder="Add a task…" label="New task" />
              </div>
              <Spacer />
              {/* No onClick: the form's onSubmit already runs add(), and a
                * click on a submit button fires both — which would add twice. */}
              <Button type="submit" label="Add">Add</Button>
            </Row>
          </form>

          <Row justify="between" wrap={false}>
            <Segmented
              label="Filter"
              value={filter}
              onChange={setFilter}
              options={[
                { value: 'all', label: 'All' },
                { value: 'active', label: 'Active' },
                { value: 'done', label: 'Done' },
              ]}
            />
            <Button
              size="sm"
              variant="quiet"
              disabled={!hasCompleted}
              onClick={clearCompleted}
              label="Clear completed tasks"
            >
              Clear completed
            </Button>
          </Row>

          {shown.length === 0 ? (
            <Empty icon="ok" title="Nothing here">You're all caught up.</Empty>
          ) : (
            <Stack gap={2}>
              {shown.map((i) => (
                <Row key={i.id} gap={3} wrap={false}>
                  {/* hideLabel, because the <Text> beside it already shows the
                    * task. Passing `label` alone printed the text twice on
                    * every row; dropping `label` would have left the box with
                    * no accessible name. This keeps the name and one copy. */}
                  <Checkbox
                    checked={i.done}
                    onChange={() => setItems((xs) => xs.map((x) => (x.id === i.id ? { ...x, done: !x.done } : x)))}
                    label={i.text}
                    hideLabel
                  />
                  <Text muted={i.done}>{i.text}</Text>
                </Row>
              ))}
            </Stack>
          )}
        </Stack>
      </Card>
    </div>
  )
}
