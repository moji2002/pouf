import { useEffect, useState } from 'react'
import { Card, RowCard } from '../surface'
import { Stack, Row, Spacer } from '../layout'
import { Heading, Text, Eyebrow } from '../text'
import { Slider } from '../slider'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { Badge } from '../media'

interface Track {
  id: string
  title: string
  artist: string
  /** Seconds — the scrubber and the elapsed/remaining readout both derive
   *  from this rather than a separately-typed "3:24" string that could drift
   *  out of sync with it. */
  duration: number
}

const QUEUE: Track[] = [
  { id: '1', title: 'Marshmallow Skies', artist: 'The Poufs', duration: 204 },
  { id: '2', title: 'Pastel Dawn', artist: 'Cushion Club', duration: 241 },
  { id: '3', title: 'Bounce', artist: 'Claymates', duration: 167 },
  { id: '4', title: 'Soft Focus', artist: 'The Poufs', duration: 238 },
]

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

function IconButton({ icon, label, tone, size = 'lg', onClick }: { icon: string; label: string; tone?: 'purple'; size?: 'sm' | 'lg'; onClick?: () => void }) {
  return (
    <Button size={size} tone={tone} variant={tone ? 'solid' : 'quiet'} label={label} onClick={onClick}>
      <Icon name={icon as never} size={size === 'lg' ? 'md' : 'sm'} />
    </Button>
  )
}

/** An example music player: album art, a draggable scrubber that moves
 *  playback position, transport controls that actually change track, and a
 *  queue you can select from. */
export function MusicBlock() {
  const [queueIndex, setQueueIndex] = useState(0)
  // Position as a percent (0-100), like the Slider itself wants — 72 lines
  // up with the seeded track's 204s duration so the readout below starts at
  // a believable 2:27 rather than 0:00.
  const [pos, setPos] = useState([72])
  const [vol, setVol] = useState([60])
  /* Starts paused on purpose. This block is embedded in a gallery page, and a
   * transport that begins ticking on mount is motion nobody asked for: it
   * re-renders once a second forever, cycles the queue unattended, and ignores
   * prefers-reduced-motion. Paused also makes Play the obvious thing to press,
   * which demonstrates the feature better than arriving mid-song. */
  const [playing, setPlaying] = useState(false)

  const track = QUEUE[queueIndex]!
  const elapsed = Math.round((pos[0]! / 100) * track.duration)

  function goTo(index: number) {
    setQueueIndex(((index % QUEUE.length) + QUEUE.length) % QUEUE.length)
    setPos([0])
  }

  // Ticks the scrubber forward once a second while playing — a scrubber that
  // never moves on its own reads as a static progress bar, not a transport.
  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => {
      setPos(([p]) => {
        const next = (p ?? 0) + 100 / track.duration
        return [Math.min(100, next)]
      })
    }, 1000)
    return () => clearInterval(id)
  }, [playing, track.duration])

  // Reaching the end advances the queue rather than just sitting at 100% —
  // kept separate from the ticking effect so the interval callback stays a
  // pure function of "add one second", not a queue-mutating one.
  useEffect(() => {
    if (pos[0]! >= 100) goTo(queueIndex + 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pos])

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
                <Heading level={2}>{track.title}</Heading>
                <Text muted>{track.artist}</Text>
              </Stack>
              <IconButton icon="heart" label="Like" />
            </Row>
            <Stack gap={2}>
              <Slider value={pos} onChange={setPos} label="Seek" />
              <Row justify="between">
                <Text size="sm" muted num>{formatTime(elapsed)}</Text>
                <Text size="sm" muted num>{formatTime(track.duration)}</Text>
              </Row>
            </Stack>
            <Row justify="center" gap={3}>
              <IconButton icon="rewind" label="Previous" onClick={() => goTo(queueIndex - 1)} />
              <IconButton icon={playing ? 'pause' : 'play'} label={playing ? 'Pause' : 'Play'} tone="purple" onClick={() => setPlaying((p) => !p)} />
              <IconButton icon="forward" label="Next" onClick={() => goTo(queueIndex + 1)} />
            </Row>
            <Row gap={3} wrap={false} align="center">
              <Icon name="wind" size="sm" />
              <div style={{ flex: 1, minWidth: 0 }}><Slider value={vol} onChange={setVol} label="Volume" /></div>
            </Row>
          </Stack>
        </Card>

        <Stack gap={2}>
          <Eyebrow>Up next</Eyebrow>
          {QUEUE.map((t, idx) => (
            <RowCard
              key={t.id}
              onClick={() => {
                setQueueIndex(idx)
                setPos([0])
                setPlaying(true)
              }}
              selected={idx === queueIndex}
            >
              <Row justify="between" wrap={false}>
                <Row gap={3} wrap={false}>
                  <Icon name={idx === queueIndex ? 'music' : 'play'} size="sm" />
                  <Stack gap={1}>
                    <Text>{t.title}</Text>
                    <Text size="sm" muted>{t.artist}</Text>
                  </Stack>
                </Row>
                <Spacer />
                <Text size="sm" muted num>{formatTime(t.duration)}</Text>
              </Row>
            </RowCard>
          ))}
        </Stack>
      </Stack>
    </div>
  )
}
