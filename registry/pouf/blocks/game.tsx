import { useState } from 'react'
import { Card } from '../surface'
import { Stack, Row, Grid } from '../layout'
import { Heading, Text, Eyebrow } from '../text'
import { Stat } from '../readout'
import { Badge } from '../media'
import { Progress } from '../progress'
import { Button } from '../Button'
import { Table } from '../table'
import { Icon } from '../Icon'

const LEADERS = [
  { id: '1', rank: '1', name: 'PixelWizard', score: '48,210' },
  { id: '2', rank: '2', name: 'You', score: '41,980' },
  { id: '3', rank: '3', name: 'Bouncer', score: '38,455' },
  { id: '4', rank: '4', name: 'ClayFace', score: '30,102' },
]

/** An example game HUD: score, health and XP bars, a level badge, action
 * buttons, and a leaderboard — built from Pouf primitives. */
export function GameBlock() {
  const [hp, setHp] = useState(72)
  const [xp, setXp] = useState(40)

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: 24 }}>
      <Stack gap={5}>
        <Row justify="between">
          <Stack gap={1}>
            <Eyebrow>Level 7 · Cushion Caverns</Eyebrow>
            <Heading level={1}>Boss fight</Heading>
          </Stack>
          <Badge tone="yellow"><Icon name="star" size="sm" /> 1,240</Badge>
        </Row>

        <Grid cols={2}>
          <Stat label="Score" value="41,980" icon="target" tone="purple" />
          <Stat label="Combo" value="×12" icon="up" tone="mint" />
        </Grid>

        <Card>
          <Stack gap={4}>
            <Stack gap={2}>
              <Row justify="between">
                <Text>Health</Text>
                <Text num muted>{hp} / 100</Text>
              </Row>
              <Progress value={hp} tone="pink" label="Health" />
            </Stack>
            <Stack gap={2}>
              <Row justify="between">
                <Text>XP to next level</Text>
                <Text num muted>{xp} / 100</Text>
              </Row>
              <Progress value={xp} tone="blue" label="Experience" />
            </Stack>
            <Row gap={2}>
              <Button tone="pink" onClick={() => setHp((h) => Math.max(0, h - 15))}>Attack</Button>
              <Button tone="blue" onClick={() => setXp((x) => Math.min(100, x + 20))}>Cast spell</Button>
              <Button tone="mint" variant="quiet" onClick={() => setHp((h) => Math.min(100, h + 25))}>Heal</Button>
            </Row>
          </Stack>
        </Card>

        <Card>
          <Stack gap={4}>
            <Heading level={3}>Leaderboard</Heading>
            <Table
              rows={LEADERS}
              getKey={(r) => r.id}
              columns={[
                { key: 'rank', header: '#', render: (r) => <Badge tone={r.name === 'You' ? 'mint' : 'purple'}>{r.rank}</Badge> },
                { key: 'name', header: 'Player', render: (r) => <Text>{r.name}</Text> },
                { key: 'score', header: 'Score', align: 'right', mono: true, render: (r) => <Text num>{r.score}</Text> },
              ]}
            />
          </Stack>
        </Card>
      </Stack>
    </div>
  )
}
