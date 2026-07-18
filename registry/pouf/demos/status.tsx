import { Status, Freshness, ModeBanner } from '../status'
import { Stack } from '../layout'
import { Text } from '../text'
import type { Demo } from './types'

// Status/Freshness derive their state from `now - at`, computed internally
// with their own Date.now(). A fresh timestamp is pinned to 2100 — clamped
// to "just happened" forever. A stale one CANNOT be a fixed epoch constant:
// the rendered age string ("3h ago") keeps aging against wall-clock, so a
// snapshot taken today diffs against one taken tomorrow. Instead the stale
// offset is computed from render-time Date.now(): always exactly "3h ago",
// stable within any single capture run — which is the determinism the
// snapshot gate actually needs.
const FUTURE_MS = 4_102_444_800_000 // 2100-01-01T00:00:00Z
const STALE_3H = () => Date.now() - 3 * 60 * 60 * 1000

export const statusDemos: Demo[] = [
  { id: 'no-timestamp', render: () => <Status label="Engine off" tone="idle" /> },
  { id: 'fresh', render: () => <Status label="Sync enabled" tone="up" at={FUTURE_MS} /> },
  { id: 'stale', render: () => <Status label="Telegram connected" tone="up" at={STALE_3H()} /> },
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
  { id: 'stale', render: () => <Freshness at={STALE_3H()} /> },
  { id: 'error', render: () => <Freshness at={FUTURE_MS} isError /> },
]

export const modeBannerDemos: Demo[] = [
  { id: 'paper', render: () => <ModeBanner live={false} /> },
  { id: 'live', render: () => <ModeBanner live /> },
]
