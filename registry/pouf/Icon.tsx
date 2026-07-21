import {
  IconAlertTriangle,
  IconAntennaBars5,
  IconArrowDown,
  IconArrowUp,
  IconBell,
  IconBolt,
  IconSpeakerphone,
  IconChartBar,
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
  // general vocabulary — added so screens never fall back to emoji
  IconHeart,
  IconHeartFilled,
  IconMessageCircle,
  IconPlayerPlayFilled,
  IconPlayerPauseFilled,
  IconPlayerTrackPrevFilled,
  IconPlayerTrackNextFilled,
  IconSun,
  IconCloud,
  IconCloudRain,
  IconStarFilled,
  IconCalendarEvent,
  IconClock,
  IconUser,
  IconUsers,
  IconMail,
  IconLock,
  IconSend,
  IconHome,
  IconTrophy,
  IconFlame,
  IconSparkles,
  IconMusic,
  IconShoppingBag,
  IconTag,
  IconDots,
  IconSword,
  IconShield,
  IconWand,
  IconMoodSmile,
  IconCreditCard,
  IconMapPin,
  IconWind,
  IconDroplet,
  type IconProps,
} from '@tabler/icons-react'
import type { ComponentType, ReactElement } from 'react'

/** The icon set, as a named vocabulary.
 *
 * Components name a ROLE, never an import, so swapping the icon library — or
 * just one glyph — happens here and nowhere else. (Need a role that isn't here?
 * Every icon-accepting prop also takes any React element — see IconLike below —
 * so you're never limited to this list.)
 *
 * These replaced emoji. Emoji are font-dependent (a ⚡ is a different shape,
 * size and colour on every OS, and some render as full-colour images that fight
 * a pastel palette), they can't inherit currentColor, and their accessible name
 * varies by platform. A stroked SVG set is consistent, colourable, and sizes
 * predictably against text.
 *
 * ONE GLYPH, ONE ROLE. Keep this map injective — if two roles want one picture,
 * they are probably one role.
 */
const ICONS = {
  // nav
  overview: IconGauge,
  chart: IconChartBar,
  log: IconClipboardList,
  channels: IconSpeakerphone,
  activity: IconAntennaBars5,
  lab: IconFlask,
  history: IconHistory,
  performance: IconTrendingUp,
  settings: IconSettings,
  database: IconDatabase,
  menu: IconLayoutGrid,
  // state
  up: IconArrowUp,
  down: IconArrowDown,
  flat: IconMinus,
  ok: IconCheck,
  warn: IconAlertTriangle,
  // An error is not a warning wearing a different background — the X-in-a-circle
  // says something DID break, where the triangle only cautions.
  fail: IconCircleX,
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
  // Pagination steps sideways — chevrons, not the up/down arrows (those carry
  // direction/trend meaning elsewhere).
  prev: IconChevronLeft,
  next: IconChevronRight,
  photo: IconPhoto,
  // general vocabulary — a broader set so app screens never reach for emoji.
  heart: IconHeart,
  'heart-filled': IconHeartFilled,
  comment: IconMessageCircle,
  play: IconPlayerPlayFilled,
  pause: IconPlayerPauseFilled,
  rewind: IconPlayerTrackPrevFilled,
  forward: IconPlayerTrackNextFilled,
  sun: IconSun,
  cloud: IconCloud,
  rain: IconCloudRain,
  star: IconStarFilled,
  calendar: IconCalendarEvent,
  clock: IconClock,
  user: IconUser,
  users: IconUsers,
  mail: IconMail,
  lock: IconLock,
  send: IconSend,
  home: IconHome,
  trophy: IconTrophy,
  flame: IconFlame,
  sparkle: IconSparkles,
  music: IconMusic,
  cart: IconShoppingBag,
  tag: IconTag,
  dots: IconDots,
  sword: IconSword,
  shield: IconShield,
  wand: IconWand,
  smile: IconMoodSmile,
  card: IconCreditCard,
  pin: IconMapPin,
  wind: IconWind,
  drop: IconDroplet,
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

/** What every icon-accepting primitive takes. A named role is the convenience
 * path (Tabler-backed, sizes and colours itself); a React element is the
 * escape hatch — pass an icon from ANY library (lucide, phosphor, heroicons,
 * your own SVG) and it renders as-is. The named vocabulary is a default, not a
 * cage. */
export type IconLike = IconName | ReactElement

/** Resolve an IconLike to a node. Named roles get the size; custom elements
 * render untouched (you size them yourself), so they inherit currentColor like
 * everything else. */
export function renderIcon(icon: IconLike, size: keyof typeof SIZES = 'md'): ReactElement {
  return typeof icon === 'string' ? <Icon name={icon} size={size} /> : icon
}
