import { Navbar } from '../navbar'
import { Button } from '../Button'
import { Blob } from '../media'
import type { Demo } from './types'

const brand = (
  <>
    <Blob icon="target" tone="purple" size="sm" />
    Acme
  </>
)
const links = [
  { label: 'Product', href: '#', active: true },
  { label: 'Pricing', href: '#' },
  { label: 'Docs', href: '#' },
]

export const navbarDemos: Demo[] = [
  { id: 'default', render: () => (
      <Navbar brand={brand} links={links} actions={<Button size="sm">Sign in</Button>} />
    ) },
  { id: 'minimal', render: () => (
      <Navbar brand={brand} actions={<><Button size="sm" variant="quiet">Log in</Button><Button size="sm" tone="mint">Start</Button></>} />
    ) },
]
