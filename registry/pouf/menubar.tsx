import * as RMenubar from '@radix-ui/react-menubar'
import clsx from 'clsx'
import { motion, useReducedMotion } from 'framer-motion'
import { renderIcon, type IconLike } from './Icon'

export interface MenubarItem {
  label: string
  icon?: IconLike
  onClick?: () => void
  disabled?: boolean
  tone?: 'down'
}

export interface MenubarMenu {
  label: string
  items: (MenubarItem | 'separator')[]
}

/** An application menu bar (File / Edit / View…). Each top-level label opens a
 * clay menu; arrow keys move between them once one is open. */
export function Menubar({ menus }: { menus: MenubarMenu[] }) {
  const reduceMotion = useReducedMotion()
  return (
    <RMenubar.Root className="pouf-menubar inline-flex items-center gap-[2px] p-[6px] rounded-pill bg-surface cushion-card">
      {menus.map((menu) => (
        <RMenubar.Menu key={menu.label}>
          <RMenubar.Trigger className="pouf-menubar__trigger font-extrabold text-ink px-(--s3) py-(--s2) rounded-pill cursor-pointer data-[state=open]:bg-purple hover:bg-[rgba(201,168,255,0.25)]">
            {menu.label}
          </RMenubar.Trigger>
          <RMenubar.Portal>
            <RMenubar.Content className="pouf-menu" align="start" sideOffset={8} asChild>
              <motion.div
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0.01 : 0.14, ease: 'easeOut' }}
              >
                {menu.items.map((item, i) => {
                  if (item === 'separator') return <RMenubar.Separator key={i} className="pouf-menu__sep" />
                  return (
                    <RMenubar.Item
                      key={i}
                      className={clsx('pouf-menu__item', item.tone === 'down' && 'pouf-menu__item--down')}
                      onClick={item.onClick}
                      disabled={item.disabled}
                    >
                      {item.icon && renderIcon(item.icon, 'sm')}
                      {item.label}
                    </RMenubar.Item>
                  )
                })}
              </motion.div>
            </RMenubar.Content>
          </RMenubar.Portal>
        </RMenubar.Menu>
      ))}
    </RMenubar.Root>
  )
}
