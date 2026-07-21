import { useState } from 'react'
import { Card } from '../surface'
import { Stack, Row, Grid } from '../layout'
import { Heading, Text, Eyebrow } from '../text'
import { Avatar } from '../avatar'
import { Badge } from '../media'
import { Pagination } from '../pagination'
import { Segmented } from '../Segmented'
import { Empty } from '../feedback'

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

// 'All' plus every category the grid actually has — never hand-maintained
// against POSTS, so a new post's category shows up in the filter for free.
const CATEGORIES = ['All', ...Array.from(new Set(POSTS.map((p) => p.category)))]

function Byline({ author, date }: { author: string; date: string }) {
  return (
    <Row gap={2} wrap={false}>
      <Avatar fallback={author.slice(0, 2)} size="sm" tone="blue" />
      <Text size="sm" muted>{author} · {date}</Text>
    </Row>
  )
}

/** An example blog index: a featured post, a category filter that narrows the
 * grid, and pagination. */
export function BlogBlock() {
  const [page, setPage] = useState(1)
  const [category, setCategory] = useState('All')
  const shown = category === 'All' ? POSTS : POSTS.filter((p) => p.category === category)

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

        <Segmented
          label="Filter by category"
          value={category}
          onChange={(c) => {
            setCategory(c)
            setPage(1) // a stale page number under a shorter filtered list reads as broken pagination
          }}
          options={CATEGORIES.map((c) => ({ value: c, label: c }))}
        />

        {shown.length === 0 ? (
          <Empty icon="search" title="No posts in this category">Try a different filter.</Empty>
        ) : (
          <Grid cols={2}>
            {shown.map((p) => (
              <Card variant="tight" key={p.id}>
                <Stack gap={3}>
                  <Row><Badge tone={p.tone}>{p.category}</Badge></Row>
                  <Heading level={3}>{p.title}</Heading>
                  <Text size="sm" muted>{p.excerpt}</Text>
                  <Byline author={p.author} date={p.date} />
                </Stack>
              </Card>
            ))}
          </Grid>
        )}

        <Row justify="center">
          <Pagination page={page} total={5} onChange={setPage} />
        </Row>
      </Stack>
    </div>
  )
}
