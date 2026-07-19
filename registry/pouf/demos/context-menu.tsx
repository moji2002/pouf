import { useEffect, useRef } from 'react'
import { ContextMenu } from '../menu'
import { Text } from '../text'
import type { Demo } from './types'

const items = [
  { label: 'Open', icon: 'expand' as const, onClick: () => {} },
  { label: 'Rename', icon: 'draft' as const, onClick: () => {} },
  'separator' as const,
  { label: 'Delete', icon: 'remove' as const, tone: 'down' as const, onClick: () => {} },
]

const surface = (
  <div style={{ display: 'grid', placeItems: 'center', minHeight: 120, borderRadius: 20, background: 'var(--bg)', boxShadow: 'var(--pouf-field)', padding: 24 }}>
    <Text muted>Right-click anywhere in this area</Text>
  </div>
)

function ContextMenuOpen() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current?.querySelector('[data-radix-context-menu-trigger]') ?? ref.current?.firstElementChild
    if (!el) return
    const r = el.getBoundingClientRect()
    el.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: r.left + 40, clientY: r.top + 40, button: 2 }))
  }, [])
  return <div ref={ref}><ContextMenu items={items}>{surface}</ContextMenu></div>
}

export const contextMenuDemos: Demo[] = [
  { id: 'trigger', render: () => <ContextMenu items={items}>{surface}</ContextMenu> },
  { id: 'open', render: () => <ContextMenuOpen /> },
]
