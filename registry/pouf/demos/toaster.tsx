import { useEffect } from 'react'
import { Button } from '../Button'
import { Row } from '../layout'
import { toast, Toaster } from '../toaster'
import type { ToastVariant } from '../toaster'
import type { Demo } from './types'

/** toaster.tsx's toast state is a module-level singleton (see its header
 * comment) — there is no controlled-open prop to render into, so each
 * "-open" demo below fires the imperative API itself, once, on mount. This
 * assumes each demo gets a fresh page load; navigating between these via a
 * hash change on an already-open page would accumulate toasts rather than
 * replace them, since nothing here ever clears the queue. */
function ToasterOpen({ variant }: { variant: ToastVariant }) {
  useEffect(() => {
    if (variant === 'default') toast('Saved — sample note')
    else if (variant === 'success') toast.success('Payment received', { description: '$48.00 · Visa ending 4242' })
    else if (variant === 'error') toast.error('API connection lost', { description: 'Retrying…' })
    else if (variant === 'warning')
      toast.warning('Storage almost full', { description: '92% used. Consider upgrading.' })
    else toast.info('Maya replied to your thread', { description: '“depth is the whole personality”' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <Toaster />
}

export const toasterDemos: Demo[] = [
  { id: 'trigger', states: ['hover', 'focus'], render: () => (
      <Row gap={2}>
        <span data-subject>
          <Button size="sm" tone="purple" onClick={() => toast('Saved — sample note')}>Default</Button>
        </span>
        <Button size="sm" tone="mint" onClick={() => toast.success('Payment received', { description: '$48.00 · Visa ending 4242' })}>Success</Button>
        <Button size="sm" tone="pink" onClick={() => toast.error('API connection lost', { description: 'Retrying…' })}>Error</Button>
        <Button size="sm" tone="yellow" onClick={() => toast.warning('Storage almost full', { description: '92% used. Consider upgrading.' })}>Warning</Button>
        <Button size="sm" tone="blue" onClick={() => toast.info('Maya replied to your thread', { description: '“depth is the whole personality”' })}>Info</Button>
        <Button size="sm" variant="quiet" onClick={() => toast('Note deleted', { action: { label: 'Undo', onClick: () => toast.success('Restored') } })}>With action</Button>
      </Row>
    ) },
  { id: 'default-open', render: () => <ToasterOpen variant="default" /> },
  { id: 'success-open', render: () => <ToasterOpen variant="success" /> },
  { id: 'error-open', render: () => <ToasterOpen variant="error" /> },
  { id: 'warning-open', render: () => <ToasterOpen variant="warning" /> },
  { id: 'info-open', render: () => <ToasterOpen variant="info" /> },
]
