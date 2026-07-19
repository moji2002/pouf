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
              'font-extrabold text-ink no-underline px-(--s3) py-(--s2) rounded-pill transition-colors',
              l.active ? 'bg-purple' : 'hover:bg-[rgba(201,168,255,0.25)]',
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
