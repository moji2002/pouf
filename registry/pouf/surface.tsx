import clsx from 'clsx'
import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  /** flush: no padding, clipped — for a card that wraps its own scroll region.
   *  tight: 16px instead of the reference's 32px, for dense panels. */
  variant?: 'default' | 'flush' | 'tight'
}

export function Card({ children, variant = 'default' }: CardProps) {
  return (
    <div
      className={clsx(
        'pouf-card',
        variant === 'flush' && 'pouf-card--flush',
        variant === 'tight' && 'pouf-card--tight',
      )}
    >
      {children}
    </div>
  )
}

interface RowCardProps {
  children: ReactNode
  /** Renders a <button> when provided — keyboard-operable for free. */
  onClick?: () => void
  selected?: boolean
}

/** "Every row a cushion" — one puffy surface per position / trade / message.
 *
 * No tonal-edge prop. It was tried as a border and as an inset bar and read as
 * an artifact against the cushion's rounded silhouette both times. Rows convey
 * their state through the Blob's tone and the Badge's text, which had to exist
 * regardless — so the prop is gone rather than left as a tempting no-op.
 */
export function RowCard({ children, onClick, selected }: RowCardProps) {
  const className = clsx('pouf-rowcard', onClick && 'pouf-rowcard--interactive', selected && 'pouf-rowcard--selected')

  if (onClick) {
    return (
      <button type="button" className={className} onClick={onClick} aria-pressed={selected}>
        {children}
      </button>
    )
  }
  return <div className={className}>{children}</div>
}
