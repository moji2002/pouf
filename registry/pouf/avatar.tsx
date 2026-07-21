import * as RAvatar from '@radix-ui/react-avatar'
import { cva, cx } from 'class-variance-authority'
import { toneClass, type Tone } from './tone'
import { renderIcon, type IconLike } from './Icon'

interface AvatarProps {
  src?: string
  alt?: string
  fallback?: string
  icon?: IconLike
  tone?: Tone
  size?: 'sm' | 'md' | 'lg'
}

/* The root carries the cast shadow: overflow:hidden clips a CHILD's shadow
 * (the old build put the whole blob recipe on the fallback and lost the drop),
 * but never the element's own. Inner highlight/floor live on the fallback
 * face; a photo supplies its own light, so an image avatar keeps just the
 * drop. */
const avatar = cva(
  'pouf-avatar inline-flex items-center justify-center overflow-hidden flex-none bg-bg [box-shadow:0_10px_20px_rgba(58,46,92,0.15)]',
  {
    variants: {
      size: {
        sm: 'w-8 h-8 rounded-[14px]',
        md: 'w-12 h-12 rounded-blob',
        lg: 'w-[72px] h-[72px] rounded-blob',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

/* SOFT, blurred insets — not the hard 0-blur bands the Blob uses. On a circle,
 * overflow:hidden clips a hard `inset 0 -6px 0` band into a crescent that
 * reads as a second, clipped disc. A blurred inset instead shades the sphere
 * smoothly: light gathered at the top, a soft floor at the bottom, no hard
 * edge to clip. Initials scale with the face — 15px letters were rattling
 * around the 72px avatar and crowding the 32px one. */
const fallback = cva(
  [
    'pouf-avatar__fallback w-full h-full flex items-center justify-center font-black text-[var(--on-accent)]',
    'bg-[var(--tone,var(--purple))]',
    '[box-shadow:inset_0_4px_8px_rgba(255,255,255,0.5),inset_0_-7px_11px_rgba(0,0,0,0.06)]',
  ],
  {
    variants: {
      size: { sm: 'text-[12px]', md: 'text-[15px]', lg: 'text-[22px]' },
    },
    defaultVariants: { size: 'md' },
  },
)

export function Avatar({ src, alt, fallback: fallbackText, icon, tone = 'purple', size = 'md' }: AvatarProps) {
  return (
    <RAvatar.Root className={avatar({ size })}>
      {src && <RAvatar.Image className="pouf-avatar__img w-full h-full object-cover" src={src} alt={alt ?? ''} />}
      <RAvatar.Fallback className={cx(fallback({ size }), toneClass(tone))}>
        {icon ? renderIcon(icon, size === 'lg' ? 'md' : 'sm') : fallbackText?.slice(0, 2).toUpperCase()}
      </RAvatar.Fallback>
    </RAvatar.Root>
  )
}
