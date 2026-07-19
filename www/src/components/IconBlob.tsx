import { Blob } from '../../../registry/pouf/media'
import type { IconName } from '../../../registry/pouf/Icon'
import type { Tone } from '../../../registry/pouf/tone'

/** A single Pouf Blob, for static gallery cards. */
export function IconBlob({ icon, tone, size = 'md' }: { icon: IconName; tone: Tone; size?: 'sm' | 'md' | 'lg' }) {
  return <Blob icon={icon} tone={tone} size={size} />
}
