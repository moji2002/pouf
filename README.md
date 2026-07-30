# 1st-Pouf

**A puffy, pastel, kid-shaped UI kit for React.** Claymorphism — like neumorphism but maximalist: bright, chunky, every surface a cushion. Distributed as a shadcn-style registry, so you copy the source into your project and own it.

> Every surface a cushion. Big radius. Inner highlight. Inner floor shadow. Outer drop. Pastel everywhere.

- **Depth is the affordance.** Buttons press in; badges stay flat. State you can feel, not just read.
- **You own the source.** Install with the shadcn CLI or copy the file. No runtime dependency to version-lock.
- **Variants, not classNames.** Appearance is chosen by props, so your app can't drift off-system. Need an escape hatch? You have the code.
- **Built on** Tailwind CSS v4, Radix UI, `class-variance-authority`, and Recharts.

## Install

1st-Pouf needs a React app with **Tailwind CSS v4** and the **shadcn CLI** configured (a `components.json`).

```bash
# the theme (tokens, cushion utilities, keyframes) — comes along automatically,
# but you can add it explicitly
npx shadcn@latest add https://1st-pouf.worksonmy.dev/r/base.json

# a component (pulls in its dependencies + the base)
npx shadcn@latest add https://1st-pouf.worksonmy.dev/r/button.json
```

Import the theme and the font once in your app entry:

```ts
import '@fontsource-variable/nunito'
import './components/pouf/pouf.css'
```

Then use it:

```tsx
import { Button } from './components/pouf/Button'

export function Example() {
  return <Button tone="mint">Save</Button>
}
```

Browse every component live at **[1st-pouf.worksonmy.dev](https://1st-pouf.worksonmy.dev)**.

## Components

Layout (Stack, Row, Grid, Shell, Sidebar, Separator, ScrollArea, AspectRatio) ·
Typography (Heading, Text, Highlight, Eyebrow) ·
Surfaces (Card, RowCard, Stat, Metric, Blob, Badge, Dot, Figure, Avatar) ·
Forms (Button, Input, Textarea, NumberInput, Checkbox, RadioGroup, Slider, Segmented, ToggleGroup) ·
Overlays (Select, Switch, Dialog, Confirm, Tooltip, Combobox, DropdownMenu, HoverCard, Sheet) ·
Feedback (Status, Freshness, ModeBanner, Empty, Skeleton, ErrorNote, Toasts, AlertBell, Progress) ·
Navigation (Tabs, Accordion, Collapsible, NavLink, BottomNav, Breadcrumb, Pagination) ·
Data (Table, Charts).

## The one rule

No component takes a `className` or `style` prop. That is deliberate: it is what keeps a whole app on-system. Choose appearance with variants (`tone`, `size`, `variant`). When you genuinely need to break out, edit the source — it's yours.

## Development

1st-Pouf is a bun-workspaces monorepo:

- `registry/pouf/` — the library source (what users receive) + `pouf.css` theme + demos
- `gallery/` — a Vite app that renders every demo, driving the snapshot-equivalence gate
- `www/` — the [1st-pouf.worksonmy.dev](https://1st-pouf.worksonmy.dev) site (Astro), which runs on 1st-Pouf itself

```bash
bun install
bun run gallery      # the demo gallery at :4700
bun run gate         # the snapshot gate (computed styles + pixels)
bun test             # unit tests
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the workflow and the gate.

## Credits

1st-Pouf's visual language is adapted from [novusgfx/retro-design-system](https://github.com/novusgfx/retro-design-system) (`styles/39-claymorphism`), which is MIT licensed. One deliberate deviation from the reference: ink on pastel, never white — the reference's white-on-pastel buttons fail WCAG AA (measured 1.25:1–1.99:1); 1st-Pouf uses ink uniformly (6.10:1–9.75:1).

## License

MIT © Mojtaba Beheshti
