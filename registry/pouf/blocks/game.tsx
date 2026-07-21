import { useState } from 'react'
import { Card, RowCard } from '../surface'
import { Stack, Row, Grid } from '../layout'
import { Heading, Text, Eyebrow } from '../text'
import { Stat } from '../readout'
import { Badge, Blob } from '../media'
import { Progress } from '../progress'
import { Button } from '../Button'
import { Table } from '../table'
import { Icon } from '../Icon'

const OTHER_LEADERS = [
  { id: '1', name: 'PixelWizard', score: 48210 },
  { id: '3', name: 'Bouncer', score: 38455 },
  { id: '4', name: 'ClayFace', score: 30102 },
]

// One uniform shape across every slot (unused numbers default to 0) so an
// item's stats read directly off `ITEMS.find(...)` with no per-slot narrowing.
const ITEMS = [
  { id: 'sword', name: 'Iron Sword', desc: '+15 dmg · costs 12 HP', icon: 'sword', tone: 'orange' as const, slot: 'weapon' as const, atk: 15, hpCost: 12, block: 0, heal: 0, xpBoost: 0 },
  { id: 'wand', name: 'Clay Wand', desc: '+24 dmg · costs 20 HP', icon: 'wand', tone: 'purple' as const, slot: 'weapon' as const, atk: 24, hpCost: 20, block: 0, heal: 0, xpBoost: 0 },
  { id: 'shield', name: 'Oak Shield', desc: 'Blocks 10 HP of recoil', icon: 'shield', tone: 'blue' as const, slot: 'armor' as const, atk: 0, hpCost: 0, block: 10, heal: 0, xpBoost: 0 },
  { id: 'potion', name: 'Health Potion', desc: 'Restores 30 HP · single use', icon: 'drop', tone: 'pink' as const, slot: 'consumable' as const, atk: 0, hpCost: 0, block: 0, heal: 30, xpBoost: 0 },
  { id: 'charm', name: 'XP Charm', desc: '+10 XP per spell cast', icon: 'sparkle', tone: 'yellow' as const, slot: 'accessory' as const, atk: 0, hpCost: 0, block: 0, heal: 0, xpBoost: 10 },
]

/** An example game HUD: score, health and XP bars, an inventory, and a
 * leaderboard. Equipping a weapon or armor changes what Attack costs and
 * deals, the potion and charm act directly on the bars, and the score you
 * earn updates your own live rank in the leaderboard below. */
export function GameBlock() {
  const [hp, setHp] = useState(72)
  const [xp, setXp] = useState(40)
  const [score, setScore] = useState(41980)
  const [weapon, setWeapon] = useState<string | null>('sword')
  const [armor, setArmor] = useState<string | null>(null)
  const [accessory, setAccessory] = useState<string | null>(null)
  const [potionUsed, setPotionUsed] = useState(false)

  const equippedWeapon = ITEMS.find((i) => i.id === weapon)
  const equippedArmor = ITEMS.find((i) => i.id === armor)
  const equippedAccessory = ITEMS.find((i) => i.id === accessory)

  function attack() {
    const cost = Math.max(4, (equippedWeapon?.hpCost ?? 10) - (equippedArmor?.block ?? 0))
    setHp((h) => Math.max(0, h - cost))
    setScore((s) => s + (equippedWeapon?.atk ?? 8) * 10)
  }

  function cast() {
    setXp((x) => Math.min(100, x + 20 + (equippedAccessory?.xpBoost ?? 0)))
  }

  function heal() {
    setHp((h) => Math.min(100, h + 25))
  }

  function toggleItem(item: (typeof ITEMS)[number]) {
    if (item.slot === 'weapon') setWeapon((w) => (w === item.id ? null : item.id))
    else if (item.slot === 'armor') setArmor((a) => (a === item.id ? null : item.id))
    else if (item.slot === 'accessory') setAccessory((a) => (a === item.id ? null : item.id))
    else if (!potionUsed) {
      setHp((h) => Math.min(100, h + item.heal))
      setPotionUsed(true)
    }
  }

  // "You" carries the live score, so a good Attack visibly moves your rank.
  const leaders = [...OTHER_LEADERS, { id: '2', name: 'You', score }]
    .sort((a, b) => b.score - a.score)
    .map((l, i) => ({ ...l, rank: String(i + 1) }))

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
          <Stat label="Score" value={score.toLocaleString()} icon="target" tone="purple" />
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
              <Button tone="pink" onClick={attack}>Attack</Button>
              <Button tone="blue" onClick={cast}>Cast spell</Button>
              <Button tone="mint" variant="quiet" onClick={heal}>Heal</Button>
            </Row>
          </Stack>
        </Card>

        <Card>
          <Stack gap={4}>
            <Heading level={3}>Inventory</Heading>
            <Stack gap={2}>
              {ITEMS.map((item) => {
                const equipped = item.slot === 'weapon'
                  ? weapon === item.id
                  : item.slot === 'armor'
                  ? armor === item.id
                  : item.slot === 'accessory'
                  ? accessory === item.id
                  : potionUsed
                const disabled = item.slot === 'consumable' && potionUsed
                return (
                  <RowCard key={item.id} selected={equipped} onClick={disabled ? undefined : () => toggleItem(item)}>
                    <Row justify="between" wrap={false}>
                      <Row gap={3} wrap={false}>
                        <Blob icon={item.icon as never} tone={item.tone} size="sm" />
                        <Stack gap={1}>
                          <Text>{item.name}</Text>
                          <Text size="sm" muted>{item.desc}</Text>
                        </Stack>
                      </Row>
                      <Badge tone={equipped ? 'mint' : 'purple'}>
                        {item.slot === 'consumable' ? (potionUsed ? 'Used' : 'Use') : equipped ? 'Equipped' : 'Equip'}
                      </Badge>
                    </Row>
                  </RowCard>
                )
              })}
            </Stack>
          </Stack>
        </Card>

        <Card>
          <Stack gap={4}>
            <Heading level={3}>Leaderboard</Heading>
            <Table
              rows={leaders}
              getKey={(r) => r.id}
              columns={[
                { key: 'rank', header: '#', render: (r) => <Badge tone={r.name === 'You' ? 'mint' : 'purple'}>{r.rank}</Badge> },
                { key: 'name', header: 'Player', render: (r) => <Text>{r.name}</Text> },
                { key: 'score', header: 'Score', align: 'right', mono: true, render: (r) => <Text num>{r.score.toLocaleString()}</Text> },
              ]}
            />
          </Stack>
        </Card>
      </Stack>
    </div>
  )
}
