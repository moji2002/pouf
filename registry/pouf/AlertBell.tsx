import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import type { ReactNode } from 'react'
import { Icon } from './Icon'
import { Text } from './text'
import { Empty } from './feedback'

/** The alert history behind the toasts.
 *
 * Toasts are the interruption; this is the record. It exists because a toast that has
 * faded (or that fired while the tab was in the background) must still be discoverable —
 * otherwise "I stepped away for ten minutes" means "I have no idea what happened".
 *
 * It is a *session* record, not an archive: it holds what the app kept in memory,
 * while your own backend remains the permanent log.
 */

export interface AlertBellItem {
  id: number
  severity: 'critical' | 'info'
  at: string
  text: string
}

/** Same `*bold*` handling as Toast — see the note there on why the markers survive. */
function emphasise(text: string): ReactNode[] {
  return text
    .split(/\*([^*]+)\*/g)
    .map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>))
}

interface Props {
  alerts: AlertBellItem[]
  unread: number
  connected: boolean
  onOpen: () => void
}

export function AlertBell({ alerts, unread, connected, onOpen }: Props) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)

  // Close on outside click and on Escape. A panel pinned open over the dashboard is
  // worse than one that is slightly too eager to close.
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const toggle = () => {
    const next = !open
    setOpen(next)
    if (next) onOpen() // opening IS reading — that's what clears the badge
  }

  return (
    <div className="pouf-bell" ref={root}>
      <button
        type="button"
        className="pouf-bell__button"
        onClick={toggle}
        aria-expanded={open}
        aria-label={unread > 0 ? `Notifications, ${unread} unread` : 'Notifications'}
      >
        <Icon name="alerts" size="sm" />
        <span className="pouf-bell__label">Alerts</span>
        {/* The count is aria-hidden because the button's own label already states it —
            otherwise a screen reader reads the number twice. */}
        {unread > 0 && (
          <span className="pouf-bell__badge" aria-hidden="true">
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="pouf-bell__panel">
          {/* An empty panel is ambiguous: "nothing happened" and "we lost the stream and
              can't tell you" look identical. Say which one it is. */}
          {!connected && (
            <div className="pouf-bell__offline" role="status">
              <Text size="sm">Alert stream disconnected — reconnecting. You may be missing alerts.</Text>
            </div>
          )}

          {alerts.length === 0 ? (
            <Empty icon="alerts" title="No alerts yet">
              Updates and alerts appear here as things happen.
            </Empty>
          ) : (
            <ul className="pouf-bell__list">
              {alerts.map((a) => (
                <li key={a.id} className={clsx('pouf-bell__item', a.severity === 'critical' && 'tone-down')}>
                  <Icon name={a.severity === 'critical' ? 'warn' : 'ok'} size="sm" />
                  <div className="pouf-bell__itembody">
                    <Text size="sm">{emphasise(a.text)}</Text>
                    <Text size="sm" muted num>
                      {new Date(a.at).toLocaleTimeString()}
                    </Text>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
