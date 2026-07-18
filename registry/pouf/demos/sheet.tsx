import { Sheet } from '../sheet'
import { Button } from '../Button'
import { Switch } from '../controls'
import { Stack } from '../layout'
import type { Demo } from './types'

const sheetBody = (
  <Stack gap={3}>
    <Switch checked onChange={() => {}} label="Push notifications" />
    <Switch checked={false} onChange={() => {}} label="Email digests" />
  </Stack>
)

export const sheetDemos: Demo[] = [
  { id: 'trigger', viewport: 'mobile', states: ['hover', 'focus'], render: () => (
      <span data-subject>
        <Sheet trigger={<Button tone="blue" size="sm">Open sheet</Button>} title="Notification settings" description="Manage how you receive alerts.">
          {sheetBody}
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
        {sheetBody}
      </Sheet>
    ) },
]
