import { useState } from 'react'
import { Card } from '../surface'
import { Stack, Row, Spacer } from '../layout'
import { Heading, Text } from '../text'
import { Avatar } from '../avatar'
import { Badge, Dot } from '../media'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { Field, Textarea } from '../Input'

interface Post {
  id: string
  who: string
  handle: string
  time: string
  tone: 'purple' | 'mint' | 'blue' | 'pink'
  text: string
  likes: number
  comments: number
}

const SEED: Post[] = [
  { id: '1', who: 'Ada L.', handle: '@ada', time: '2m', tone: 'purple', text: 'The new cushion buttons press in when you click. It should not be this satisfying.', likes: 42, comments: 6 },
  { id: '2', who: 'Grace H.', handle: '@grace', time: '18m', tone: 'blue', text: 'Migrated 2,700 lines of CSS to Tailwind today with zero visual drift. The snapshot gate earned its keep.', likes: 88, comments: 12 },
  { id: '3', who: 'Katherine J.', handle: '@kat', time: '1h', tone: 'pink', text: 'Optical centering: a perfectly centered glyph looks low on a cushion. Nudge it up by half the floor lip.', likes: 31, comments: 3 },
]

/** An example social feed: a composer and a stream of post cards with reactions. */
export function FeedBlock() {
  const [posts, setPosts] = useState(SEED)
  const [draft, setDraft] = useState('')
  const [liked, setLiked] = useState<Record<string, boolean>>({})

  function post() {
    const text = draft.trim()
    if (!text) return
    setPosts((p) => [{ id: String(p.length + 1), who: 'You', handle: '@you', time: 'now', tone: 'mint', text, likes: 0, comments: 0 }, ...p])
    setDraft('')
  }

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: 24 }}>
      <Stack gap={4}>
        <Card>
          <Stack gap={3}>
            <Field label="What's on your mind?">
              {(id, describedBy) => <Textarea id={id} describedBy={describedBy} value={draft} onChange={setDraft} placeholder="Say something puffy…" rows={2} />}
            </Field>
            <Row justify="end"><Button onClick={post}>Post</Button></Row>
          </Stack>
        </Card>

        {posts.map((p) => {
          const isLiked = !!liked[p.id]
          return (
            <Card key={p.id}>
              <Stack gap={3}>
                <Row gap={2} wrap={false}>
                  <Avatar fallback={p.who.slice(0, 2)} tone={p.tone} />
                  <Stack gap={1}>
                    <Heading level={3}>{p.who}</Heading>
                    <Row gap={2} wrap={false}>
                      <Text size="sm" muted>{p.handle}</Text>
                      <Dot tone={p.tone} />
                      <Text size="sm" muted>{p.time}</Text>
                    </Row>
                  </Stack>
                </Row>
                <Text>{p.text}</Text>
                <Row gap={2}>
                  <Button size="sm" variant="quiet" tone={isLiked ? 'pink' : 'purple'} onClick={() => setLiked((l) => ({ ...l, [p.id]: !l[p.id] }))}>
                    <Icon name={isLiked ? 'heart-filled' : 'heart'} size="sm" /> {p.likes + (isLiked ? 1 : 0)}
                  </Button>
                  <Button size="sm" variant="quiet" onClick={() => {}}><Icon name="comment" size="sm" /> {p.comments}</Button>
                  <Button size="sm" variant="quiet" onClick={() => {}}><Icon name="send" size="sm" /> Share</Button>
                </Row>
              </Stack>
            </Card>
          )
        })}
      </Stack>
    </div>
  )
}
