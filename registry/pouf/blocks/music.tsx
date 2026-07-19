import { useState } from 'react'
import { Card, RowCard } from '../surface'
import { Stack, Row, Spacer } from '../layout'
import { Heading, Text, Eyebrow } from '../text'
import { Slider } from '../slider'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { Badge } from '../media'

const QUEUE = [
  { id: '1', title: 'Marshmallow Skies', artist: 'The Poufs', len: '3:24', playing: true },
  { id: '2', title: 'Pastel Dawn', artist: 'Cushion Club', len: '4:01', playing: false },
  { id: '3', title: 'Bounce', artist: 'Claymates', len: '2:47', playing: false },
  { id: '4', title: 'Soft Focus', artist: 'The Poufs', len: '3:58', playing: false },
]

function IconButton({ icon, label, tone, size = 'lg', onClick }: { icon: string; label: string; tone?: 'purple'; size?: 'sm' | 'lg'; onClick?: () => void }) {
  return (
    <Button size={size} tone={tone} variant={tone ? 'solid' : 'quiet'} label={label} onClick={onClick}>
      <Icon name={icon as never} size={size === 'lg' ? 'md' : 'sm'} />
    </Button>
  )
}

/** An example music player: album art, a scrubber, transport controls, and a
 * play queue. */
export function MusicBlock() {
  const [pos, setPos] = useState([72])
  const [vol, setVol] = useState([60])
  const [playing, setPlaying] = useState(true)

  return (
    <div style={{ maxWidth: 440, margin: '0 auto', padding: 24 }}>
      <Stack gap={4}>
        <Card>
          <Stack gap={5}>
            <div style={{ position: 'relative' }}>
              <div style={{ aspectRatio: '1', borderRadius: 24, background: 'linear-gradient(135deg, var(--purple), var(--pink))', boxShadow: 'var(--pouf-blob)' }} />
              <div style={{ position: 'absolute', top: 14, left: 14 }}><Badge tone="mint">Now playing</Badge></div>
            </div>
            <Row justify="between" align="top">
              <Stack gap={1}>
                <Heading level={2}>Marshmallow Skies</Heading>
                <Text muted>The Poufs — Cushion Club</Text>
              </Stack>
              <IconButton icon="heart" label="Like" />
            </Row>
            <Stack gap={2}>
              <Slider value={pos} onChange={setPos} label="Seek" />
              <Row justify="between">
                <Text size="sm" muted num>2:27</Text>
                <Text size="sm" muted num>3:24</Text>
              </Row>
            </Stack>
            <Row justify="center" gap={3}>
              <IconButton icon="rewind" label="Previous" />
              <IconButton icon={playing ? 'pause' : 'play'} label={playing ? 'Pause' : 'Play'} tone="purple" onClick={() => setPlaying((p) => !p)} />
              <IconButton icon="forward" label="Next" />
            </Row>
            <Row gap={3} wrap={false} align="center">
              <Icon name="wind" size="sm" />
              <div style={{ flex: 1, minWidth: 0 }}><Slider value={vol} onChange={setVol} label="Volume" /></div>
            </Row>
          </Stack>
        </Card>

        <Stack gap={2}>
          <Eyebrow>Up next</Eyebrow>
          {QUEUE.map((t) => (
            <RowCard key={t.id} onClick={() => {}} selected={t.playing}>
              <Row justify="between" wrap={false}>
                <Row gap={3} wrap={false}>
                  <Icon name={t.playing ? 'music' : 'play'} size="sm" />
                  <Stack gap={1}>
                    <Text>{t.title}</Text>
                    <Text size="sm" muted>{t.artist}</Text>
                  </Stack>
                </Row>
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
