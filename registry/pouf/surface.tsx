import { cva } from 'class-variance-authority'
import type { ReactNode } from 'react'

/* Vertical padding is biased by half the lip on every padded variant: the
 * cushion's floor inset paints INSIDE the box, so symmetric padding reads
 * bottom-heavy. Same total height, optically centred content. */
const card = cva('pouf-card bg-surface rounded-card cushion-card', {
  variants: {
    variant: {
      default: 'px-(--s7) pt-[calc(var(--s7)-var(--lip)/2)] pb-[calc(var(--s7)+var(--lip)/2)]',
      flush: 'p-0',
      tight: 'px-(--s4) pt-[calc(var(--s4)-var(--lip)/2)] pb-[calc(var(--s4)+var(--lip)/2)]',
    },
    motion: {
      none: '',
      lift:
        '[transition:transform_160ms_ease] hover:[transform:translateY(-4px)] motion-reduce:[transform:none] motion-reduce:hover:[transform:none]',
      'tilt-left':
        '[transform:rotate(-0.6deg)] [transition:transform_160ms_ease] hover:[transform:rotate(0deg)_translateY(-4px)] motion-reduce:[transform:none] motion-reduce:hover:[transform:none]',
      'tilt-right':
        '[transform:rotate(0.6deg)] [transition:transform_160ms_ease] hover:[transform:rotate(0deg)_translateY(-4px)] motion-reduce:[transform:none] motion-reduce:hover:[transform:none]',
    },
  },
  defaultVariants: { variant: 'default', motion: 'none' },
})

interface CardProps {
  children: ReactNode
  /** flush: no padding, clipped — for a card that wraps its own scroll region.
   *  tight: 16px instead of the reference's 32px, for dense panels. */
  variant?: 'default' | 'flush' | 'tight'
  /** Playful, composited hover motion for linked or featured cards. */
  motion?: 'none' | 'lift' | 'tilt-left' | 'tilt-right'
}

export function Card({ children, variant, motion }: CardProps) {
  return <div className={card({ variant, motion })}>{children}</div>
}

interface RowCardProps {
  children: ReactNode
  /** Renders a <button> when provided — keyboard-operable for free. */
  onClick?: () => void
  selected?: boolean
}

/* Interactivity and selection are cva variants rather than cascading selector
 * overrides: a selected row simply never emits the hover/active utilities, so
 * it cannot flicker back to a white cushion under the pointer. [font:inherit]
 * keeps the button voice identical to the div voice (the shorthand also
 * resets line-height to inherit, which the button base compensation set to
 * normal). */
const rowCard = cva(
  [
    'pouf-rowcard block w-full text-left [font:inherit] text-inherit border-none',
    'rounded-control px-(--s4) pt-[calc(var(--s4)-var(--lip-row)/2)] pb-[calc(var(--s4)+var(--lip-row)/2)]',
    '[transition:box-shadow_140ms_ease,transform_140ms_ease]',
  ],
  {
    variants: {
      interactive: { true: 'cursor-pointer' },
      selected: {
        /* The same words navlink--active speaks for "the active one of a set":
         * a tone fill on the whole cushion. Ink on --purple is 6.10:1. */
        true: [
          'bg-purple text-[var(--on-accent)] cushion-control',
          /* Headings and muted Text own explicit dark-mode colours, so normal
           * inheritance cannot make them readable on the selected pastel.
           * Selection owns the whole cushion and therefore its complete text
           * palette, not only the outer button's currentColor. */
          '[&_.pouf-h1]:text-[var(--on-accent)] [&_.pouf-h2]:text-[var(--on-accent)]',
          '[&_.pouf-h3]:text-[var(--on-accent)] [&_.pouf-text]:text-[var(--on-accent)]',
        ].join(' '),
        false: 'bg-surface cushion-row',
      },
    },
    compoundVariants: [
      {
        interactive: true,
        selected: false,
        className:
          'hover:cushion-row-hover hover:[transform:translateY(-1px)] active:[transform:translateY(1px)] active:cushion-control-active',
      },
    ],
    defaultVariants: { selected: false },
  },
)

/** "Every row a cushion" — one puffy surface per position / item / message.
 *
 * No tonal-edge prop. It was tried as a border and as an inset bar and read as
 * an artifact against the cushion's rounded silhouette both times. Rows convey
 * their state through the Blob's tone and the Badge's text, which had to exist
 * regardless — so the prop is gone rather than left as a tempting no-op.
 */
export function RowCard({ children, onClick, selected }: RowCardProps) {
  const className = rowCard({ interactive: !!onClick, selected: !!selected })

  if (onClick) {
    return (
      <button
        type="button"
        className={className}
        onClick={onClick}
        aria-pressed={selected}
        data-selected={selected || undefined}
      >
        {children}
      </button>
    )
  }
  return <div className={className} data-selected={selected || undefined}>{children}</div>
}
