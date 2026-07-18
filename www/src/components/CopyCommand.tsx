import { useState } from 'react'

/** The install command with a copy button. A tiny island — the only JS on an
 * otherwise static docs page besides the live demos. */
export function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false)
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
        onClick={() => {
          navigator.clipboard?.writeText(command)
          setCopied(true)
          setTimeout(() => setCopied(false), 1400)
        }}
        style={{
          flex: 'none',
          border: 'none',
          cursor: 'pointer',
          borderRadius: 14,
          padding: '0 18px',
          fontWeight: 900,
          color: 'var(--ink)',
          background: copied ? 'var(--mint)' : 'var(--purple)',
          boxShadow: 'var(--pouf-control)',
        }}
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  )
}
