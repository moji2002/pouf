import { useEffect, useRef } from 'react'
import { Menubar } from '../menubar'
import { simulateOpen } from './interact'
import type { Demo } from './types'

const menus = [
  { label: 'File', items: [
    { label: 'New file', icon: 'add' as const, onClick: () => {} },
    { label: 'Open…', icon: 'expand' as const, onClick: () => {} },
    'separator' as const,
    { label: 'Delete', icon: 'remove' as const, tone: 'down' as const, onClick: () => {} },
  ] },
  { label: 'Edit', items: [
    { label: 'Undo', onClick: () => {} },
    { label: 'Redo', onClick: () => {} },
  ] },
  { label: 'View', items: [
    { label: 'Zoom in', onClick: () => {} },
    { label: 'Zoom out', onClick: () => {} },
  ] },
]

function MenubarOpen() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => { simulateOpen(ref.current?.querySelector('button')) }, [])
  return <div ref={ref}><Menubar menus={menus} /></div>
}

export const menubarDemos: Demo[] = [
  { id: 'default', states: ['hover', 'focus'], render: () => <span data-subject><Menubar menus={menus} /></span> },
  { id: 'open', render: () => <MenubarOpen /> },
]
