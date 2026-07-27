import type { ReactNode } from 'react'

export interface FooterColumn {
  title: string
  links: { label: string; href: string }[]
}

interface FooterProps {
  /** Your logo/wordmark. */
  brand: ReactNode
  /** A short line under the brand. */
  tagline?: string
  columns?: FooterColumn[]
  /** The bottom line — copyright, credits. */
  note?: ReactNode
}

/** A site footer on one big cushion: brand block plus columns of links, with an
 * optional bottom note. */
export function Footer({ brand, tagline, columns = [], note }: FooterProps) {
  return (
    <footer className="pouf-footer bg-surface rounded-card cushion-card px-(--s7) pt-(--s7) pb-(--s6)">
      <div className="flex flex-wrap gap-(--s7) justify-between">
        <div className="flex flex-col gap-(--s2) max-w-[280px]">
          <div className="flex items-center gap-(--s2) font-black text-[22px] text-ink">{brand}</div>
          {tagline && <p className="m-0 text-muted font-bold text-[15px]">{tagline}</p>}
        </div>
        <div className="flex flex-wrap gap-(--s7)">
          {columns.map((col) => (
            <nav key={col.title} className="flex flex-col gap-(--s2)" aria-label={col.title}>
              <span className="text-[12px] font-black tracking-[1.5px] uppercase text-muted">{col.title}</span>
              {/* inline-flex + min-h on each link: as bare inline anchors these
                * measured 23px, under the WCAG 2.2 AA target minimum (2.5.8).
                * They sit in a nav column, not in a sentence, so the SC's
                * "inline" exemption does not cover them. `self-start` keeps each
                * link hugging its label rather than stretching the column. */}
              {col.links.map((l) => (
                <a
                  key={`${l.href}-${l.label}`}
                  href={l.href}
                  className="font-extrabold text-ink no-underline hover:text-muted transition-colors inline-flex items-center self-start min-h-[24px]"
                >
                  {l.label}
                </a>
              ))}
            </nav>
          ))}
        </div>
      </div>
      {note && (
        <div className="mt-(--s6) pt-(--s5) border-t border-[rgba(201,168,255,0.3)] text-muted font-bold text-[14px]">
          {note}
        </div>
      )}
    </footer>
  )
}
