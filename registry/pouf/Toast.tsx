import { useEffect } from 'react'
import clsx from 'clsx'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { Icon } from './Icon'

/** How long a routine alert stays. Long enough to read one line without hurrying;
 *  NN/g's guidance on transient messages puts the floor around 5s, and every alert
 *  here also survives in the panel, so erring short costs nothing. */
const AUTO_DISMISS_MS = 6_000

export type ToastSeverity = 'critical' | 'info'

/** Render `*bold*` markers as emphasis.
 *
 * When the same message string is reused across surfaces it may carry lightweight
 * markdown. Rendering it raw would put literal asterisks on screen ("*Saved*");
 * re-writing every call site to strip them would fork the message per surface. Splitting
 * on the delimiter keeps one string and no HTML injection: the parts are React children,
 * never innerHTML.
 */
function emphasise(text: string): ReactNode[] {
  return text.split(/\*([^*]+)\*/g).map((part, i) =>
    // Odd indices are the captured groups — i.e. what was inside the asterisks.
    i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>,
  )
}

interface ToastProps {
  id: number
  severity: ToastSeverity
  children: ReactNode
  /** MUST be referentially stable — see the timer note in Toast. Pass a store action
   *  or a useCallback, never an inline arrow. */
  onDismiss: (id: number) => void
}

/**
 * One alert.
 *
 * Critical toasts do NOT auto-dismiss. That is the entire point of the severity split:
 * these are the `force: true` alerts — payment declined, upload failed, a job that died
 * halfway — and a message that fades after six seconds can be missed by someone who
 * looked away, which is exactly the failure `force` was invented to prevent. Routine
 * alerts fade, because a "saved" you missed is still true and costs nothing.
 */
/* Shared with toaster.tsx's programmatic toasts: comes in from the side, tiny,
 * and fades up to full size on a gentle spring, collapsing to a plain fade under
 * prefers-reduced-motion. Tuned in docs/toast-anim-playground.html. */
function toastMotion(reduce: boolean) {
  if (reduce) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.12 },
    }
  }
  return {
    initial: { opacity: 0, x: 140, scale: 0.7 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: 100, scale: 0.8, transition: { duration: 0.14, ease: 'easeIn' as const } },
    transition: { type: 'spring' as const, stiffness: 280, damping: 26, mass: 1 },
  }
}

export function Toast({ id, severity, children, onDismiss }: ToastProps) {
  const critical = severity === 'critical'
  const reduce = useReducedMotion() ?? false

  // Every dep here MUST be referentially stable, or this timer never fires.
  //
  // This effect re-runs whenever a dep changes, and re-running clears the pending
  // timeout and starts a new one. `onDismiss` used to be an inline arrow built fresh on
  // each render of the viewport — and if the app polls on an interval (say every 5s), it
  // re-renders App and therefore the viewport. A 6s timer reset every 5s never reaches
  // 6s: routine toasts hung around forever, and only a real browser with a real clock
  // showed it. That is why onDismiss takes an id instead of closing over one.
  useEffect(() => {
    if (critical) return // sticky by design — see above
    const t = setTimeout(() => onDismiss(id), AUTO_DISMISS_MS)
    return () => clearTimeout(t)
  }, [critical, id, onDismiss])

  return (
    <motion.div
      className={clsx('pouf-toast', critical ? 'tone-down' : 'tone-info')}
      role={critical ? 'alert' : 'status'}
      aria-live={critical ? 'assertive' : 'polite'}
      layout="position"
      {...toastMotion(reduce)}
    >
      <div className="pouf-toast__icon">
        <Icon name={critical ? 'warn' : 'ok'} size="sm" />
      </div>
      <div className="pouf-toast__body">{children}</div>
      <button type="button" className="pouf-toast__close" onClick={() => onDismiss(id)} aria-label="Dismiss notification">
        <Icon name="close" size="sm" />
      </button>
    </motion.div>
  )
}

export interface ToastItem {
  id: number
  severity: ToastSeverity
  text: string
}

/** Bare items — the shell owns the single .pouf-toasts stack and mounts this
 * inside it, beside the programmatic Toaster. Two components each bringing
 * their own fixed stack meant two overlapping stacks at the same corner. */
export function ToastViewport({ toasts, onDismiss }: { toasts: ToastItem[]; onDismiss: (id: number) => void }) {
  if (toasts.length === 0) return null
  return (
    <AnimatePresence mode="sync">
      {toasts.map((t) => (
        <Toast key={t.id} id={t.id} severity={t.severity} onDismiss={onDismiss}>
          {emphasise(t.text)}
        </Toast>
      ))}
    </AnimatePresence>
  )
}
