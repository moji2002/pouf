import * as RMenu from '@radix-ui/react-dropdown-menu'
import * as RContext from '@radix-ui/react-context-menu'
import clsx from 'clsx'
import type { ReactElement, ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { renderIcon, type IconLike } from './Icon'

export interface MenuEntry {
  label: string
  icon?: IconLike
  onClick?: () => void
  disabled?: boolean
  tone?: 'down'
}

/* ------------------------------------------------------------------ */
/* DropdownMenu                                                        */
/* ------------------------------------------------------------------ */

interface MenuItem {
  label: string
  icon?: IconLike
  onClick?: () => void
  disabled?: boolean
  tone?: 'down'
}

interface DropdownMenuProps {
  /** A single element that can receive a ref and native button attributes. */
  children: ReactElement
  items: (MenuItem | 'separator')[]
  label?: string
}

export function DropdownMenu({ children, items, label }: DropdownMenuProps) {
  const reduceMotion = useReducedMotion()
  return (
    <RMenu.Root>
      {/* asChild places Radix's ARIA state, handlers, and ref on the actual
          focusable trigger. Pouf Button forwards those native attributes. */}
      <RMenu.Trigger asChild aria-label={label}>
        {children}
      </RMenu.Trigger>
      <RMenu.Portal>
        <RMenu.Content className="pouf-menu" sideOffset={8} align="start" asChild>
          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.14, ease: 'easeOut' }}
          >
            {items.map((item, i) => {
              if (item === 'separator') return <RMenu.Separator key={i} className="pouf-menu__sep" />
              return (
                <RMenu.Item
                  key={i}
                  className={clsx('pouf-menu__item', item.tone === 'down' && 'pouf-menu__item--down')}
                  onClick={item.onClick}
                  disabled={item.disabled}
                >
                  {item.icon && renderIcon(item.icon, 'sm')}
                  {item.label}
                </RMenu.Item>
              )
            })}
          </motion.div>
        </RMenu.Content>
      </RMenu.Portal>
    </RMenu.Root>
  )
}

/* ------------------------------------------------------------------ */
/* ContextMenu — the right-click menu                                 */
/* ------------------------------------------------------------------ */

interface ContextMenuProps {
  /** The surface you right-click. */
  children: ReactNode
  items: (MenuEntry | 'separator')[]
}

/** A right-click menu on the same clay skin as DropdownMenu. Wrap any region;
 * a secondary click (or long-press on touch) opens it at the pointer. */
export function ContextMenu({ children, items }: ContextMenuProps) {
  const reduceMotion = useReducedMotion()
  return (
    <RContext.Root>
      <RContext.Trigger className="pouf-context-anchor">{children}</RContext.Trigger>
      <RContext.Portal>
        <RContext.Content className="pouf-menu" asChild>
          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.14, ease: 'easeOut' }}
          >
            {items.map((item, i) => {
              if (item === 'separator') return <RContext.Separator key={i} className="pouf-menu__sep" />
              return (
                <RContext.Item
                  key={i}
                  className={clsx('pouf-menu__item', item.tone === 'down' && 'pouf-menu__item--down')}
                  onClick={item.onClick}
                  disabled={item.disabled}
                >
                  {item.icon && renderIcon(item.icon, 'sm')}
                  {item.label}
                </RContext.Item>
              )
            })}
          </motion.div>
        </RContext.Content>
      </RContext.Portal>
    </RContext.Root>
  )
}
