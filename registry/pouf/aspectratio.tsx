import * as RAspect from '@radix-ui/react-aspect-ratio'
import type { ReactNode } from 'react'

export function AspectRatio({ ratio = 16 / 9, children }: { ratio?: number; children: ReactNode }) {
  return (
    <div className="pouf-aspect">
      <RAspect.Root ratio={ratio}>{children}</RAspect.Root>
    </div>
  )
}
