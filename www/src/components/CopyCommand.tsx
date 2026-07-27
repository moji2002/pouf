import { useEffect, useRef, useState } from 'react'

/** The install command with a copy button. A tiny island — the only JS on an
 * otherwise static docs page besides the live demos.
 *
 * `compact` renders a single truncating pill (the whole thing copies) for use
 * inside a component tile, where the full `npx shadcn@latest add …` line is too
 * long to show; the full command still lands on the clipboard. */
export function CopyCommand({ command, compact = false }: { command: string; compact?: boolean }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => {
    if (resetTimer.current) clearTimeout(resetTimer.current)
  }, [])

  const copy = async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable')
      await navigator.clipboard.writeText(command)
      setStatus('copied')
    } catch {
      setStatus('failed')
    }
    if (resetTimer.current) clearTimeout(resetTimer.current)
    resetTimer.current = setTimeout(() => setStatus('idle'), 1800)
  }
  const actionLabel = status === 'copied' ? 'Copied' : status === 'failed' ? 'Copy failed' : 'Copy'

  if (compact) {
    const shown = command.replace('npx shadcn@latest add ', '')
    return (
      <button
        type="button"
        onClick={() => void copy()}
        title={command}
        aria-live="polite"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          width: '100%',
          border: 'none',
          cursor: 'pointer',
          borderRadius: 14,
          padding: '9px 12px',
          background: 'var(--ink)',
          boxShadow: 'var(--pouf-control)',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          fontSize: 12.5,
          fontWeight: 700,
        }}
      >
        <span style={{ flex: 1, minWidth: 0, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--surface)' }}>{shown}</span>
        <span style={{ flex: 'none', fontWeight: 900, color: 'var(--bg)', opacity: status === 'copied' ? 1 : 0.85 }}>{actionLabel}</span>
      </button>
    )
  }

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
      <code
        className="code-block"
        style={{ flex: 1, display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}
      >
        {command}
      </code>
      <button
        type="button"
        onClick={() => void copy()}
        aria-live="polite"
        style={{
          flex: 'none',
          border: 'none',
          cursor: 'pointer',
          borderRadius: 14,
          padding: '0 18px',
          fontWeight: 900,
          /* Accent fill -> accent ink. --ink goes near-white in dark mode and would
           * leave this unreadable on the pastel. */
          color: 'var(--on-accent)',
          background: status === 'copied' ? 'var(--mint)' : status === 'failed' ? 'var(--orange)' : 'var(--purple)',
          boxShadow: 'var(--pouf-control)',
        }}
      >
        {actionLabel}
      </button>
    </div>
  )
}
