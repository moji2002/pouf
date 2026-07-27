import * as RHover from '@radix-ui/react-hover-card'
import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface HoverCardProps {
  children: ReactNode
  content: ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
}

export function HoverCard({ children, content, side = 'bottom', align = 'center' }: HoverCardProps) {
  const reduceMotion = useReducedMotion()
  return (
    <RHover.Root openDelay={300} closeDelay={200}>
      <RHover.Trigger asChild>
        <span className="pouf-hover__anchor">{children}</span>
      </RHover.Trigger>
      <RHover.Portal>
        <RHover.Content className="pouf-hover" sideOffset={8} side={side} align={align} asChild>
          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.15, ease: 'easeOut' }}
          >
            {content}
          </motion.div>
        </RHover.Content>
      </RHover.Portal>
    </RHover.Root>
  )
}
