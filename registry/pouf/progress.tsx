import * as RProgress from '@radix-ui/react-progress'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { toneClass, type Tone } from './tone'

interface ProgressProps {
  value: number
  max?: number
  tone?: Tone
  label?: string
}

export function Progress({ value, max = 100, tone = 'purple', label }: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <RProgress.Root className="pouf-progress" value={value} max={max} aria-label={label}>
      <RProgress.Indicator asChild>
        {/* data-zero releases the fill's min-width floor: the floor keeps a
            low percentage from squashing into an ellipse, but 0 must render
            as nothing, not as a 16px bead of imaginary progress. */}
        <motion.div
          className={clsx('pouf-progress__fill', toneClass(tone))}
          data-zero={pct === 0 ? '' : undefined}
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 200, damping: 24 }}
        />
      </RProgress.Indicator>
    </RProgress.Root>
  )
}
