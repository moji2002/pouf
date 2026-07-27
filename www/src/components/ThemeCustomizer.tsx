import { useMemo, useState } from 'react'
import { Card, RowCard } from '../../../registry/pouf/surface'
import { Stack, Row, Grid, Spacer } from '../../../registry/pouf/layout'
import { Heading, Text, Eyebrow } from '../../../registry/pouf/text'
import { Button } from '../../../registry/pouf/Button'
import { Badge, Blob, Dot } from '../../../registry/pouf/media'
import { Stat } from '../../../registry/pouf/readout'
import { Field, Input } from '../../../registry/pouf/Input'
import { Segmented } from '../../../registry/pouf/Segmented'
import { Avatar } from '../../../registry/pouf/avatar'

/* Every knob is a CSS custom property that pouf.css already reads. The preview
 * works by setting those properties on ONE wrapper element and letting the
 * cascade do the rest — no prop drilling, no re-render of the components, and
 * no special "themeable" mode in the library. That is the whole argument for
 * the token layer, so the customizer is also a demonstration of it. */

interface Knob {
  /** The custom property, without the leading `--`. */
  key: string
  label: string
  /** `@theme` counterpart, emitted alongside so a paste re-themes Tailwind
   *  utilities (bg-purple, text-ink) as well as the raw var() references. */
  themeKey?: string
  value: string
}

const COLOR_DEFAULTS: Knob[] = [
  { key: 'bg', themeKey: 'color-bg', label: 'Background', value: '#f0e9ff' },
  { key: 'surface', themeKey: 'color-surface', label: 'Surface', value: '#ffffff' },
  { key: 'ink', themeKey: 'color-ink', label: 'Ink', value: '#3a2e5c' },
  { key: 'muted', themeKey: 'color-muted', label: 'Muted', value: '#71609b' },
  { key: 'purple', themeKey: 'color-purple', label: 'Purple', value: '#c9a8ff' },
  { key: 'pink', themeKey: 'color-pink', label: 'Pink', value: '#ffb3d1' },
  { key: 'blue', themeKey: 'color-blue', label: 'Blue', value: '#9ec8ff' },
  { key: 'mint', themeKey: 'color-mint', label: 'Mint', value: '#a8f0d0' },
  { key: 'yellow', themeKey: 'color-yellow', label: 'Yellow', value: '#ffe58a' },
  { key: 'orange', themeKey: 'color-orange', label: 'Orange', value: '#ffb38a' },
]

const SHAPE_DEFAULTS = { card: 32, control: 20, blob: 24, lip: 10, lipRow: 6 }

export function ThemeCustomizer() {
  const [colors, setColors] = useState(() =>
    Object.fromEntries(COLOR_DEFAULTS.map((c) => [c.key, c.value])),
  )
  const [shape, setShape] = useState(SHAPE_DEFAULTS)
  const [tab, setTab] = useState('preview')
  const [copied, setCopied] = useState(false)

  const vars = useMemo(() => {
    const out: Record<string, string> = {}
    for (const c of COLOR_DEFAULTS) {
      out[`--${c.key}`] = colors[c.key]!
      if (c.themeKey) out[`--${c.themeKey}`] = colors[c.key]!
    }
    out['--r-card'] = `${shape.card}px`
    out['--r-control'] = `${shape.control}px`
    out['--r-blob'] = `${shape.blob}px`
    out['--radius-card'] = `${shape.card}px`
    out['--radius-control'] = `${shape.control}px`
    out['--radius-blob'] = `${shape.blob}px`
    out['--lip'] = `${shape.lip}px`
    out['--lip-row'] = `${shape.lipRow}px`
    return out
  }, [colors, shape])

  const css = useMemo(() => {
    const theme = COLOR_DEFAULTS.filter((c) => c.themeKey)
      .map((c) => `  --${c.themeKey}: ${colors[c.key]};`)
      .join('\n')
    return [
      '@theme {',
      theme,
      `  --radius-card: ${shape.card}px;`,
      `  --radius-control: ${shape.control}px;`,
      `  --radius-blob: ${shape.blob}px;`,
      '}',
      '',
      ':root {',
      `  --lip: ${shape.lip}px;`,
      `  --lip-row: ${shape.lipRow}px;`,
      '}',
    ].join('\n')
  }, [colors, shape])

  function copy() {
    navigator.clipboard?.writeText(css).then(
      () => { setCopied(true); setTimeout(() => setCopied(false), 1600) },
      () => {},
    )
  }

  function reset() {
    setColors(Object.fromEntries(COLOR_DEFAULTS.map((c) => [c.key, c.value])))
    setShape(SHAPE_DEFAULTS)
  }

  const dirty =
    COLOR_DEFAULTS.some((c) => colors[c.key] !== c.value) ||
    JSON.stringify(shape) !== JSON.stringify(SHAPE_DEFAULTS)

  /* Layout is class-based (.tc-grid/.tc-controls in theme.astro), not an inline
   * grid plus a selector in the page: the island is wrapped in <astro-island>,
   * so an `article > div:last-child` rule never matched it and the two columns
   * stayed side by side at 390px, pushing the preview ~200px off-screen. */
  return (
    <div className="tc-grid">
      {/* ---- Controls ---- */}
      <div className="tc-controls">
        <Card>
          <Stack gap={4}>
            <Row justify="between">
              <Heading level={3}>Palette</Heading>
              <Button size="sm" variant="quiet" disabled={!dirty} onClick={reset}>Reset</Button>
            </Row>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {COLOR_DEFAULTS.map((c) => (
                <label
                  key={c.key}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
                >
                  {/* A native colour input keeps this dependency-free and gives
                      the OS picker, including eyedropper, for nothing. */}
                  <input
                    type="color"
                    value={colors[c.key]}
                    onChange={(e) => setColors((s) => ({ ...s, [c.key]: e.target.value }))}
                    aria-label={c.label}
                    style={{
                      width: 34, height: 34, padding: 0, border: 'none',
                      borderRadius: 11, background: 'none', cursor: 'pointer',
                      boxShadow: 'var(--pouf-field)',
                    }}
                  />
                  <span style={{ fontWeight: 800, fontSize: 14, flex: 1 }}>{c.label}</span>
                  <code style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'ui-monospace, Menlo, monospace' }}>
                    {colors[c.key]}
                  </code>
                </label>
              ))}
            </div>
          </Stack>
        </Card>

        <Card>
          <Stack gap={4}>
            <Heading level={3}>Shape &amp; depth</Heading>
            {([
              ['card', 'Card radius', 0, 48],
              ['control', 'Control radius', 0, 40],
              ['blob', 'Blob radius', 0, 40],
              ['lip', 'Cushion lip', 0, 20],
              ['lipRow', 'Row lip', 0, 16],
            ] as const).map(([key, label, min, max]) => (
              <label key={key} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <Row justify="between">
                  <span style={{ fontWeight: 800, fontSize: 14 }}>{label}</span>
                  <code style={{ fontSize: 12, color: 'var(--muted)' }}>{shape[key]}px</code>
                </Row>
                <input
                  type="range"
                  min={min}
                  max={max}
                  value={shape[key]}
                  onChange={(e) => setShape((s) => ({ ...s, [key]: Number(e.target.value) }))}
                  style={{ width: '100%', accentColor: 'var(--purple)' }}
                />
              </label>
            ))}
            <Text size="sm" muted>
              The lip is the inner floor shadow — the slab’s thickness. Drop it to 0
              and the whole system flattens, which is the quickest way to see what
              the cushion is actually doing.
            </Text>
          </Stack>
        </Card>
      </div>

      {/* ---- Live preview ---- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Segmented
          label="View"
          value={tab}
          onChange={setTab}
          options={[{ value: 'preview', label: 'Preview' }, { value: 'css', label: 'CSS' }]}
        />

        {tab === 'preview' ? (
          /* The one element that carries the overrides. Everything below is an
             unmodified Pouf component reading the same tokens it always does. */
          <div style={{ ...(vars as React.CSSProperties), background: 'var(--bg)', padding: 28, borderRadius: 26 }}>
            <Stack gap={5}>
              <Row justify="between">
                <Stack gap={1}>
                  <Eyebrow>Dashboard</Eyebrow>
                  <Heading level={2}>Good morning</Heading>
                </Stack>
                <Row gap={2} wrap={false}>
                  <Avatar fallback="AL" tone="purple" />
                  <Badge tone="mint">Live</Badge>
                </Row>
              </Row>

              <Grid cols={3}>
                <Stat label="Revenue" value="$48.2k" icon="ok" tone="mint" />
                <Stat label="Orders" value="1,204" icon="add" tone="blue" />
                <Stat label="Refunds" value="12" icon="down" tone="pink" />
              </Grid>

              <Card>
                <Stack gap={4}>
                  <Row justify="between">
                    <Heading level={3}>Controls</Heading>
                    <Row gap={2} wrap={false}>
                      <Blob icon="sparkle" tone="yellow" size="sm" />
                      <Blob icon="heart" tone="pink" size="sm" />
                    </Row>
                  </Row>
                  <Row gap={2}>
                    <Button tone="purple">Primary</Button>
                    <Button tone="mint">Confirm</Button>
                    <Button variant="quiet">Cancel</Button>
                  </Row>
                  <Field label="Workspace" hint="Lowercase, no spaces.">
                    {(id, describedBy) => (
                      <Input id={id} describedBy={describedBy} value="acme" onChange={() => {}} />
                    )}
                  </Field>
                  <RowCard>
                    <Row gap={3} wrap={false}>
                      <Dot tone="mint" />
                      <Text>Every row a cushion</Text>
                      <Spacer />
                      <Badge tone="blue">row</Badge>
                    </Row>
                  </RowCard>
                </Stack>
              </Card>
            </Stack>
          </div>
        ) : (
          <Card>
            <Stack gap={4}>
              <Row justify="between">
                <Heading level={3}>Paste into <code>pouf.css</code></Heading>
                <Button size="sm" tone={copied ? 'mint' : 'purple'} onClick={copy}>
                  {copied ? 'Copied' : 'Copy CSS'}
                </Button>
              </Row>
              <Text size="sm" muted>
                Replace the matching blocks at the top of your installed
                <code> pouf.css</code>. Only the tokens are shown — the clay recipe
                below them keeps working, because it is written in terms of these.
              </Text>
              <pre
                style={{
                  margin: 0, padding: 18, borderRadius: 16, overflowX: 'auto',
                  background: 'var(--ink)', color: 'var(--bg)',
                  fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 13, lineHeight: 1.7,
                }}
              >
                {css}
              </pre>
            </Stack>
          </Card>
        )}
      </div>
    </div>
  )
}
