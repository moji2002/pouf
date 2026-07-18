import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { Row } from './layout'
import { Text } from './text'
import { Blob, Dot } from './media'
import { toneClass, type Tone } from './tone'

/** How old a reading may be before we stop vouching for it. The overview polls
 * every 5s, so 15s means "we've missed roughly three polls" — that's a
 * connection problem, not jitter. */
const STALE_AFTER_MS = 15_000

export interface StatusProps {
  label: string
  tone: Tone
  /** Epoch ms of the reading. Omit only for values that cannot go stale. */
  at?: number
}

function duration(ms: number): string {
  const s = Math.floor(ms / 1000)
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m`
  return `${Math.floor(m / 60)}h`
}

function age(ms: number): string {
  return `${duration(ms)} ago`
}

/** A status readout that refuses to overstate its own confidence.
 *
 * Two things this fixes, both of which a bare coloured dot gets wrong:
 *
 * 1. A green dot on a polled UI means "green as of some past moment we aren't
 *    showing you." On a trading engine that is worse than no indicator: the
 *    operator reads "connected" off a value that may be a minute stale, from a
 *    poll that has been failing. So a reading past STALE_AFTER_MS drops to an
 *    explicit unknown state rather than keeping its last colour.
 * 2. WCAG 2.2 SC 1.4.1 (Level A) forbids colour as the only carrier of
 *    information. The dot is decorative (aria-hidden) and the text is the
 *    actual signal — so this reads correctly with no colour vision at all.
 */
export function Status({ label, tone, at }: StatusProps) {
  // Re-render on a timer so the age text ages even when no data arrives —
  // otherwise a dead poll leaves a confident "2s ago" frozen on screen forever,
  // which is the exact lie this component exists to prevent.
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (at === undefined) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [at])

  const elapsed = at === undefined ? 0 : Math.max(0, now - at)
  const stale = at !== undefined && elapsed > STALE_AFTER_MS

  return (
    <Row gap={2} wrap={false}>
      <Dot tone={stale ? 'warn' : tone} />
      <Text size="sm">{stale ? `${label} — unconfirmed` : label}</Text>
      {at !== undefined && (
        <Text size="sm" muted num>
          {age(elapsed)}
        </Text>
      )}
    </Row>
  )
}

interface FreshnessProps {
  /** react-query's dataUpdatedAt — when a fetch last SUCCEEDED. */
  at: number
  isError?: boolean
}

/** Speaks only when the data on screen can no longer be trusted.
 *
 * A healthy poll renders nothing: a routine "Updated 2s ago" readout on every
 * screen is chatter, and chatter trains the operator to stop reading. What
 * remains are the two states that must not be missed — the most recent fetch
 * failed (what's on screen is the last known value, not the current one), or
 * no fetch has succeeded for longer than STALE_AFTER_MS.
 */
export function Freshness({ at, isError }: FreshnessProps) {
  // The 1s tick still runs while healthy: staleness is the *absence* of new
  // data, so nothing else would trigger the re-render that surfaces it.
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const elapsed = at > 0 ? Math.max(0, now - at) : 0
  const stale = at > 0 && elapsed > STALE_AFTER_MS

  if (!isError && !stale) return null

  return (
    <Row gap={2} wrap={false}>
      <Dot tone={isError ? 'down' : 'warn'} />
      <Text size="sm" muted>
        {isError ? 'Update failed — showing last known' : `No update for ${duration(elapsed)}`}
      </Text>
    </Row>
  )
}

/** The paper/live indicator.
 *
 * Lives in the shell rather than on a settings screen: the single most
 * expensive mistake this admin permits is believing you are in paper mode while
 * the engine is live, and a checkbox you have to go and look at cannot prevent
 * it. Text carries the state; the tone and pulse only amplify it (SC 1.4.1).
 */
export function ModeBanner({ live }: { live: boolean }) {
  return (
    <div
      className={clsx('clay-mode', live && 'clay-mode--live', toneClass(live ? 'orange' : 'blue'))}
      role="status"
      aria-live="polite"
    >
      <Blob tone={live ? 'orange' : 'blue'} size="sm" icon={live ? 'live' : 'draft'} />
      <Text>{live ? 'LIVE — orders use real funds' : 'PAPER — simulated, no real funds'}</Text>
    </div>
  )
}
