import clsx from 'clsx'
import type { ReactNode } from 'react'
import { toneClass, type Tone } from './tone'

interface HeadingProps {
  children: ReactNode
  level?: 1 | 2 | 3
}

export function Heading({ children, level = 2 }: HeadingProps) {
  const Tag = `h${level}` as const
  return <Tag className={`clay-h${level}`}>{children}</Tag>
}

/** The reference's yellow highlight-swatch behind a word. */
export function Highlight({ children, tone = 'yellow' }: { children: ReactNode; tone?: Tone }) {
  return <span className={clsx('clay-highlight', toneClass(tone))}>{children}</span>
}

/** The reference's uppercase section eyebrow. Restricted to white surfaces:
 * --muted measures 3.93:1 on --bg (fails) but 4.64:1 on white (passes). */
export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="clay-eyebrow">{children}</div>
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
        'clay-text',
        size === 'sm' && 'clay-text--sm',
        muted && 'clay-text--muted',
        num && 'clay-text--num',
        mono && 'clay-text--mono',
        truncate && 'clay-text--truncate',
      )}
    >
      {children}
    </span>
  )
}
