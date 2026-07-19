import { cva } from 'class-variance-authority'
import type { ReactNode } from 'react'

const cta = cva('pouf-cta rounded-card px-(--s7) py-(--s8) flex flex-col items-center text-center gap-(--s4) cushion-control', {
  variants: {
    tone: {
      purple: 'bg-purple',
      pink: 'bg-pink',
      blue: 'bg-blue',
      mint: 'bg-mint',
      yellow: 'bg-yellow',
      surface: 'bg-surface',
    },
  },
  defaultVariants: { tone: 'purple' },
})

interface CTAProps {
  title: string
  description?: string
  /** The action(s) — a Button, or two. */
  action: ReactNode
  tone?: 'purple' | 'pink' | 'blue' | 'mint' | 'yellow' | 'surface'
}

/** A call-to-action banner: a big tonal cushion with a headline and an action.
 * The one loud thing at the bottom of a page. */
export function CTA({ title, description, action, tone }: CTAProps) {
  return (
    <section className={cta({ tone })}>
      <h2 className="m-0 font-black text-[clamp(28px,4vw,44px)] tracking-[-0.02em] leading-[1.05] text-ink">{title}</h2>
      {description && <p className="m-0 font-bold text-[18px] text-ink/70 max-w-[52ch]">{description}</p>}
      <div className="flex flex-wrap gap-(--s3) justify-center mt-(--s2)">{action}</div>
    </section>
  )
}
