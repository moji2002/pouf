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
  return <div className={clsx('pouf-stack', `pouf-gap-${gap}`)}>{children}</div>
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
        'pouf-row',
        `pouf-gap-${gap}`,
        align === 'top' && 'pouf-row--top',
        justify === 'center' && 'pouf-row--center',
        justify === 'between' && 'pouf-row--between',
        justify === 'end' && 'pouf-row--end',
        !wrap && 'pouf-row--nowrap',
      )}
    >
      {children}
    </div>
  )
}

export function Spacer() {
  return <div className="pouf-spacer" />
}

interface GridProps {
  children: ReactNode
  cols?: 2 | 3 | 4 | 'sidebar'
  gap?: Gap
}

export function Grid({ children, cols = 2, gap = 4 }: GridProps) {
  return <div className={clsx('pouf-grid', `pouf-grid--${cols}`, `pouf-gap-${gap}`)}>{children}</div>
}

export function Shell({ children }: { children: ReactNode }) {
  return <div className="pouf-shell">{children}</div>
}

export function Sidebar({ children }: { children: ReactNode }) {
  return <aside className="pouf-sidebar">{children}</aside>
}
