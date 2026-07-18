import { useEffect, useRef } from 'react'
import { HoverCard } from '../hovercard'
import { Badge } from '../media'
import { Text } from '../text'
import { simulateHover } from './interact'
import type { Demo } from './types'

const content = <Text size="sm">Created 3 hours ago · 12 items · shared with 2 people.</Text>

function HoverCardOpen() {
  const ref = useRef<HTMLDivElement>(null)
  // HoverCard has no controlled `open` prop, and it opens on a real hover
  // after openDelay (300ms) — dispatching the pointer sequence arms Radix's
  // own timer, but the panel won't actually be visible until that elapses.
  useEffect(() => { simulateHover(ref.current?.querySelector('.clay-hover__anchor')) }, [])
  return (
    <div ref={ref}>
      <HoverCard content={content}>
        <Badge tone="info">Hover for details</Badge>
      </HoverCard>
    </div>
  )
}

export const hoverCardDemos: Demo[] = [
  { id: 'trigger', states: ['hover'], render: () => (
      <span data-subject>
        <HoverCard content={content}>
          <Badge tone="info">Hover for details</Badge>
        </HoverCard>
      </span>
    ) },
  { id: 'open', render: () => <HoverCardOpen /> },
]
