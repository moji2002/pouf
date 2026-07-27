/** The install command with a copy button. This renders as static HTML; one
 * delegated handler in Site.astro serves every copy button on the page.
 *
 * `compact` renders a single truncating pill (the whole thing copies) for use
 * inside a component tile, where the full `npx shadcn@latest add …` line is too
 * long to show; the full command still lands on the clipboard. */
export function CopyCommand({ command, compact = false }: { command: string; compact?: boolean }) {
  if (compact) {
    const shown = command.replace('npx shadcn@latest add ', '')
    return (
      <button
        type="button"
        data-copy-command={command}
        data-copy-status="idle"
        data-copy-kind="compact"
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
          background: 'var(--inverse-surface)',
          boxShadow: 'var(--pouf-control)',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          fontSize: 12.5,
          fontWeight: 700,
        }}
      >
        <span style={{ flex: 1, minWidth: 0, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--inverse-ink)' }}>{shown}</span>
        <span data-copy-label style={{ flex: 'none', fontWeight: 900, color: 'var(--inverse-ink)', opacity: 0.85 }}>Copy</span>
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
        data-copy-command={command}
        data-copy-status="idle"
        data-copy-kind="full"
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
          background: 'var(--purple)',
          boxShadow: 'var(--pouf-control)',
        }}
      >
        <span data-copy-label>Copy</span>
      </button>
    </div>
  )
}
