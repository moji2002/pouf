import { NavLink } from '../NavLink'
import type { Demo } from './types'

export const navLinkDemos: Demo[] = [
  { id: 'active', states: ['hover', 'focus'], render: () => (
      <span data-subject>
        <NavLink href="#overview" currentPath="#overview" icon="overview">Overview</NavLink>
      </span>
    ) },
  { id: 'inactive', render: () => <NavLink href="#settings" currentPath="#overview" icon="settings">Settings</NavLink> },
  { id: 'tone', render: () => <NavLink href="#live" currentPath="#live" icon="live" tone="orange">Live</NavLink> },
]
