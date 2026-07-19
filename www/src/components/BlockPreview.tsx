import type { ReactNode } from 'react'
import { DashboardBlock } from '../../../registry/pouf/blocks/dashboard'
import { LoginBlock } from '../../../registry/pouf/blocks/login'
import { SettingsBlock } from '../../../registry/pouf/blocks/settings'
import { ChatBlock } from '../../../registry/pouf/blocks/chat'
import { GameBlock } from '../../../registry/pouf/blocks/game'
import { PricingBlock } from '../../../registry/pouf/blocks/pricing'
import { BlogBlock } from '../../../registry/pouf/blocks/blog'
import { ProfileBlock } from '../../../registry/pouf/blocks/profile'
import { KanbanBlock } from '../../../registry/pouf/blocks/kanban'
import { MusicBlock } from '../../../registry/pouf/blocks/music'
import { FeedBlock } from '../../../registry/pouf/blocks/feed'
import { TodoBlock } from '../../../registry/pouf/blocks/todo'
import { OnboardingBlock } from '../../../registry/pouf/blocks/onboarding'
import { WeatherBlock } from '../../../registry/pouf/blocks/weather'
import { QuizBlock } from '../../../registry/pouf/blocks/quiz'
import { LandingBlock } from '../../../registry/pouf/blocks/landing'
import { InboxBlock } from '../../../registry/pouf/blocks/inbox'
import { CalendarBlock } from '../../../registry/pouf/blocks/calendar'

const BLOCKS: Record<string, () => ReactNode> = {
  dashboard: DashboardBlock,
  login: LoginBlock,
  settings: SettingsBlock,
  chat: ChatBlock,
  game: GameBlock,
  pricing: PricingBlock,
  blog: BlogBlock,
  profile: ProfileBlock,
  kanban: KanbanBlock,
  music: MusicBlock,
  feed: FeedBlock,
  todo: TodoBlock,
  onboarding: OnboardingBlock,
  weather: WeatherBlock,
  quiz: QuizBlock,
  landing: LandingBlock,
  inbox: InboxBlock,
  calendar: CalendarBlock,
}

/** Renders a full example template by slug as a live island. */
export function BlockPreview({ slug }: { slug: string }) {
  const Block = BLOCKS[slug]
  if (!Block) return <div style={{ color: 'var(--muted)' }}>Unknown block: {slug}</div>
  return <Block />
}
