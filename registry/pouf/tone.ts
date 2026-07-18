/** The palette, and the semantic aliases screens should prefer.
 *
 * Screens say what a thing MEANS ("up", "down", "warn") rather than what colour
 * it is ("mint", "pink"). Re-theming then happens in clay.css alone: remap --up
 * and every profit figure in the admin follows. Raw palette tones stay available
 * for decorative use where no meaning is implied. */
export type Tone =
  | 'pink'
  | 'purple'
  | 'blue'
  | 'mint'
  | 'yellow'
  | 'orange'
  | 'up'
  | 'down'
  | 'warn'
  | 'info'
  | 'idle'

export const toneClass = (tone?: Tone): string | undefined => (tone ? `tone-${tone}` : undefined)
