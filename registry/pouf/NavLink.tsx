import clsx from 'clsx'
import type { ReactElement, ReactNode } from 'react'
import { toneClass, type Tone } from './tone'
import { Icon, type IconName } from './Icon'

export type LinkComponent = (props: {
  href: string
  className?: string
  'aria-current'?: 'page'
  children: ReactNode
}) => ReactElement

const Anchor: LinkComponent = (props) => <a {...props} />

/** True when `href` is the active route. Exact for '/', prefix elsewhere so
 *  nested paths keep their tab lit. */
export function isActivePath(href: string, currentPath: string): boolean {
  return href === '/'
    ? currentPath === '/'
    : currentPath === href || currentPath.startsWith(`${href}/`)
}

interface NavLinkProps {
  href: string
  /** The app's current pathname — pouf has no router; the host app does. */
  currentPath: string
  children: ReactNode
  icon: IconName
  tone?: Tone
  /** Swap in your router's Link (must forward href/className/children). */
  link?: LinkComponent
}

export function NavLink({ href, currentPath, children, icon, tone = 'purple', link: Link = Anchor }: NavLinkProps) {
  const active = isActivePath(href, currentPath)
  return (
    <Link
      href={href}
      className={clsx('pouf-navlink', active && 'pouf-navlink--active', active && toneClass(tone))}
      aria-current={active ? 'page' : undefined}
    >
      <Icon name={icon} size="md" />
      {children}
    </Link>
  )
}
