import { useEffect, useRef } from 'react'
import { BottomNav } from '../BottomNav'
import type { NavGroup, NavItem } from '../BottomNav'
import { simulateOpen } from './interact'
import type { Demo } from './types'

const primary: NavItem[] = [
  { href: '/overview', label: 'Overview', icon: 'overview', tone: 'purple' },
  { href: '/positions', label: 'Projects', icon: 'positions', tone: 'blue' },
]
const groups: NavGroup[] = [
  {
    title: 'Main',
    items: [
      { href: '/overview', label: 'Overview', icon: 'overview', tone: 'purple' },
      { href: '/positions', label: 'Projects', icon: 'positions', tone: 'blue' },
      { href: '/settings', label: 'Settings', icon: 'settings', tone: 'mint' },
    ],
  },
]

function BottomNavMenuOpen() {
  const ref = useRef<HTMLDivElement>(null)
  // The only <button> among BottomNav's tabs — the rest render as <a>.
  useEffect(() => { simulateOpen(ref.current?.querySelector('button')) }, [])
  return (
    <div ref={ref}>
      <BottomNav primary={primary} groups={groups} currentPath="/overview" />
    </div>
  )
}

export const bottomNavDemos: Demo[] = [
  { id: 'default', viewport: 'mobile', render: () => <BottomNav primary={primary} groups={groups} currentPath="/overview" /> },
  // Menu lights up when the current page isn't one of the primary tabs.
  { id: 'on-secondary-page', viewport: 'mobile', render: () => (
      <BottomNav primary={primary} groups={groups} currentPath="/settings" />
    ) },
  { id: 'menu-open', viewport: 'mobile', render: () => <BottomNavMenuOpen /> },
]
