import { useState } from 'react'

/** The install command with a copy button. A tiny island — the only JS on an
 * otherwise static docs page besides the live demos.
 *
 * `compact` renders a single truncating pill (the whole thing copies) for use
 * inside a component tile, where the full `npx shadcn@latest add …` line is too
 * long to show; the full command still lands on the clipboard. */
export function CopyCommand({ command, compact = false }: { command: string; compact?: boolean }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard?.writeText(command)
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }

  if (compact) {
    const shown = command.replace('npx shadcn@latest add ', '')
    return (
      <button
        type="button"
        onClick={copy}
        title={command}
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
        <span style={{ flex: 'none', fontWeight: 900, color: 'var(--bg)', opacity: copied ? 1 : 0.85 }}>{copied ? 'Copied' : 'Copy'}</span>
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
        onClick={copy}
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
          background: copied ? 'var(--mint)' : 'var(--purple)',
          boxShadow: 'var(--pouf-control)',
        }}
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  )
}
