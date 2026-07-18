import {
  IconAlertTriangle,
  IconAntennaBars5,
  IconArrowDown,
  IconArrowUp,
  IconBell,
  IconBolt,
  IconBrandTelegram,
  IconChartCandle,
  IconCheck,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconCircleDot,
  IconCircleOff,
  IconCircleX,
  IconClipboardList,
  IconDatabase,
  IconFlask,
  IconGauge,
  IconHistory,
  IconInfoCircle,
  IconLayoutGrid,
  IconMinus,
  IconPencil,
  IconPhoto,
  IconPlus,
  IconSearch,
  IconSettings,
  IconTargetArrow,
  IconTrash,
  IconTrendingUp,
  IconX,
  type IconProps,
} from '@tabler/icons-react'
import type { ComponentType } from 'react'

/** The icon set, as a closed vocabulary.
 *
 * Screens name a ROLE ("the thing that means paper mode"), never an import, so
 * swapping the icon library — or just one glyph — happens here and nowhere else.
 * That is the same rule the rest of pouf follows: change a primitive, change the
 * whole UI.
 *
 * These replaced emoji. Emoji are font-dependent (a ⚡ is a different shape, size
 * and colour on every OS, and some render as full-colour images that fight a
 * pastel palette), they can't inherit currentColor, and their accessible name
 * varies by platform. A stroked SVG set is consistent, colourable, and sizes
 * predictably against text.
 *
 * ONE GLYPH, ONE ROLE. Two roles sharing a glyph is a bug, not a saving: it
 * makes the UI claim two things are the same when they aren't, and it booby-traps
 * the next edit (changing the glyph for one role silently changes the other).
 * Both instances that existed here were exactly that: `positions` and `live`
 * both drew a bolt, and `expand` was the Select's chevron AND the Menu tab. Keep
 * this map injective — if two roles want one picture, they are probably one role.
 */
const ICONS = {
  // nav
  overview: IconGauge,
  // A candlestick, not a bolt: these are open trades, not speed. It shares the
  // chart family with `performance`, which is survivable — bars vs. an arrow —
  // and it frees the bolt for `live`, where "energised" is what a bolt means.
  positions: IconChartCandle,
  log: IconClipboardList,
  // The sources genuinely are Telegram channels, and this is the glyph a reader
  // decodes instantly. It is deliberately literal: the day a signal arrives from
  // Discord, this icon is a lie and should become a speakerphone.
  channels: IconBrandTelegram,
  // Antenna bars mean "signal" with no learning required. A hash meant "tag".
  signals: IconAntennaBars5,
  paper: IconFlask,
  backtest: IconHistory,
  performance: IconTrendingUp,
  settings: IconSettings,
  // The raw-storage admin. A database cylinder, not a settings cog: this screen
  // shows what is on disk, not what the operator configured.
  database: IconDatabase,
  // The sheet this opens is titled "All screens" — a grid says that; a hamburger
  // says the vaguer "more stuff". Its own role, NOT `expand`: that one belongs to
  // Select's chevron, and sharing it would put a grid inside every dropdown.
  menu: IconLayoutGrid,
  // state
  up: IconArrowUp,
  down: IconArrowDown,
  flat: IconMinus,
  ok: IconCheck,
  warn: IconAlertTriangle,
  // An error is not a warning wearing a different background. Toasts used the
  // triangle for both, so "order failed" and "approaching loss limit" were
  // visually the same claim — only the X-in-a-circle says something DID break.
  fail: IconCircleX,
  // Informational, calmly: idle's circle-dot means "engine state", not "FYI".
  info: IconInfoCircle,
  idle: IconCircleDot,
  off: IconCircleOff,
  live: IconBolt,
  draft: IconPencil,
  target: IconTargetArrow,
  alerts: IconBell,
  // actions
  add: IconPlus,
  remove: IconTrash,
  search: IconSearch,
  close: IconX,
  expand: IconChevronDown,
  // Pagination steps sideways. It borrowed `up`/`down` — but those arrows mean
  // price direction in this app, and "previous page" is not a falling market.
  prev: IconChevronLeft,
  next: IconChevronRight,
  photo: IconPhoto,
} as const

export type IconName = keyof typeof ICONS

const SIZES = { sm: 16, md: 20, lg: 32 } as const

interface Props {
  name: IconName
  size?: keyof typeof SIZES
  /** Give a label ONLY when the icon is the sole carrier of meaning. Beside a
   *  visible text label it is decoration, and naming it makes a screen reader
   *  say everything twice. */
  label?: string
}

export function Icon({ name, size = 'md', label }: Props) {
  const Glyph = ICONS[name] as ComponentType<IconProps>
  return (
    <Glyph
      size={SIZES[size]}
      // Inherits the surrounding text colour, so an icon can never drift out of
      // contrast with the label it sits next to.
      color="currentColor"
      stroke={2.4}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  )
}
