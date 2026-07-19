/** The example templates ("blocks") shown under /examples. Each is a full-page
 * composition of Pouf primitives, installable as a registry:block. */
export interface BlockDoc {
  slug: string
  title: string
  blurb: string
  /** A Pouf tone for the gallery card, and an Icon role for its blob. */
  tone: 'purple' | 'pink' | 'blue' | 'mint' | 'yellow' | 'orange'
  icon: string
}

export const BLOCKS: BlockDoc[] = [
  { slug: 'dashboard', title: 'Dashboard', blurb: 'Sidebar nav, a KPI row, a revenue chart, and a data table.', tone: 'purple', icon: 'overview' },
  { slug: 'chat', title: 'Chat', blurb: 'A conversation header, message bubbles, and a composer.', tone: 'blue', icon: 'comment' },
  { slug: 'game', title: 'Game HUD', blurb: 'Score, health and XP bars, and a leaderboard.', tone: 'pink', icon: 'trophy' },
  { slug: 'feed', title: 'Social feed', blurb: 'A composer and a stream of posts with reactions.', tone: 'mint', icon: 'heart-filled' },
  { slug: 'pricing', title: 'Pricing', blurb: 'Three plans, one featured, with feature checklists.', tone: 'yellow', icon: 'card' },
  { slug: 'blog', title: 'Blog', blurb: 'A featured post and a grid of article cards.', tone: 'orange', icon: 'draft' },
  { slug: 'profile', title: 'Profile', blurb: 'Avatar, stats, and tabbed content.', tone: 'purple', icon: 'user' },
  { slug: 'kanban', title: 'Kanban board', blurb: 'Columns of cards with priorities and assignees.', tone: 'blue', icon: 'log' },
  { slug: 'music', title: 'Music player', blurb: 'Album art, a scrubber, transport controls, and a queue.', tone: 'pink', icon: 'music' },
  { slug: 'todo', title: 'Todo list', blurb: 'Add, filter, and check off tasks.', tone: 'mint', icon: 'ok' },
  { slug: 'onboarding', title: 'Onboarding', blurb: 'A progress bar and step-by-step forms.', tone: 'yellow', icon: 'sparkle' },
  { slug: 'settings', title: 'Settings', blurb: 'Tabbed sections of form controls with a save bar.', tone: 'orange', icon: 'settings' },
  { slug: 'login', title: 'Login', blurb: 'A centered auth card with fields and a magic-link fallback.', tone: 'purple', icon: 'lock' },
  { slug: 'weather', title: 'Weather', blurb: 'Current conditions and a 5-day forecast.', tone: 'blue', icon: 'sun' },
  { slug: 'quiz', title: 'Quiz', blurb: 'Progress, questions, and inline scoring.', tone: 'pink', icon: 'wand' },
  { slug: 'landing', title: 'Landing page', blurb: 'Navbar, hero, features, CTA, and footer — the section primitives together.', tone: 'purple', icon: 'sparkle' },
  { slug: 'inbox', title: 'Inbox', blurb: 'An email list beside a reading pane.', tone: 'blue', icon: 'mail' },
  { slug: 'calendar', title: 'Calendar', blurb: 'A day agenda with working navigation.', tone: 'mint', icon: 'calendar' },
]

export function blockInstall(slug: string): string {
  return `npx shadcn@latest add https://pouf.dev/r/${slug}.json`
}
