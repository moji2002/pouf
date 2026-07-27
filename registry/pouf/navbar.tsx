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
  /** Identifies this navigation landmark when a page has more than one. */
  label?: string
}

/** A top navigation bar on a floating cushion. Brand on the left, links, and
 * right-aligned actions. On narrow screens the links move into a native
 * details menu, so a complete page never loses its navigation just because it
 * reached phone width. */
export function Navbar({ brand, links = [], actions, label = 'Primary' }: NavbarProps) {
  return (
    <nav
      className="pouf-navbar flex items-center gap-(--s4) h-16 pl-(--s5) pr-(--s3) rounded-pill bg-surface cushion-card"
      aria-label={label}
    >
      <div className="flex items-center gap-(--s2) font-black text-[20px] text-ink">{brand}</div>
      <div className="pouf-navbar__links flex items-center gap-[2px]">
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
      {links.length > 0 ? (
        <details className="pouf-navbar__mobile relative ml-auto">
          <summary
            className="inline-flex items-center min-h-[40px] px-(--s3) font-extrabold text-ink cursor-pointer rounded-pill hover:bg-[rgba(201,168,255,0.25)]"
            style={{ listStyle: 'none' }}
          >
            Menu
          </summary>
          <div className="absolute right-0 top-[calc(100%+12px)] z-20 min-w-[190px] flex flex-col gap-(--s1) p-(--s2) bg-surface rounded-control cushion-card">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-current={link.active ? 'page' : undefined}
                className={clsx(
                  'font-extrabold no-underline px-(--s3) py-(--s2) rounded-control min-h-[40px] inline-flex items-center',
                  link.active
                    ? 'bg-purple text-[var(--on-accent)]'
                    : 'text-ink hover:bg-[rgba(201,168,255,0.25)]',
                )}
                onClick={(event) => event.currentTarget.closest('details')?.removeAttribute('open')}
              >
                {link.label}
              </a>
            ))}
          </div>
        </details>
      ) : null}
      {actions && (
        <div className="pouf-navbar__actions flex items-center gap-(--s2) ml-auto">
          {actions}
        </div>
      )}
    </nav>
  )
}
