import clsx from 'clsx'
import type { ReactNode } from 'react'
import { toneClass, type Tone } from './tone'
import { Icon, type IconName } from './Icon'

interface BlobProps {
  /** An icon ROLE, not a glyph. Blobs used to take emoji; those rendered at a
   *  different size, weight and colour on every OS and couldn't inherit the
   *  tone's ink colour. */
  icon: IconName
  tone?: Tone
  size?: 'sm' | 'md' | 'lg'
  /** Decorative by default — a blob beside a visible label is noise to a
   *  screen reader. Pass a label only when the icon is the sole meaning. */
  label?: string
}

/** The reference's icon tile. */
export function Blob({ icon, tone = 'purple', size = 'lg', label }: BlobProps) {
  return (
    <span
      className={clsx('pouf-blob', size === 'sm' && 'pouf-blob--sm', size === 'md' && 'pouf-blob--md', toneClass(tone))}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <Icon name={icon} size={size === 'sm' ? 'sm' : size === 'md' ? 'md' : 'lg'} />
    </span>
  )
}

export function Badge({ children, tone = 'purple' }: { children: ReactNode; tone?: Tone }) {
  return <span className={clsx('pouf-badge', toneClass(tone))}>{children}</span>
}

/** A status dot. Always pair with text — colour alone can't carry state. */
export function Dot({ tone = 'purple' }: { tone?: Tone }) {
  return <span className={clsx('pouf-dot', toneClass(tone))} aria-hidden="true" />
}

/** An image, framed in clay.
 *
 * `alt` is required with no default: these render signal screenshots, and an
 * unlabelled image of a trade setup is exactly the case alt text exists for.
 * Lazy by default — a channel's history can be dozens of photos. */
export function Figure({ src, alt }: { src: string; alt: string }) {
  return <img className="pouf-figure" src={src} alt={alt} loading="lazy" />
}
