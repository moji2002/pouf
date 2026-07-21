import { useState } from 'react'
import { Card } from '../surface'
import { Stack, Row, Spacer } from '../layout'
import { Heading, Text } from '../text'
import { Avatar } from '../avatar'
import { Badge, Dot } from '../media'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { Field, Input, Textarea } from '../Input'

interface Comment {
  id: string
  who: string
  text: string
}

interface Post {
  id: string
  who: string
  handle: string
  time: string
  tone: 'purple' | 'mint' | 'blue' | 'pink'
  text: string
  likes: number
  comments: Comment[]
}

const SEED: Post[] = [
  {
    id: '1', who: 'Ada L.', handle: '@ada', time: '2m', tone: 'purple',
    text: 'The new cushion buttons press in when you click. It should not be this satisfying.', likes: 42,
    comments: [
      { id: 'c1', who: 'Grace H.', text: 'Right? I built one for a login button and now nobody will let me remove it.' },
      { id: 'c2', who: 'Katherine J.', text: 'It is the sound design of buttons.' },
    ],
  },
  {
    id: '2', who: 'Grace H.', handle: '@grace', time: '18m', tone: 'blue',
    text: 'Migrated 2,700 lines of CSS to Tailwind today with zero visual drift. The snapshot gate earned its keep.', likes: 88,
    comments: [{ id: 'c1', who: 'Ada L.', text: 'Zero drift is the whole pitch. Nice work.' }],
  },
  {
    id: '3', who: 'Katherine J.', handle: '@kat', time: '1h', tone: 'pink',
    text: 'Optical centering: a perfectly centered glyph looks low on a cushion. Nudge it up by half the floor lip.', likes: 31,
    comments: [{ id: 'c1', who: 'Ada L.', text: 'The floor lip strikes again.' }],
  },
]

/** An example social feed: a composer that prepends to the stream, and post
 * cards you can like and comment on — each comment button opens a real
 * thread with its own input. */
export function FeedBlock() {
  const [posts, setPosts] = useState(SEED)
  const [draft, setDraft] = useState('')
  const [liked, setLiked] = useState<Record<string, boolean>>({})
  const [openThread, setOpenThread] = useState<Record<string, boolean>>({})
  /* Share was the last `onClick={() => {}}` in the gallery. A button that looks
   * live and does nothing is the exact complaint this pass exists to fix, so it
   * now latches into a real state rather than being deleted. */
  const [shared, setShared] = useState<Record<string, boolean>>({})
  const [replyDraft, setReplyDraft] = useState<Record<string, string>>({})

  function post() {
    const text = draft.trim()
    if (!text) return
    setPosts((p) => [{ id: String(p.length + 1), who: 'You', handle: '@you', time: 'now', tone: 'mint', text, likes: 0, comments: [] }, ...p])
    setDraft('')
  }

  function reply(postId: string) {
    const text = (replyDraft[postId] ?? '').trim()
    if (!text) return
    setPosts((ps) =>
      ps.map((p) =>
        p.id === postId
          ? { ...p, comments: [...p.comments, { id: String(p.comments.length + 1), who: 'You', text }] }
          : p,
      ),
    )
    setReplyDraft((d) => ({ ...d, [postId]: '' }))
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
          const isOpen = !!openThread[p.id]
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
                  {/* `label` on each of these is not optional politeness: the
                    * visible child is an icon plus a bare number, so without it
                    * a screen reader announces "button, 42" and the action is
                    * anybody's guess. */}
                  <Button
                    size="sm"
                    variant="quiet"
                    tone={isLiked ? 'pink' : 'purple'}
                    label={isLiked ? `Unlike ${p.who}'s post` : `Like ${p.who}'s post`}
                    onClick={() => setLiked((l) => ({ ...l, [p.id]: !l[p.id] }))}
                  >
                    <Icon name={isLiked ? 'heart-filled' : 'heart'} size="sm" /> {p.likes + (isLiked ? 1 : 0)}
                  </Button>
                  <Button
                    size="sm"
                    variant="quiet"
                    tone={isOpen ? 'blue' : 'purple'}
                    label={`${isOpen ? 'Hide' : 'Show'} ${p.comments.length} comments`}
                    onClick={() => setOpenThread((o) => ({ ...o, [p.id]: !o[p.id] }))}
                  >
                    <Icon name="comment" size="sm" /> {p.comments.length}
                  </Button>
                  <Button
                    size="sm"
                    variant="quiet"
                    tone={shared[p.id] ? 'mint' : 'purple'}
                    disabled={!!shared[p.id]}
                    label={shared[p.id] ? 'Already shared' : `Share ${p.who}'s post`}
                    onClick={() => setShared((s) => ({ ...s, [p.id]: true }))}
                  >
                    <Icon name={shared[p.id] ? 'ok' : 'send'} size="sm" /> {shared[p.id] ? 'Shared' : 'Share'}
                  </Button>
                </Row>

                {isOpen && (
                  // Indented under the avatar column, the way a reply nests under its parent.
                  <div style={{ paddingLeft: 48 }}>
                    <Stack gap={3}>
                      {p.comments.map((c) => (
                        <Row key={c.id} gap={2} wrap={false} align="top">
                          <Avatar fallback={c.who.slice(0, 2)} size="sm" tone={p.tone} />
                          <Stack gap={1}>
                            <Text size="sm">{c.who}</Text>
                            <Text size="sm" muted>{c.text}</Text>
                          </Stack>
                        </Row>
                      ))}
                      <Row gap={2} wrap={false}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <Input
                            value={replyDraft[p.id] ?? ''}
                            onChange={(v) => setReplyDraft((d) => ({ ...d, [p.id]: v }))}
                            placeholder="Write a comment…"
                            label={`Comment on ${p.who}'s post`}
                          />
                        </div>
                        <Button size="sm" onClick={() => reply(p.id)} label="Reply">Reply</Button>
                      </Row>
                    </Stack>
                  </div>
                )}
              </Stack>
            </Card>
          )
        })}
      </Stack>
    </div>
  )
}
