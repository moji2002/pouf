import * as RMenu from '@radix-ui/react-dropdown-menu'
import clsx from 'clsx'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Icon } from './Icon'
import type { IconName } from './Icon'

/* ------------------------------------------------------------------ */
/* DropdownMenu                                                        */
/* ------------------------------------------------------------------ */

interface MenuItem {
  label: string
  icon?: IconName
  onClick?: () => void
  disabled?: boolean
  tone?: 'down'
}

interface DropdownMenuProps {
  children: ReactNode
  items: (MenuItem | 'separator')[]
  label?: string
}

export function DropdownMenu({ children, items, label }: DropdownMenuProps) {
  return (
    <RMenu.Root>
      {/* A span, same trick as Tooltip's clay-tip-anchor: clay primitives take
          closed props, so asChild has no DOM node to reach inside <Button> —
          but wrapping in a <button> nested the caller's Button inside it,
          which HTML forbids (browsers may reparent, and React logs it as an
          error). Radix's pointer/key handlers sit on the span; events from the
          real Button inside bubble up to them. */}
      <RMenu.Trigger asChild>
        <span aria-label={label} className="clay-menu__anchor">
          {children}
        </span>
      </RMenu.Trigger>
      <RMenu.Portal>
        <RMenu.Content className="clay-menu" sideOffset={8} align="start" asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.14, ease: 'easeOut' }}
          >
            {items.map((item, i) => {
              if (item === 'separator') return <RMenu.Separator key={i} className="clay-menu__sep" />
              return (
                <RMenu.Item
                  key={i}
                  className={clsx('clay-menu__item', item.tone === 'down' && 'clay-menu__item--down')}
                  onClick={item.onClick}
                  disabled={item.disabled}
                >
                  {item.icon && <Icon name={item.icon} size="sm" />}
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
