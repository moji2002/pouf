import type { Demo } from './types'
import { buttonDemos } from './button'
import { inputDemos } from './input'

export const allDemos: Record<string, Demo[]> = {
  button: buttonDemos,
  input: inputDemos,
  // one entry per component — extended by Task 5
}
