import { useState } from 'react'
import { Card } from '../surface'
import { Stack, Row, Grid } from '../layout'
import { Heading, Text, Eyebrow } from '../text'
import { Avatar } from '../avatar'
import { Badge } from '../media'
import { Pagination } from '../pagination'

interface Post {
  id: string
  category: string
  title: string
  excerpt: string
  author: string
  date: string
  tone: 'purple' | 'mint' | 'blue' | 'pink'
}

const FEATURED: Post = {
  id: '0', category: 'Design', tone: 'purple',
  title: 'Why depth beats flat', excerpt: 'Flat design threw away the one signal users feel before they read: elevation. Here is the case for putting it back — carefully.',
  author: 'Ada L.', date: 'Jul 18',
}

const POSTS: Post[] = [
  { id: '1', category: 'Engineering', tone: 'blue', title: 'Migrating 2,700 lines of CSS to Tailwind, safely', excerpt: 'A snapshot gate that diffs computed styles let us refactor with zero visual drift.', author: 'Grace H.', date: 'Jul 15' },
  { id: '2', category: 'Product', tone: 'mint', title: 'Variants, not classNames', excerpt: 'How a strict component API keeps a whole app on-system without anyone policing it.', author: 'Alan T.', date: 'Jul 11' },
  { id: '3', category: 'Craft', tone: 'pink', title: 'Optical centering, and why math lies', excerpt: 'A perfectly centered glyph looks low on a cushion. The fix is half the floor lip.', author: 'Katherine J.', date: 'Jul 8' },
  { id: '4', category: 'Design', tone: 'purple', title: 'Pastel that passes WCAG', excerpt: 'Ink on pastel, never white — the one deviation from the reference, and the measurements behind it.', author: 'Ada L.', date: 'Jul 2' },
]

function Byline({ author, date }: { author: string; date: string }) {
  return (
    <Row gap={2} wrap={false}>
      <Avatar fallback={author.slice(0, 2)} size="sm" tone="blue" />
      <Text size="sm" muted>{author} · {date}</Text>
    </Row>
  )
}

/** An example blog index: a featured post and a grid of cards with categories,
 * bylines, and pagination. */
export function BlogBlock() {
  const [page, setPage] = useState(1)
  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: 24 }}>
      <Stack gap={6}>
        <Stack gap={2}>
          <Eyebrow>The Pouf blog</Eyebrow>
          <Heading level={1}>Notes on soft software</Heading>
        </Stack>

        <Card>
          <Grid cols="sidebar">
            <Stack gap={3}>
              <Badge tone={FEATURED.tone}>{FEATURED.category}</Badge>
              <Heading level={2}>{FEATURED.title}</Heading>
              <Text muted>{FEATURED.excerpt}</Text>
              <Byline author={FEATURED.author} date={FEATURED.date} />
            </Stack>
            <div style={{ borderRadius: 20, background: 'var(--purple)', minHeight: 160, boxShadow: 'var(--pouf-blob)' }} />
          </Grid>
        </Card>

        <Grid cols={2}>
          {POSTS.map((p) => (
            <Card variant="tight">
              <Stack gap={3}>
                <Row><Badge tone={p.tone}>{p.category}</Badge></Row>
                <Heading level={3}>{p.title}</Heading>
                <Text size="sm" muted>{p.excerpt}</Text>
                <Byline author={p.author} date={p.date} />
              </Stack>
            </Card>
          ))}
        </Grid>

        <Row justify="center">
          <Pagination page={page} total={5} onChange={setPage} />
        </Row>
      </Stack>
    </div>
  )
}
