/** The docs manifest: one entry per documented component (a registry item),
 * listing the demo keys that belong to it. Demo keys come from
 * registry/pouf/demos; registry items come from registry.json. A single file
 * (layout.tsx) bundles several exports, so one doc page shows several demos. */

import { installCommand } from './site'

export { installCommand }

export interface ComponentDoc {
  /** URL slug and anchor id (and registry-item name, unless `install` overrides). */
  slug: string
  /** Display name for nav + page heading. */
  title: string
  /** One-line description. */
  blurb: string
  /** allDemos keys rendered live on the page, in order. */
  demos: string[]
  /** Section grouping. */
  section: 'Layout' | 'Typography' | 'Surfaces' | 'Forms' | 'Overlays' | 'Navigation' | 'Sections' | 'Feedback' | 'Data'
  /** Registry item to install, when it differs from the slug (e.g. ContextMenu
   *  ships in the `menu` file alongside DropdownMenu). */
  install?: string
}

export const COMPONENTS: ComponentDoc[] = [
  { slug: 'layout', title: 'Layout', blurb: 'Stack, Row, Grid, Shell, Sidebar, Spacer — flex and grid without inline styles.', demos: ['stack', 'row', 'grid', 'shell', 'sidebar'], section: 'Layout' },
  { slug: 'text', title: 'Text & Headings', blurb: 'Heading, Text, Highlight, Eyebrow — the type scale.', demos: ['heading', 'text'], section: 'Typography' },
  { slug: 'surface', title: 'Card', blurb: 'Card and RowCard — every surface a cushion.', demos: ['card', 'row-card'], section: 'Surfaces' },
  { slug: 'readout', title: 'Stat & Metric', blurb: 'Headline figures on their own cushion.', demos: ['stat', 'metric'], section: 'Surfaces' },
  { slug: 'media', title: 'Blob, Badge, Dot, Figure', blurb: 'Icon tiles, flat labels, status dots, framed images.', demos: ['blob', 'badge', 'dot', 'figure'], section: 'Surfaces' },
  { slug: 'avatar', title: 'Avatar', blurb: 'A puffy avatar with image, initials, or icon fallback.', demos: ['avatar'], section: 'Surfaces' },
  { slug: 'button', title: 'Button', blurb: 'The primary control. Depth is the affordance.', demos: ['button'], section: 'Forms' },
  { slug: 'input', title: 'Input & Textarea', blurb: 'Field, Input, Textarea — recessed cushions for text entry.', demos: ['input'], section: 'Forms' },
  { slug: 'number-input', title: 'NumberInput', blurb: 'A spinbutton capsule with decimal-safe stepping.', demos: ['number-input'], section: 'Forms' },
  { slug: 'checkbox', title: 'Checkbox', blurb: 'A cushioned checkbox with a draw-in check.', demos: ['checkbox'], section: 'Forms' },
  { slug: 'radio-group', title: 'RadioGroup', blurb: 'Single-select, sized to match the checkbox.', demos: ['radio-group'], section: 'Forms' },
  { slug: 'slider', title: 'Slider', blurb: 'A bead of clay lying in its channel.', demos: ['slider'], section: 'Forms' },
  { slug: 'segmented', title: 'Segmented', blurb: 'A pressed-in segment marks selection with depth, not colour.', demos: ['segmented'], section: 'Forms' },
  { slug: 'toggle', title: 'ToggleGroup', blurb: 'Multi-select toggles that press in when on.', demos: ['toggle-group'], section: 'Forms' },
  { slug: 'controls', title: 'Select, Switch, Dialog, Confirm, Tooltip, Combobox', blurb: 'The Radix-backed controls, skinned in clay.', demos: ['select', 'switch', 'combobox', 'tooltip', 'dialog', 'confirm'], section: 'Overlays' },
  { slug: 'menu', title: 'DropdownMenu', blurb: 'A click-triggered menu on a cushion.', demos: ['dropdown-menu'], section: 'Overlays' },
  { slug: 'context-menu', title: 'ContextMenu', blurb: 'A right-click menu, same clay skin.', demos: ['context-menu'], section: 'Overlays', install: 'menu' },
  { slug: 'hover-card', title: 'HoverCard', blurb: 'A card that rises on hover.', demos: ['hover-card'], section: 'Overlays' },
  { slug: 'sheet', title: 'Sheet', blurb: 'A side panel that slides in from the edge.', demos: ['sheet'], section: 'Overlays' },
  { slug: 'status', title: 'Status, Freshness, ModeBanner', blurb: 'Liveness signals and the environment banner.', demos: ['status', 'freshness', 'mode-banner'], section: 'Feedback' },
  { slug: 'feedback', title: 'Empty, Skeleton, ErrorNote', blurb: 'Designed empty, loading, and error states.', demos: ['empty', 'skeleton', 'error-note'], section: 'Feedback' },
  { slug: 'toaster', title: 'Toasts', blurb: 'Pushed alerts with a puffy fill and a raised icon.', demos: ['toaster'], section: 'Feedback' },
  { slug: 'alert-bell', title: 'AlertBell', blurb: 'The record behind the toasts.', demos: ['alert-bell'], section: 'Feedback' },
  { slug: 'progress', title: 'Progress', blurb: 'Determinate and indeterminate bars.', demos: ['progress'], section: 'Feedback' },
  { slug: 'disclosure', title: 'Tabs, Accordion, Collapsible', blurb: 'Panels that switch and reveal.', demos: ['tabs', 'accordion', 'collapsible'], section: 'Navigation' },
  { slug: 'nav-link', title: 'NavLink', blurb: 'A sidebar link that lights up when active.', demos: ['nav-link'], section: 'Navigation' },
  { slug: 'bottom-nav', title: 'BottomNav', blurb: 'A thumb-reachable mobile tab bar.', demos: ['bottom-nav'], section: 'Navigation' },
  { slug: 'breadcrumb', title: 'Breadcrumb', blurb: 'A trail back up the hierarchy.', demos: ['breadcrumb'], section: 'Navigation' },
  { slug: 'pagination', title: 'Pagination', blurb: 'Page-by-page navigation.', demos: ['pagination'], section: 'Navigation' },
  { slug: 'menubar', title: 'Menubar', blurb: 'An application menu bar (File / Edit / View).', demos: ['menubar'], section: 'Navigation' },
  { slug: 'navbar', title: 'Navbar', blurb: 'A top navigation bar: brand, links, actions.', demos: ['navbar'], section: 'Sections' },
  { slug: 'footer', title: 'Footer', blurb: 'A site footer with link columns.', demos: ['footer'], section: 'Sections' },
  { slug: 'cta', title: 'CTA', blurb: 'A call-to-action banner — the one loud thing.', demos: ['cta'], section: 'Sections' },
  { slug: 'separator', title: 'Separator', blurb: 'A hairline divider.', demos: ['separator'], section: 'Layout' },
  { slug: 'scroll-area', title: 'ScrollArea', blurb: 'A scroll container with a styled bar.', demos: ['scroll-area'], section: 'Layout' },
  { slug: 'aspect-ratio', title: 'AspectRatio', blurb: 'A framed, ratio-locked box.', demos: ['aspect-ratio'], section: 'Layout' },
  { slug: 'table', title: 'Table', blurb: 'Rows of data with optional row actions.', demos: ['table'], section: 'Data' },
  { slug: 'charts', title: 'Charts', blurb: 'Area, Bar, Line, and Pie — Recharts, themed.', demos: ['area-chart', 'bar-chart', 'line-chart', 'pie-chart'], section: 'Data' },
]

export const SECTIONS = ['Layout', 'Typography', 'Surfaces', 'Forms', 'Overlays', 'Navigation', 'Sections', 'Feedback', 'Data'] as const

export function componentInstall(doc: ComponentDoc): string {
  return installCommand(doc.install ?? doc.slug)
}
