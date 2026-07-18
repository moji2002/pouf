import * as RHover from '@radix-ui/react-hover-card'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface HoverCardProps {
  children: ReactNode
  content: ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
}

export function HoverCard({ children, content, side = 'bottom', align = 'center' }: HoverCardProps) {
  return (
    <RHover.Root openDelay={300} closeDelay={200}>
      <RHover.Trigger asChild>
        <span className="clay-hover__anchor">{children}</span>
      </RHover.Trigger>
      <RHover.Portal>
        <RHover.Content className="clay-hover" sideOffset={8} side={side} align={align} asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            {content}
          </motion.div>
        </RHover.Content>
      </RHover.Portal>
    </RHover.Root>
  )
}
