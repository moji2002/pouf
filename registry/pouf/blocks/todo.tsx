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

/** An example todo list: add, filter, check off. */
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

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: 24 }}>
      <Card>
        <Stack gap={4}>
          <Stack gap={1}>
            <Eyebrow>{left} left</Eyebrow>
            <Heading level={2}>Today</Heading>
          </Stack>

          <Row gap={2} wrap={false}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Input value={draft} onChange={setDraft} placeholder="Add a task…" label="New task" />
            </div>
            <Spacer />
            <Button onClick={add} label="Add">Add</Button>
          </Row>

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

          {shown.length === 0 ? (
            <Empty icon="ok" title="Nothing here">You're all caught up.</Empty>
          ) : (
            <Stack gap={2}>
              {shown.map((i) => (
                <Row key={i.id} gap={3} wrap={false}>
                  <Checkbox
                    checked={i.done}
                    onChange={() => setItems((xs) => xs.map((x) => (x.id === i.id ? { ...x, done: !x.done } : x)))}
                    label={i.text}
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
