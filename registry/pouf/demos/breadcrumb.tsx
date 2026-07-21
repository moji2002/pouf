import { Breadcrumb } from '../breadcrumb'
import type { Demo } from './types'

export const breadcrumbDemos: Demo[] = [
  { id: 'default', render: () => (
      <Breadcrumb items={[
        { label: 'Dashboard', href: '#' },
        { label: 'Reports', href: '#' },
        { label: '#fruit-stand' },
      ]} />
    ) },
  { id: 'single', render: () => <Breadcrumb items={[{ label: 'Dashboard' }]} /> },
]
