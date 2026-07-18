import { Status, Freshness, ModeBanner } from '../status'
import { Stack } from '../layout'
import { Text } from '../text'
import type { Demo } from './types'

// Status/Freshness derive their state from `now - at`, computed internally
// with their own Date.now(). To stay deterministic without this file ever
// calling Date.now() itself, `at` is pinned to literal epoch constants:
// a timestamp ahead of "now" clamps `now - at` to 0 (Math.max(0, ...) in the
// component) — reading as "just happened", forever, no matter when this
// runs. A timestamp far in the past is always stale, for the same reason.
const FUTURE_MS = 4_102_444_800_000 // 2100-01-01T00:00:00Z
// 1ms past epoch, not 0: Freshness's own staleness check is `at > 0`, so a
// literal 0 reads as "no timestamp" and the component renders null instead
// of the stale state this demo means to show.
const PAST_MS = 1

export const statusDemos: Demo[] = [
  { id: 'no-timestamp', render: () => <Status label="Engine off" tone="idle" /> },
  { id: 'fresh', render: () => <Status label="Trading enabled" tone="up" at={FUTURE_MS} /> },
  { id: 'stale', render: () => <Status label="Telegram connected" tone="up" at={PAST_MS} /> },
]

export const freshnessDemos: Demo[] = [
  // Renders nothing when healthy — that's the contract, not a bug. Wrapped
  // with a caption so the demo root isn't literally empty.
  { id: 'healthy', render: () => (
      <Stack gap={2}>
        <Text size="sm" muted>Renders nothing while the data is fresh:</Text>
        <Freshness at={FUTURE_MS} />
      </Stack>
    ) },
  { id: 'stale', render: () => <Freshness at={PAST_MS} /> },
  { id: 'error', render: () => <Freshness at={FUTURE_MS} isError /> },
]

export const modeBannerDemos: Demo[] = [
  { id: 'paper', render: () => <ModeBanner live={false} /> },
  { id: 'live', render: () => <ModeBanner live /> },
]
