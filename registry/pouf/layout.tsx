import clsx from 'clsx'
import type { ReactNode } from 'react'

/** Layout primitives exist so a screen never writes `display:flex` itself.
 * Without them the first screen that needs a gap reaches for an inline style,
 * and spacing silently escapes the design system. */

type Gap = 1 | 2 | 3 | 4 | 5 | 6

interface StackProps {
  children: ReactNode
  gap?: Gap
}

export function Stack({ children, gap = 4 }: StackProps) {
  return <div className={clsx('clay-stack', `clay-gap-${gap}`)}>{children}</div>
}

interface RowProps {
  children: ReactNode
  gap?: Gap
  align?: 'center' | 'top'
  /** `center` exists because without it a screen has no way to centre anything
   *  and reaches for an inline style — which is how the QR code ended up
   *  left-aligned in its dialog. */
  justify?: 'start' | 'center' | 'between' | 'end'
  wrap?: boolean
}

export function Row({ children, gap = 4, align = 'center', justify = 'start', wrap = true }: RowProps) {
  return (
    <div
      className={clsx(
        'clay-row',
        `clay-gap-${gap}`,
        align === 'top' && 'clay-row--top',
        justify === 'center' && 'clay-row--center',
        justify === 'between' && 'clay-row--between',
        justify === 'end' && 'clay-row--end',
        !wrap && 'clay-row--nowrap',
      )}
    >
      {children}
    </div>
  )
}

export function Spacer() {
  return <div className="clay-spacer" />
}

interface GridProps {
  children: ReactNode
  cols?: 2 | 3 | 4 | 'sidebar'
  gap?: Gap
}

export function Grid({ children, cols = 2, gap = 4 }: GridProps) {
  return <div className={clsx('clay-grid', `clay-grid--${cols}`, `clay-gap-${gap}`)}>{children}</div>
}

export function Shell({ children }: { children: ReactNode }) {
  return <div className="clay-shell">{children}</div>
}

export function Sidebar({ children }: { children: ReactNode }) {
  return <aside className="clay-sidebar">{children}</aside>
}
