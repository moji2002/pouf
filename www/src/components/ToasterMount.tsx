import { Toaster } from '../../../registry/pouf/toaster'

/** The one global toast stack for the site — a fixed top-right container that
 * `toast()` calls (from anywhere, e.g. the Toaster docs demo) render into.
 * This is exactly how an app mounts it at its root. */
export function ToasterMount() {
  return (
    <div className="pouf-toasts">
      <Toaster />
    </div>
  )
}
