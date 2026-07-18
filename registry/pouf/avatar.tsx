import * as RAvatar from '@radix-ui/react-avatar'
import clsx from 'clsx'
import { toneClass, type Tone } from './tone'
import { Icon } from './Icon'
import type { IconName } from './Icon'

interface AvatarProps {
  src?: string
  alt?: string
  fallback?: string
  icon?: IconName
  tone?: Tone
  size?: 'sm' | 'md' | 'lg'
}

const SIZES = { sm: 'pouf-avatar--sm', md: '', lg: 'pouf-avatar--lg' } as const

export function Avatar({ src, alt, fallback, icon, tone = 'purple', size = 'md' }: AvatarProps) {
  return (
    <RAvatar.Root className={clsx('pouf-avatar', SIZES[size])}>
      {src && <RAvatar.Image className="pouf-avatar__img" src={src} alt={alt ?? ''} />}
      <RAvatar.Fallback className={clsx('pouf-avatar__fallback', toneClass(tone))}>
        {icon ? <Icon name={icon} size={size === 'lg' ? 'md' : 'sm'} /> : fallback?.slice(0, 2).toUpperCase()}
      </RAvatar.Fallback>
    </RAvatar.Root>
  )
}
