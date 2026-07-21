import { ErrorBoundary } from '../ErrorBoundary'
import { Text } from '../text'
import type { Demo } from './types'

function Boom(): never {
  throw new Error('Something went wrong rendering this widget.')
}

export const errorBoundaryDemos: Demo[] = [
  { id: 'healthy', render: () => (
      <ErrorBoundary name="Demo section">
        <Text>Renders children normally when nothing throws.</Text>
      </ErrorBoundary>
    ) },
  // Deterministic: throws unconditionally on render, every render.
  { id: 'fallback', render: () => (
      <ErrorBoundary name="Demo section">
        <Boom />
      </ErrorBoundary>
    ) },
]
