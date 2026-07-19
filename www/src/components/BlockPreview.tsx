import { DashboardBlock } from '../../../registry/pouf/blocks/dashboard'
import { LoginBlock } from '../../../registry/pouf/blocks/login'
import { SettingsBlock } from '../../../registry/pouf/blocks/settings'

const BLOCKS: Record<string, () => React.ReactNode> = {
  dashboard: DashboardBlock,
  login: LoginBlock,
  settings: SettingsBlock,
}

/** Renders a full example template by slug as a live island. */
export function BlockPreview({ slug }: { slug: string }) {
  const Block = BLOCKS[slug]
  if (!Block) return <div style={{ color: 'var(--muted)' }}>Unknown block: {slug}</div>
  return <Block />
}
