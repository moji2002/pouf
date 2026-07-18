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
    if (variant === 'default') toast('Trade filled — sample order')
    else if (variant === 'success') toast.success('Order filled at 64,201', { description: 'Apple · 0.4 · Limit' })
    else if (variant === 'error') toast.error('API connection lost', { description: 'Retrying…' })
    else if (variant === 'warning')
      toast.warning('Approaching daily limit', { description: '2.1% remaining. Consider pausing.' })
    else toast.info('New signal from #apple-signals', { description: 'Long entry at 64,200 · TP 64,500 · SL 64,000' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <Toaster />
}

export const toasterDemos: Demo[] = [
  { id: 'trigger', states: ['hover', 'focus'], render: () => (
      <span data-subject>
        <Row>
          <Button size="sm" tone="purple" onClick={() => toast('Trade filled')}>Show toast</Button>
        </Row>
      </span>
    ) },
  { id: 'default-open', render: () => <ToasterOpen variant="default" /> },
  { id: 'success-open', render: () => <ToasterOpen variant="success" /> },
  { id: 'error-open', render: () => <ToasterOpen variant="error" /> },
  { id: 'warning-open', render: () => <ToasterOpen variant="warning" /> },
  { id: 'info-open', render: () => <ToasterOpen variant="info" /> },
]
