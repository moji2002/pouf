import clsx from 'clsx'
import type { ReactNode } from 'react'
import { toneClass, type Tone } from './tone'

interface HeadingProps {
  children: ReactNode
  level?: 1 | 2 | 3
}

/* Static per-level strings (not template-built class names): Tailwind's
 * scanner reads source text and cannot see a computed `pouf-h${level}`. */
const HEADING = {
  1: 'pouf-h1 font-black text-[48px] tracking-[-1px] leading-[1.1]',
  2: 'pouf-h2 font-black text-[28px] tracking-[-0.5px] leading-[1.2]',
  /* h1/h2 set 1.1/1.2; without this h3 inherits the body's 1.5 and its line
     box towers over the 44px blob it commonly sits beside. */
  3: 'pouf-h3 font-black text-[19px] tracking-[-0.2px] leading-[1.2]',
} as const

export function Heading({ children, level = 2 }: HeadingProps) {
  const Tag = `h${level}` as const
  return <Tag className={HEADING[level]}>{children}</Tag>
}

/** The reference's yellow highlight-swatch behind a word. */
export function Highlight({ children, tone = 'yellow' }: { children: ReactNode; tone?: Tone }) {
  return (
    <span
      className={clsx(
        'pouf-highlight inline-block px-[14px] rounded-control bg-[var(--tone,var(--yellow))]',
        '[box-shadow:inset_0_-6px_0_rgba(0,0,0,0.08)]',
        toneClass(tone),
      )}
    >
      {children}
    </span>
  )
}

/** The reference's uppercase section eyebrow. Restricted to white surfaces:
 * --muted measures 3.93:1 on --bg (fails) but 4.64:1 on white (passes). */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="pouf-eyebrow text-[14px] tracking-[2px] uppercase font-extrabold text-muted">
      {children}
    </div>
  )
}

interface TextProps {
  children: ReactNode
  size?: 'sm' | 'md'
  muted?: boolean
  /** Tabular numerals — use for any figure in a column that must align. */
  num?: boolean
  mono?: boolean
  truncate?: boolean
}

export function Text({ children, size = 'md', muted, num, mono, truncate }: TextProps) {
  return (
    // dir="auto" by default, and deliberately not opt-in.
    //
    // Almost everything this admin renders is user-generated: Telegram channel
    // titles and raw signal text, in whatever language the operator follows.
    // Without this, a Persian or Arabic channel name renders with its emoji and
    // punctuation on the wrong side — visibly wrong, and easy to miss if your
    // own test data is all English.
    //
    // Safe as a blanket default: dir="auto" resolves from the first STRONG
    // character, and digits/punctuation are neutral — so "+2.41%" and "BTCUSDT"
    // stay LTR. Opting in per call site would mean remembering it at every one,
    // which is how the bug comes back.
    <span
      dir="auto"
      className={clsx(
        'pouf-text font-bold',
        size === 'md' ? 'text-[15px]' : 'text-[13px]',
        muted && 'text-muted',
        num && '[font-variant-numeric:tabular-nums] [font-feature-settings:"tnum"]',
        mono && "[font-family:ui-monospace,'SF_Mono',Menlo,monospace] [font-variant-numeric:tabular-nums]",
        truncate && 'truncate min-w-0',
      )}
    >
      {children}
    </span>
  )
}
