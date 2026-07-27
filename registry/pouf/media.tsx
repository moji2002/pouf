import { cva, cx } from 'class-variance-authority'
import type { ReactNode } from 'react'
import { toneClass, type Tone } from './tone'
import { renderIcon, type IconLike } from './Icon'

interface BlobProps {
  /** A named role (Tabler-backed, from Icon) OR any icon element from any
   *  library — lucide, phosphor, your own SVG. The named set is a convenience,
   *  not a requirement. */
  icon: IconLike
  tone?: Tone
  size?: 'sm' | 'md' | 'lg'
  /** Decorative by default — a blob beside a visible label is noise to a
   *  screen reader. Pass a label only when the icon is the sole meaning. */
  label?: string
}

/* Optically centred, not geometrically centred: the blob carries a 4px white
 * highlight on top and an 8px dark floor on the bottom. That floor reads as
 * the cushion's underside rather than its face, so the face a viewer sees is
 * the upper portion — and a mathematically perfect centre sits visibly low in
 * it. Nudging the glyph by half the difference, (8-4)/2, puts it in the middle
 * of the face people actually perceive. */
const blob = cva(
  [
    'pouf-blob inline-flex items-center justify-center flex-none text-[var(--on-accent)]',
    'bg-[var(--tone,var(--purple))] cushion-blob [&>svg]:[transform:translateY(-2px)]',
  ],
  {
    variants: {
      size: {
        sm: 'w-11 h-11 rounded-[14px] text-[20px]',
        md: 'w-[60px] h-[60px] rounded-[18px] text-[26px]',
        lg: 'w-20 h-20 rounded-blob text-[36px]',
      },
    },
    defaultVariants: { size: 'lg' },
  },
)

/** The reference's icon tile. */
export function Blob({ icon, tone = 'purple', size = 'lg', label }: BlobProps) {
  return (
    <span
      className={cx(blob({ size }), toneClass(tone))}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {renderIcon(icon, size === 'sm' ? 'sm' : size === 'md' ? 'md' : 'lg')}
    </span>
  )
}

/* FLAT, deliberately. A badge is a label, not a control. It used to carry the
 * cushion recipe and so read as a small pressable pill. In a design system
 * whose entire vocabulary for "interactive" is depth, letting a static label
 * borrow that depth devalues the signal for every real button on screen.
 * flex-none + self-start: never squashed by a long neighbour, and never
 * stretched into a banner by a flex column. A badge hugs its own text. */
export function Badge({ children, tone = 'purple' }: { children: ReactNode; tone?: Tone }) {
  return (
    <span
      className={cx(
        'pouf-badge inline-flex items-center gap-[6px] text-[12px] font-black tracking-[0.4px] uppercase',
        'text-[var(--on-accent)] bg-[var(--tone,var(--purple))] rounded-pill px-3 py-[5px] [box-shadow:none]',
        'flex-none whitespace-nowrap self-start',
        toneClass(tone),
      )}
    >
      {children}
    </span>
  )
}

/** A status dot. Always pair with text — colour alone can't carry state. */
export function Dot({ tone = 'purple' }: { tone?: Tone }) {
  return (
    <span
      className={cx(
        'pouf-dot w-[9px] h-[9px] rounded-[50%] bg-[var(--tone,var(--purple))]',
        '[box-shadow:inset_0_-2px_0_rgba(0,0,0,0.15)] flex-none',
        toneClass(tone),
      )}
      aria-hidden="true"
    />
  )
}

/** An image, framed in clay.
 *
 * `alt` is required with no default: these render user-supplied screenshots,
 * and an unlabelled image is exactly the case alt text exists for.
 * Lazy by default — a gallery can be dozens of photos. */
export function Figure({ src, alt, width, height }: { src: string; alt: string; width: number; height: number }) {
  return (
    <img
      className="pouf-figure block max-w-[420px] w-full h-auto rounded-control bg-bg cushion-field"
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
    />
  )
}
