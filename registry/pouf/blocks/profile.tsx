import { useState } from 'react'
import { Card } from '../surface'
import { Stack, Row, Grid } from '../layout'
import { Heading, Text, Eyebrow } from '../text'
import { Avatar } from '../avatar'
import { Badge, Dot } from '../media'
import { Metric } from '../readout'
import { Button } from '../Button'
import { Tabs } from '../disclosure'

/** An example profile page: header with avatar and stats, then tabbed content. */
export function ProfileBlock() {
  const [tab, setTab] = useState('posts')
  const [following, setFollowing] = useState(false)

  const posts = (
    <Stack gap={3}>
      {['Shipped the new cushion buttons 🎉', 'Optical centering is a rabbit hole', 'Pastel that passes WCAG — a thread'].map((p, i) => (
        <Card variant="tight" key={i}>
          <Stack gap={2}>
            <Text>{p}</Text>
            <Row gap={3}>
              <Text size="sm" muted>♥ {12 * (i + 1)}</Text>
              <Text size="sm" muted>💬 {i + 1}</Text>
            </Row>
          </Stack>
        </Card>
      ))}
    </Stack>
  )

  const about = (
    <Stack gap={3}>
      <Text>Designer & engineer. Making software that feels like it wants to be touched. Currently building Pouf.</Text>
      <Row gap={2}>
        <Badge tone="mint">Design systems</Badge>
        <Badge tone="blue">React</Badge>
        <Badge tone="pink">Motion</Badge>
      </Row>
    </Stack>
  )

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: 24 }}>
      <Card>
        <Stack gap={5}>
          <Row justify="between" align="top">
            <Row gap={3} wrap={false} align="top">
              <Avatar fallback="AL" size="lg" tone="purple" />
              <Stack gap={1}>
                <Heading level={2}>Ada Lovelace</Heading>
                <Eyebrow>@ada</Eyebrow>
                <Row gap={2} wrap={false}>
                  <Dot tone="mint" />
                  <Text size="sm" muted>Active now</Text>
                </Row>
              </Stack>
            </Row>
            <Button tone={following ? 'mint' : 'purple'} variant={following ? 'quiet' : 'solid'} onClick={() => setFollowing((f) => !f)}>
              {following ? 'Following' : 'Follow'}
            </Button>
          </Row>

          <Grid cols={3}>
            <Metric label="Posts" value="128" />
            <Metric label="Followers" value="4,201" />
            <Metric label="Following" value="312" />
          </Grid>

          <Tabs
            value={tab}
            onChange={setTab}
            tabs={[
              { value: 'posts', label: 'Posts', content: posts },
              { value: 'about', label: 'About', content: about },
            ]}
          />
        </Stack>
      </Card>
    </div>
  )
}
