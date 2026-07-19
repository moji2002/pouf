/** The example templates ("blocks") shown under /examples. Each is a full-page
 * composition of Pouf primitives, installable as a registry:block. */
export interface BlockDoc {
  slug: string
  title: string
  blurb: string
  emoji: string
}

export const BLOCKS: BlockDoc[] = [
  { slug: 'dashboard', title: 'Dashboard', blurb: 'Sidebar nav, a KPI row, a revenue chart, and a data table.', emoji: '📊' },
  { slug: 'chat', title: 'Chat', blurb: 'A conversation header, message bubbles, and a composer.', emoji: '💬' },
  { slug: 'game', title: 'Game HUD', blurb: 'Score, health and XP bars, and a leaderboard.', emoji: '🎮' },
  { slug: 'feed', title: 'Social feed', blurb: 'A composer and a stream of posts with reactions.', emoji: '🗞️' },
  { slug: 'pricing', title: 'Pricing', blurb: 'Three plans, one featured, with feature checklists.', emoji: '💸' },
  { slug: 'blog', title: 'Blog', blurb: 'A featured post and a grid of article cards.', emoji: '✍️' },
  { slug: 'profile', title: 'Profile', blurb: 'Avatar, stats, and tabbed content.', emoji: '🧑' },
  { slug: 'kanban', title: 'Kanban board', blurb: 'Columns of cards with priorities and assignees.', emoji: '📋' },
  { slug: 'music', title: 'Music player', blurb: 'Album art, a scrubber, transport controls, and a queue.', emoji: '🎧' },
  { slug: 'todo', title: 'Todo list', blurb: 'Add, filter, and check off tasks.', emoji: '✅' },
  { slug: 'onboarding', title: 'Onboarding', blurb: 'A progress bar and step-by-step forms.', emoji: '🚀' },
  { slug: 'settings', title: 'Settings', blurb: 'Tabbed sections of form controls with a save bar.', emoji: '⚙️' },
  { slug: 'login', title: 'Login', blurb: 'A centered auth card with fields and a magic-link fallback.', emoji: '🔑' },
  { slug: 'weather', title: 'Weather', blurb: 'Current conditions and a 5-day forecast.', emoji: '🌤️' },
  { slug: 'quiz', title: 'Quiz', blurb: 'Progress, questions, and inline scoring.', emoji: '❓' },
]

export function blockInstall(slug: string): string {
  return `npx shadcn@latest add https://pouf.dev/r/${slug}.json`
}
