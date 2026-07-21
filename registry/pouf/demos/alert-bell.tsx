import { useEffect, useRef } from 'react'
import { AlertBell } from '../AlertBell'
import type { AlertBellItem } from '../AlertBell'
import { simulateOpen } from './interact'
import type { Demo } from './types'

// Fixed ISO strings, not Date.now() — deterministic content. Note AlertBell
// itself formats `at` with `.toLocaleTimeString()`, which is locale/timezone
// dependent at render time; that's a determinism gap in the component, not
// something this demo can paper over.
const alerts: AlertBellItem[] = [
  { id: 1, severity: 'critical', at: '2024-01-01T12:00:00.000Z', text: 'Build failed — the deploy was rolled back.' },
  { id: 2, severity: 'info', at: '2024-01-01T11:58:00.000Z', text: 'Maya commented on your post.' },
]

function AlertBellOpen({ items, connected = true }: { items: AlertBellItem[]; connected?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => { simulateOpen(ref.current?.querySelector('button')) }, [])
  return (
    <div ref={ref}>
      <AlertBell alerts={items} unread={items.length} connected={connected} onOpen={() => {}} />
    </div>
  )
}

export const alertBellDemos: Demo[] = [
  { id: 'trigger', states: ['hover', 'focus'], render: () => (
      <span data-subject>
        <AlertBell alerts={alerts} unread={2} connected onOpen={() => {}} />
      </span>
    ) },
  { id: 'open-with-alerts', render: () => <AlertBellOpen items={alerts} /> },
  { id: 'open-empty', render: () => <AlertBellOpen items={[]} /> },
  { id: 'disconnected', render: () => <AlertBellOpen items={[]} connected={false} /> },
]
