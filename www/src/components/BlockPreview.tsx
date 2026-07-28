import { lazy, Suspense, useEffect, useState, type ComponentType, type MouseEvent } from 'react'

function component<Module extends object, Name extends keyof Module>(
  load: () => Promise<Module>,
  name: Name,
): ComponentType {
  return lazy(async () => ({ default: (await load())[name] as ComponentType }))
}

/* Each template is its own async chunk. A visitor opening Inventory should not
 * download the storefront, charting, drag-and-drop, and every other route. */
const BLOCKS: Record<string, ComponentType> = {
  dashboard: component(() => import('../../../registry/pouf/blocks/dashboard'), 'DashboardBlock'),
  login: component(() => import('../../../registry/pouf/blocks/login'), 'LoginBlock'),
  settings: component(() => import('../../../registry/pouf/blocks/settings'), 'SettingsBlock'),
  chat: component(() => import('../../../registry/pouf/blocks/chat'), 'ChatBlock'),
  game: component(() => import('../../../registry/pouf/blocks/game'), 'GameBlock'),
  pricing: component(() => import('../../../registry/pouf/blocks/pricing'), 'PricingBlock'),
  blog: component(() => import('../../../registry/pouf/blocks/blog'), 'BlogBlock'),
  profile: component(() => import('../../../registry/pouf/blocks/profile'), 'ProfileBlock'),
  kanban: component(() => import('../../../registry/pouf/blocks/kanban'), 'KanbanBlock'),
  music: component(() => import('../../../registry/pouf/blocks/music'), 'MusicBlock'),
  feed: component(() => import('../../../registry/pouf/blocks/feed'), 'FeedBlock'),
  todo: component(() => import('../../../registry/pouf/blocks/todo'), 'TodoBlock'),
  onboarding: component(() => import('../../../registry/pouf/blocks/onboarding'), 'OnboardingBlock'),
  weather: component(() => import('../../../registry/pouf/blocks/weather'), 'WeatherBlock'),
  quiz: component(() => import('../../../registry/pouf/blocks/quiz'), 'QuizBlock'),
  landing: component(() => import('../../../registry/pouf/blocks/landing'), 'LandingBlock'),
  inbox: component(() => import('../../../registry/pouf/blocks/inbox'), 'InboxBlock'),
  calendar: component(() => import('../../../registry/pouf/blocks/calendar'), 'CalendarBlock'),
  storefront: component(() => import('../../../registry/pouf/blocks/storefront'), 'StorefrontBlock'),
  support: component(() => import('../../../registry/pouf/blocks/support'), 'SupportBlock'),
  contact: component(() => import('../../../registry/pouf/blocks/contact'), 'ContactBlock'),
  testimonials: component(() => import('../../../registry/pouf/blocks/testimonials'), 'TestimonialsBlock'),
  crm: component(() => import('../../../registry/pouf/blocks/crm'), 'CrmBlock'),
  booking: component(() => import('../../../registry/pouf/blocks/booking'), 'BookingBlock'),
  inventory: component(() => import('../../../registry/pouf/blocks/inventory'), 'InventoryBlock'),
  editorial: component(() => import('../../../registry/pouf/blocks/editorial'), 'EditorialBlock'),
  course: component(() => import('../../../registry/pouf/blocks/course'), 'CourseBlock'),
  event: component(() => import('../../../registry/pouf/blocks/event'), 'EventBlock'),
}

/** Renders a full example template by slug as a live island. */
export function BlockPreview({ slug }: { slug: string }) {
  const [demoDestination, setDemoDestination] = useState<string | null>(null)
  const Block = BLOCKS[slug]

  useEffect(() => {
    if (!demoDestination) return
    const timeout = window.setTimeout(() => setDemoDestination(null), 3600)
    return () => window.clearTimeout(timeout)
  }, [demoDestination])

  function keepDemoRouteInPreview(event: MouseEvent<HTMLDivElement>) {
    if (event.button > 1) return
    const target = event.target
    if (!(target instanceof Element)) return
    const link = target.closest<HTMLAnchorElement>('a[href]')
    if (!link || !event.currentTarget.contains(link)) return

    const href = link.getAttribute('href')?.trim() ?? ''
    if (!href.startsWith('/') || href.startsWith('//')) return

    event.preventDefault()
    event.stopPropagation()

    const label = link.textContent?.trim().replace(/\s+/g, ' ')
    const pathname = href.split(/[?#]/, 1)[0]
    const fallback = pathname === '/' ? 'Home' : pathname.split('/').filter(Boolean).at(-1)?.replaceAll('-', ' ')
    setDemoDestination(label || fallback || 'This route')
  }

  if (!Block) return <div style={{ color: 'var(--muted)' }}>Unknown block: {slug}</div>
  return (
    <div className="block-preview-boundary" onClickCapture={keepDemoRouteInPreview} onAuxClickCapture={keepDemoRouteInPreview}>
      <Suspense fallback={<div className="pouf-skeleton pouf-skeleton--card" aria-label="Loading example…" />}>
        <Block />
      </Suspense>
      {demoDestination && (
        <div className="block-preview-notice" role="status" aria-live="polite">
          <strong>{demoDestination}</strong>
          <span>Demo route — install the template to connect it.</span>
        </div>
      )}
    </div>
  )
}
