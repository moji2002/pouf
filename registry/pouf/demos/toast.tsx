import { Toast, ToastViewport } from '../Toast'
import type { Demo } from './types'

// Referentially stable — see Toast.tsx's note on why an inline arrow here
// would matter for the auto-dismiss timer (moot for `critical`, but kept
// consistent with real usage).
const noopDismiss = () => {}

export const toastDemos: Demo[] = [
  { id: 'info', render: () => <Toast id={1} severity="info" onDismiss={noopDismiss}>Maya commented on your post.</Toast> },
  { id: 'critical', render: () => (
      <Toast id={2} severity="critical" onDismiss={noopDismiss}>
        Payment failed — your card was declined.
      </Toast>
    ) },
  { id: 'viewport', render: () => (
      <ToastViewport
        toasts={[
          { id: 1, severity: 'critical', text: 'Payment failed — your card was declined.' },
          { id: 2, severity: 'info', text: 'Maya commented on your post.' },
        ]}
        onDismiss={noopDismiss}
      />
    ) },
]
