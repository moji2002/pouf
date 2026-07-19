import { useState } from 'react'
import { Card } from '../surface'
import { Stack, Row, Spacer } from '../layout'
import { Heading, Text, Eyebrow } from '../text'
import { Slider } from '../slider'
import { Button } from '../Button'
import { RowCard } from '../surface'

const QUEUE = [
  { id: '1', title: 'Marshmallow Skies', artist: 'The Poufs', len: '3:24' },
  { id: '2', title: 'Pastel Dawn', artist: 'Cushion Club', len: '4:01' },
  { id: '3', title: 'Bounce', artist: 'Claymates', len: '2:47' },
]

/** An example music player: album art, a scrubber, transport controls, and a
 * up-next queue. */
export function MusicBlock() {
  const [pos, setPos] = useState([72])
  const [playing, setPlaying] = useState(true)

  return (
    <div style={{ maxWidth: 420, margin: '0 auto', padding: 24 }}>
      <Stack gap={4}>
        <Card>
          <Stack gap={5}>
            <div style={{ aspectRatio: '1', borderRadius: 24, background: 'linear-gradient(135deg, var(--purple), var(--pink))', boxShadow: 'var(--pouf-blob)' }} />
            <Stack gap={1}>
              <Eyebrow>Now playing</Eyebrow>
              <Heading level={2}>Marshmallow Skies</Heading>
              <Text muted>The Poufs · Cushion Club</Text>
            </Stack>
            <Stack gap={2}>
              <Slider value={pos} onChange={setPos} label="Seek" />
              <Row justify="between">
                <Text size="sm" muted num>2:27</Text>
                <Text size="sm" muted num>3:24</Text>
              </Row>
            </Stack>
            <Row justify="center" gap={3}>
              <Button variant="quiet" size="lg" label="Previous">⏮</Button>
              <Button size="lg" tone="purple" label={playing ? 'Pause' : 'Play'} onClick={() => setPlaying((p) => !p)}>
                {playing ? '⏸' : '▶'}
              </Button>
              <Button variant="quiet" size="lg" label="Next">⏭</Button>
            </Row>
          </Stack>
        </Card>

        <Stack gap={2}>
          <Text size="sm" muted>Up next</Text>
          {QUEUE.map((t) => (
            <RowCard key={t.id} onClick={() => {}}>
              <Row justify="between" wrap={false}>
                <Stack gap={1}>
                  <Text>{t.title}</Text>
                  <Text size="sm" muted>{t.artist}</Text>
                </Stack>
                <Spacer />
                <Text size="sm" muted num>{t.len}</Text>
              </Row>
            </RowCard>
          ))}
        </Stack>
      </Stack>
    </div>
  )
}
