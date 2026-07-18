import clsx from 'clsx'
import type { ReactNode } from 'react'
import { Blob } from './media'
import { Icon } from './Icon'
import { Stack } from './layout'
import { Text } from './text'
import type { IconName } from './Icon'

export function Empty({ icon = 'idle', title, children }: { icon?: IconName; title: string; children?: ReactNode }) {
  return (
    <div className="clay-empty">
      <Blob tone="purple" size="md" icon={icon} />
      <Text>{title}</Text>
      {children && (
        <Text size="sm" muted>
          {children}
        </Text>
      )}
    </div>
  )
}

export function Skeleton({ variant = 'row', count = 1 }: { variant?: 'text' | 'row' | 'card'; count?: number }) {
  return (
    <Stack gap={3}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={clsx('clay-skeleton', `clay-skeleton--${variant}`)} aria-hidden="true" />
      ))}
    </Stack>
  )
}

/** Failure is a first-class state here: this admin talks to exchanges, so a
 * request that dies must say so rather than render an empty list that reads as
 * "no open positions".
 *
 * A puffy clay cushion with a raised warning blob — the same physical language
 * as a toast, not the flat orange slab it used to be. */
export function ErrorNote({ children }: { children: ReactNode }) {
  return (
    <div className="clay-error-note" role="alert">
      <span className="clay-error-note__icon">
        <Icon name="warn" size="sm" />
      </span>
      <span className="clay-error-note__text">{children}</span>
    </div>
  )
}
