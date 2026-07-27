import { AspectRatio } from '../aspectratio'
import type { Demo } from './types'

export const aspectRatioDemos: Demo[] = [
  { id: 'wide', render: () => (
      <div style={{ maxWidth: 320 }}>
        <AspectRatio ratio={16 / 9}>
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--purple)',
              color: 'var(--on-accent)',
              fontWeight: 900,
              fontSize: 14,
            }}
          >
            16:9 container
          </div>
        </AspectRatio>
      </div>
    ) },
  { id: 'square', render: () => (
      <div style={{ maxWidth: 200 }}>
        <AspectRatio ratio={1}>
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--mint)',
              color: 'var(--on-accent)',
              fontWeight: 900,
              fontSize: 14,
            }}
          >
            1:1 container
          </div>
        </AspectRatio>
      </div>
    ) },
]
