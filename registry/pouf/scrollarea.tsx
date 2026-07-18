import * as RScroll from '@radix-ui/react-scroll-area'
import type { ReactNode } from 'react'

interface ScrollAreaProps {
  children: ReactNode
  maxHeight?: string
}

export function ScrollArea({ children, maxHeight = '400px' }: ScrollAreaProps) {
  return (
    // maxHeight lives on the VIEWPORT, not the Root: the viewport scrolls itself,
    // and a percentage height:100% against a Root that only has max-height never
    // resolves (a percentage height needs an explicit parent height), so the old
    // build just clipped and never scrolled. A max-height on the scrolling element
    // directly needs no such resolution.
    <RScroll.Root className="pouf-scroll">
      <RScroll.Viewport className="pouf-scroll__viewport" style={{ maxHeight }}>
        {children}
      </RScroll.Viewport>
      <RScroll.Scrollbar className="pouf-scroll__bar" orientation="vertical">
        <RScroll.Thumb className="pouf-scroll__thumb" />
      </RScroll.Scrollbar>
    </RScroll.Root>
  )
}
