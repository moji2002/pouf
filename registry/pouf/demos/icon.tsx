import { Icon } from '../Icon'
import type { IconName } from '../Icon'
import { Row, Stack } from '../layout'
import { Text } from '../text'
import type { Demo } from './types'

/** `satisfies Record<IconName, true>` keeps this exhaustive: add a glyph to
 * Icon.tsx's ICONS and omit it here and this file stops compiling. */
const ICON_ROLES = {
  overview: true, chart: true, log: true, channels: true, activity: true, lab: true, history: true,
  performance: true, settings: true, database: true, menu: true, up: true, down: true, flat: true, ok: true,
  warn: true, fail: true, info: true, idle: true, off: true, live: true, draft: true, target: true, alerts: true,
  add: true, remove: true, search: true, close: true, expand: true, prev: true, next: true, photo: true,
  heart: true, 'heart-filled': true, comment: true, play: true, pause: true, rewind: true, forward: true,
  sun: true, cloud: true, rain: true, star: true, calendar: true, clock: true, user: true, users: true,
  mail: true, lock: true, send: true, home: true, trophy: true, flame: true, sparkle: true, music: true,
  cart: true, tag: true, dots: true, sword: true, shield: true, wand: true, smile: true, card: true,
  pin: true, wind: true, drop: true,
} satisfies Record<IconName, true>
const ICON_NAMES = Object.keys(ICON_ROLES) as IconName[]

export const iconDemos: Demo[] = [
  { id: 'all', render: () => (
      <Row gap={4}>
        {ICON_NAMES.map((name) => (
          <Stack key={name} gap={1}>
            <Row justify="center"><Icon name={name} /></Row>
            <Text size="sm" muted mono>{name}</Text>
          </Stack>
        ))}
      </Row>
    ) },
  { id: 'sizes', render: () => (
      <Row gap={4}>
        <Icon name="settings" size="sm" />
        <Icon name="settings" size="md" />
        <Icon name="settings" size="lg" />
      </Row>
    ) },
  { id: 'labelled', render: () => <Icon name="ok" label="Connected" /> },
]
