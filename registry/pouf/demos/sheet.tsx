import { useState } from 'react'
import { Sheet } from '../sheet'
import { Button } from '../Button'
import { Switch } from '../controls'
import { Stack } from '../layout'
import type { Demo } from './types'

function SheetBody() {
  const [push, setPush] = useState(true)
  const [email, setEmail] = useState(false)
  return (
    <Stack gap={3}>
      <Switch checked={push} onChange={setPush} label="Push notifications" />
      <Switch checked={email} onChange={setEmail} label="Email digests" />
    </Stack>
  )
}

export const sheetDemos: Demo[] = [
  { id: 'trigger', viewport: 'mobile', states: ['hover', 'focus'], render: () => (
      <span data-subject>
        <Sheet trigger={<Button tone="blue" size="sm">Open sheet</Button>} title="Notification settings" description="Manage how you receive alerts.">
          <SheetBody />
        </Sheet>
      </span>
    ) },
  // Sheet exposes a controlled `open` prop — no simulation needed.
  { id: 'open', viewport: 'mobile', render: () => (
      <Sheet
        open
        onOpenChange={() => {}}
        trigger={<Button tone="blue" size="sm">Open sheet</Button>}
        title="Notification settings"
        description="Manage how you receive alerts."
      >
        <SheetBody />
      </Sheet>
    ) },
]
