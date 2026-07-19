import { CTA } from '../cta'
import { Button } from '../Button'
import type { Demo } from './types'

export const ctaDemos: Demo[] = [
  { id: 'default', render: () => (
      <CTA title="Ready to get puffy?" description="One command drops a component into your project." action={<Button size="lg">Get started</Button>} />
    ) },
  { id: 'tones', render: () => (
      <CTA tone="mint" title="Start your free trial" action={<><Button size="lg" tone="mint">Start free</Button><Button size="lg" variant="quiet">Talk to sales</Button></>} />
    ) },
]
