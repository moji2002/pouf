import type { ReactNode } from 'react'

/** A captured interaction state. 'hover'/'active' target [data-subject];
 *  'focus' tabs to the first focusable element. */
export type DemoState = 'hover' | 'focus' | 'active'

export interface Demo {
  /** Unique within the component, kebab-case: 'solid-md', 'quiet', 'disabled'. */
  id: string
  /** States the harness must additionally capture (default state always is). */
  states?: DemoState[]
  /** 'mobile' renders/captures at 390×844 instead of 1280×800. */
  viewport?: 'mobile'
  render: () => ReactNode
}
