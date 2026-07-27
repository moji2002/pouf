import { Button, IconButton } from '../Button'
import { Icon } from '../Icon'
import type { Demo } from './types'

export const buttonDemos: Demo[] = [
  { id: 'solid-md', states: ['hover', 'active', 'focus'], render: () => <span data-subject><Button>Save</Button></span> },
  { id: 'tones', render: () => (<>
      <Button tone="pink">Pink</Button><Button tone="mint">Mint</Button>
      <Button tone="blue">Blue</Button><Button tone="yellow">Yellow</Button>
    </>) },
  { id: 'sizes', render: () => (<><Button size="sm">Small</Button><Button>Medium</Button><Button size="lg">Large</Button></>) },
  { id: 'quiet', states: ['hover'], render: () => <span data-subject><Button variant="quiet">Cancel</Button></span> },
  { id: 'block', render: () => <Button block>Full width</Button> },
  { id: 'disabled', render: () => <Button disabled>Disabled</Button> },
  { id: 'loading', render: () => <Button loading>Saving…</Button> },
  {
    id: 'icon',
    states: ['hover', 'active', 'focus'],
    render: () => <span data-subject><IconButton icon={<Icon name="settings" size="sm" />} label="Settings" /></span>,
  },
]
