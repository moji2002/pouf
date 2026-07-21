import clsx from 'clsx'
import type { ReactNode } from 'react'

export interface NavbarLink {
  label: string
  href: string
  active?: boolean
}

interface NavbarProps {
  /** Your logo/wordmark. */
  brand: ReactNode
  links?: NavbarLink[]
  /** Right-side actions — usually a Button or two. */
  actions?: ReactNode
}

/** A top navigation bar on a floating cushion. Brand on the left, links, and
 * right-aligned actions. Links collapse on narrow screens (wire your own menu
 * for mobile — BottomNav or Sheet). */
export function Navbar({ brand, links = [], actions }: NavbarProps) {
  return (
    <nav className="pouf-navbar flex items-center gap-(--s4) h-16 pl-(--s5) pr-(--s3) rounded-pill bg-surface cushion-card">
      <div className="flex items-center gap-(--s2) font-black text-[20px] text-ink">{brand}</div>
      <div className="flex items-center gap-[2px] max-[760px]:hidden">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            aria-current={l.active ? 'page' : undefined}
            className={clsx(
              /* inline-flex + min-h so the 8px padding actually yields a 24px
               * target: as a bare inline anchor these measured 23px, just under
               * the WCAG 2.2 AA minimum (2.5.8), and they are standalone nav
               * links so the "inline" exemption does not apply. */
              'font-extrabold no-underline px-(--s3) py-(--s2) rounded-pill transition-colors',
              'inline-flex items-center min-h-[24px]',
              /* Active is an accent fill, so its label follows --on-accent —
               * --ink goes near-white in dark mode and would vanish on purple. */
              l.active
                ? 'bg-purple text-[var(--on-accent)]'
                : 'text-ink hover:bg-[rgba(201,168,255,0.25)]',
            )}
          >
            {l.label}
          </a>
        ))}
      </div>
      {actions && <div className="flex items-center gap-(--s2) ml-auto">{actions}</div>}
    </nav>
  )
}
