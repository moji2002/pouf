import { useEffect, useRef } from 'react'
import { DropdownMenu } from '../menu'
import { Button } from '../Button'
import { simulateOpen } from './interact'
import type { Demo } from './types'

const items = [
  { label: 'Edit', icon: 'draft' as const, onClick: () => {} },
  { label: 'Duplicate', icon: 'add' as const, onClick: () => {} },
  'separator' as const,
  { label: 'Delete', icon: 'remove' as const, tone: 'down' as const, onClick: () => {} },
]

function DropdownMenuOpen() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => { simulateOpen(ref.current?.querySelector('button')) }, [])
  return (
    <div ref={ref}>
      <DropdownMenu label="Actions" items={items}>
        <Button size="sm">Actions</Button>
      </DropdownMenu>
    </div>
  )
}

export const dropdownMenuDemos: Demo[] = [
  { id: 'trigger', states: ['hover', 'focus'], render: () => (
      <span data-subject>
        <DropdownMenu label="Actions" items={items}>
          <Button size="sm">Actions</Button>
        </DropdownMenu>
      </span>
    ) },
  { id: 'open', render: () => <DropdownMenuOpen /> },
]
