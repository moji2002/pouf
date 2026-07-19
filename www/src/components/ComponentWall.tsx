import { useState } from 'react'
import { Button } from '../../../registry/pouf/Button'
import { Switch } from '../../../registry/pouf/controls'
import { Checkbox } from '../../../registry/pouf/checkbox'
import { Slider } from '../../../registry/pouf/slider'
import { Segmented } from '../../../registry/pouf/Segmented'
import { Badge, Blob, Dot } from '../../../registry/pouf/media'
import { Avatar } from '../../../registry/pouf/avatar'
import { Progress } from '../../../registry/pouf/progress'
import { Stack, Row } from '../../../registry/pouf/layout'
import { Text } from '../../../registry/pouf/text'
import { NumberInput } from '../../../registry/pouf/NumberInput'
import { RadioGroup } from '../../../registry/pouf/radiogroup'

const TONES = ['purple', 'pink', 'blue', 'mint', 'yellow', 'orange'] as const

function Tile({ label, children, span = 1 }: { label: string; children: React.ReactNode; span?: number }) {
  return (
    <div
      style={{
        gridColumn: `span ${span}`,
        background: 'var(--surface)',
        borderRadius: 24,
        padding: 20,
        boxShadow: 'var(--pouf-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        minWidth: 0,
      }}
    >
      <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--muted)' }}>{label}</span>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', flex: 1 }}>{children}</div>
    </div>
  )
}

/** A dense wall of live components — the landing's proof-of-breadth. Every tile
 * is real and interactive. */
export function ComponentWall() {
  const [on, setOn] = useState(true)
  const [checked, setChecked] = useState<boolean | 'indeterminate'>(true)
  const [vol, setVol] = useState([65])
  const [seg, setSeg] = useState('b')
  const [qty, setQty] = useState('3')
  const [plan, setPlan] = useState('pro')

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 16 }} className="wall">
      <Tile label="Buttons" span={2}>
        {TONES.slice(0, 4).map((t) => (
          <Button key={t} tone={t} size="sm">{t}</Button>
        ))}
        <Button variant="quiet" size="sm">quiet</Button>
      </Tile>

      <Tile label="Tones" span={2}>
        {TONES.map((t) => (
          <Blob key={t} tone={t} icon="heart-filled" size="sm" />
        ))}
      </Tile>

      <Tile label="Switch">
        <Switch checked={on} onChange={setOn} label="Notifications" />
      </Tile>
      <Tile label="Checkbox">
        <Checkbox checked={checked} onChange={setChecked} label="Agree" />
      </Tile>
      <Tile label="Badges" span={2}>
        <Badge tone="mint">Live</Badge>
        <Badge tone="pink">New</Badge>
        <Badge tone="blue">Beta</Badge>
      </Tile>

      <Tile label="Slider" span={2}>
        <div style={{ width: '100%' }}><Slider value={vol} onChange={setVol} label="Volume" /></div>
      </Tile>
      <Tile label="Segmented" span={2}>
        <Segmented
          label="View"
          value={seg}
          onChange={setSeg}
          options={[{ value: 'a', label: 'Day' }, { value: 'b', label: 'Week' }, { value: 'c', label: 'Month' }]}
        />
      </Tile>

      <Tile label="Avatars" span={2}>
        <Avatar fallback="AL" tone="purple" />
        <Avatar fallback="GH" tone="mint" />
        <Avatar icon="user" tone="blue" />
        <Row gap={2} wrap={false}><Dot tone="mint" /><Text size="sm" muted>Online</Text></Row>
      </Tile>
      <Tile label="Stepper">
        <NumberInput value={qty} onChange={setQty} min={0} max={10} />
      </Tile>
      <Tile label="Progress">
        <div style={{ width: '100%' }}>
          <Stack gap={2}>
            <Progress value={72} tone="mint" label="XP" />
            <Progress value={38} tone="pink" label="HP" />
          </Stack>
        </div>
      </Tile>

      <Tile label="Radio" span={2}>
        <RadioGroup
          label="Plan"
          value={plan}
          onChange={setPlan}
          options={[{ value: 'free', label: 'Free' }, { value: 'pro', label: 'Pro' }]}
        />
      </Tile>
      <Tile label="Loading" span={2}>
        <Button loading size="sm">Saving</Button>
        <Button tone="mint" size="sm">Done</Button>
      </Tile>
    </div>
  )
}
