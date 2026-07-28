/** The two galleries the site ships, and the difference between them.
 *
 * BLOCKS are SECTIONS — a pricing table, an auth card, a player. You drop one
 * into a page you already have.
 * TEMPLATES are SCREENS — global chrome (an app shell with navigation, or a
 * marketing page with navbar and footer) plus the content inside it. You ship
 * one as a route.
 *
 * The split is not cosmetic: it decides what the preview frame shows (a section
 * on a page background vs. a whole window) and what the copy promises. Both
 * install the same way — a registry:block that lands with its dependencies.
 */

import { installCommand } from './site'
export interface BlockDoc {
  slug: string
  title: string
  blurb: string
  /** A Pouf tone for the gallery card, and an Icon role for its blob. */
  tone: 'purple' | 'pink' | 'blue' | 'mint' | 'yellow' | 'orange'
  icon: string
  /** Gallery grouping on the /blocks or /examples index. */
  category?: string
}

/** Full screens: chrome included. */
export const TEMPLATES: BlockDoc[] = [
  { slug: 'dashboard', title: 'Dashboard', blurb: 'Sidebar nav, a KPI row, a filterable revenue chart, and a sortable orders table.', tone: 'purple', icon: 'overview', category: 'Business' },
  { slug: 'crm', title: 'Customer CRM', blurb: 'Responsive customer workspace with search, lifecycle stages, account details, and notes.', tone: 'blue', icon: 'users', category: 'Business' },
  { slug: 'settings', title: 'Settings', blurb: 'App shell, tabbed sections, and a save bar that tracks dirty state.', tone: 'orange', icon: 'settings', category: 'Business' },
  { slug: 'inventory', title: 'Inventory', blurb: 'Searchable stock, status filters, sortable records, item detail, and receiving actions.', tone: 'blue', icon: 'database', category: 'Business' },
  { slug: 'inbox', title: 'Inbox', blurb: 'App shell, a searchable mail list, and a reading pane with reply.', tone: 'blue', icon: 'mail', category: 'Communication' },
  { slug: 'chat', title: 'Chat', blurb: 'App shell, a conversation list, message bubbles, and a working composer.', tone: 'pink', icon: 'comment', category: 'Communication' },
  { slug: 'support', title: 'Support desk', blurb: 'App shell, searchable ticket queue, customer context, replies, and status updates.', tone: 'purple', icon: 'comment', category: 'Communication' },
  { slug: 'kanban', title: 'Kanban board', blurb: 'App shell and columns you can actually move cards between.', tone: 'mint', icon: 'log', category: 'Productivity' },
  { slug: 'editorial', title: 'Editorial desk', blurb: 'A publishing queue that moves stories from draft through scheduling to launch.', tone: 'orange', icon: 'draft', category: 'Productivity' },
  { slug: 'landing', title: 'Landing page', blurb: 'Navbar, hero, features, pricing, CTA, and footer — a marketing page end to end.', tone: 'yellow', icon: 'sparkle', category: 'Marketing & commerce' },
  { slug: 'storefront', title: 'Storefront', blurb: 'A complete shop with filters, product discovery, a working bag, totals, and footer.', tone: 'mint', icon: 'cart', category: 'Marketing & commerce' },
  { slug: 'booking', title: 'Booking flow', blurb: 'A complete service-booking route with site chrome, scheduling, details, review, and confirmation.', tone: 'pink', icon: 'calendar', category: 'Marketing & commerce' },
  { slug: 'course', title: 'Course dashboard', blurb: 'A learning workspace with a lesson outline, completion controls, and live progress.', tone: 'yellow', icon: 'wand', category: 'Learning & events' },
  { slug: 'event', title: 'Event check-in', blurb: 'A front-desk view with attendee search, filters, arrival totals, and working check-in.', tone: 'pink', icon: 'calendar', category: 'Learning & events' },
]

export const TEMPLATE_CATEGORIES = [
  'Business',
  'Communication',
  'Productivity',
  'Marketing & commerce',
  'Learning & events',
] as const

/** Sections: drop one into a page you already have. */
export const BLOCKS: BlockDoc[] = [
  { slug: 'login', title: 'Sign in', blurb: 'A centered auth card with validation, a password toggle, and a magic-link fallback.', tone: 'purple', icon: 'lock', category: 'Auth & onboarding' },
  { slug: 'onboarding', title: 'Onboarding', blurb: 'A progress bar and step-by-step forms that remember your answers.', tone: 'yellow', icon: 'sparkle', category: 'Auth & onboarding' },
  { slug: 'pricing', title: 'Pricing', blurb: 'Three plans, a monthly/annual toggle, and feature checklists.', tone: 'mint', icon: 'card', category: 'Marketing' },
  { slug: 'blog', title: 'Blog index', blurb: 'A featured post and a filterable grid of article cards.', tone: 'orange', icon: 'draft', category: 'Marketing' },
  { slug: 'contact', title: 'Contact section', blurb: 'A high-trust contact section with useful context, inline validation, and a sent state.', tone: 'blue', icon: 'mail', category: 'Marketing' },
  { slug: 'testimonials', title: 'Testimonials', blurb: 'A filterable customer-story carousel with outcomes, controls, and live announcements.', tone: 'yellow', icon: 'comment', category: 'Marketing' },
  { slug: 'profile', title: 'Profile', blurb: 'Avatar, stats, a follow button, and tabbed content.', tone: 'purple', icon: 'user', category: 'Social' },
  { slug: 'feed', title: 'Social feed', blurb: 'A composer and a stream of posts you can like, comment on, and post to.', tone: 'pink', icon: 'heart-filled', category: 'Social' },
  { slug: 'todo', title: 'Todo list', blurb: 'Add, filter, check off, and clear tasks — with a real empty state.', tone: 'mint', icon: 'ok', category: 'Productivity' },
  { slug: 'calendar', title: 'Day agenda', blurb: 'A working day picker with events, a now-line, and free slots.', tone: 'blue', icon: 'calendar', category: 'Productivity' },
  { slug: 'music', title: 'Music player', blurb: 'Album art, a draggable scrubber, transport controls, and a queue.', tone: 'pink', icon: 'music', category: 'Media' },
  { slug: 'weather', title: 'Weather', blurb: 'Current conditions, an hourly strip, and a 5-day forecast.', tone: 'blue', icon: 'sun', category: 'Media' },
  { slug: 'game', title: 'Game HUD', blurb: 'Score, health and XP bars, an inventory, and a leaderboard.', tone: 'orange', icon: 'trophy', category: 'Play' },
  { slug: 'quiz', title: 'Quiz', blurb: 'Progress, questions, instant feedback, and a scored result screen.', tone: 'yellow', icon: 'wand', category: 'Play' },
]

/** Every gallery item, both kinds — for lookups that don't care which. */
export const ALL_BLOCKS: BlockDoc[] = [...TEMPLATES, ...BLOCKS]

/** Section names in display order. */
export const BLOCK_CATEGORIES = [
  'Auth & onboarding',
  'Marketing',
  'Social',
  'Productivity',
  'Media',
  'Play',
] as const

export function blockInstall(slug: string): string {
  return installCommand(slug)
}
