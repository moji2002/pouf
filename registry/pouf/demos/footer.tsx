import { Footer } from '../footer'
import { Blob } from '../media'
import type { Demo } from './types'

const brand = (<><Blob icon="target" tone="pink" size="sm" />Acme</>)
const columns = [
  { title: 'Product', links: [{ label: 'Features', href: '#' }, { label: 'Pricing', href: '#' }, { label: 'Changelog', href: '#' }] },
  { title: 'Company', links: [{ label: 'About', href: '#' }, { label: 'Blog', href: '#' }, { label: 'Careers', href: '#' }] },
  { title: 'Legal', links: [{ label: 'Privacy', href: '#' }, { label: 'Terms', href: '#' }] },
]

export const footerDemos: Demo[] = [
  { id: 'default', render: () => (
      <Footer brand={brand} tagline="Soft software, seriously built." columns={columns} note="© 2026 Acme. All rights reserved." />
    ) },
]
