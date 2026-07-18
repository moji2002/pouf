import { Toast, ToastViewport } from '../Toast'
import type { Demo } from './types'

// Referentially stable — see Toast.tsx's note on why an inline arrow here
// would matter for the auto-dismiss timer (moot for `critical`, but kept
// consistent with real usage).
const noopDismiss = () => {}

export const toastDemos: Demo[] = [
  { id: 'info', render: () => <Toast id={1} severity="info" onDismiss={noopDismiss}>Apple filled at 64,201.50.</Toast> },
  { id: 'critical', render: () => (
      <Toast id={2} severity="critical" onDismiss={noopDismiss}>
        Circuit breaker tripped — the engine halted itself.
      </Toast>
    ) },
  { id: 'viewport', render: () => (
      <ToastViewport
        toasts={[
          { id: 1, severity: 'critical', text: 'Circuit breaker tripped — the engine halted itself.' },
          { id: 2, severity: 'info', text: 'Apple filled at 64,201.50.' },
        ]}
        onDismiss={noopDismiss}
      />
    ) },
]
