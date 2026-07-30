# 1st-Pouf gap analysis vs shadcn/ui and peer registries

Research date: 2026-07-19. Sources: shadcn/ui (ui.shadcn.com), tweakcn, Origin UI,
Aceternity UI. Grounded against the 1st-Pouf repo (Astro site; 62 registry items).

**Evidence key:** **[Standard]** = a convention on all/most of shadcn + Origin UI +
Aceternity. **[shadcn]** = shadcn does it (not necessarily universal). **[Inference]**
= judgment of 1st-Pouf-specific value, not an observed fact.

## 1. What shadcn / similar sites have that 1st-Pouf lacks

### High priority

**1. API / props reference tables per component** — a table of every prop, its type,
accepted values, and default. **[Standard]** (shadcn Button page; Aceternity per
sub-component). **High** for 1st-Pouf **[Inference]**: "no className" makes props the *only*
customization surface, so documenting them is more load-bearing here than for shadcn.
Effort **Med** (author or semi-generate from CVA `variants` + TS types, ~38 comps).
https://ui.shadcn.com/docs/components/button

**2. Dark mode — support + docs page** — `.dark` class overriding the CSS variables,
plus a per-framework theme-provider setup page. **[Standard]**. **High** **[Inference]**:
table-stakes for 2026; claymorphism's soft shadows need deliberate dark treatment
(light-source inverts), so it can't be an afterthought. Effort **Med**.
https://ui.shadcn.com/docs/dark-mode

**3. Preview⇄Code tabs with inline copyable code per demo** — every demo has a
Preview/Code toggle + copy button inline. **[Standard]**. **Med-High** **[Inference]**:
1st-Pouf shows demo + install + a navigate-away "View source"; peers keep code inline and
copyable. Effort **Med**. https://ui.shadcn.com/docs/components/button

**4. Search / ⌘K command palette** — jump to any component/block. **[Standard]**.
**Med** **[Inference]**: workable without it at 38 items, but cheap polish and 1st-Pouf has
the primitives (dialog/command) to dogfood. Effort **Med**.

### Medium priority

**5. Blocks page (distinct from templates)** — copy-paste multi-component *sections*
(sidebar, dashboard, auth, calendar), a tier between a component and a full page.
**[shadcn/Standard]**. Confirms the split being added: **templates = whole pages;
blocks = reusable sections**, each installing via the registry with its own Preview/Code.
Effort **Med**. https://ui.shadcn.com/blocks

**6. Theme customizer — the claymorphism-shaped opportunity** — visual editor for
colors/radius/shadows/type with live preview and copy-CSS-variables export. **[shadcn +
ecosystem]** (shadcn `/themes`; tweakcn is a whole product for this). **High as a
differentiator, discretionary** **[Inference]**: claymorphism's identity *is* the CSS
variables (radius, shadow depth/softness, hue), so a "Clay customizer" is a uniquely
strong fit and marketing hook. Effort **High**; a cut-down v1 (radius + shadow-depth +
primary hue) is **Med**. https://tweakcn.com/editor/theme

**7. Install depth: Manual tab + framework guides** — Command *and* Manual tabs; per-
framework setup. **[Standard]** for the tab pair; **[shadcn]** for breadth. **Med**
**[Inference]**: at least an Astro/Vite/Next trio (Astro-first, since the site is Astro).
Effort **Low-Med**. https://ui.shadcn.com/docs/installation

**8. Per-component pages (vs one big page)** — dedicated URL per component. **[Standard]**.
**Med** **[Inference]**: 1st-Pouf's single-page TOC is a deliberate maximalist choice and fine
UX; the cost is SEO/deep-linking. Capture most value with stable `#anchor` + per-section
titles rather than a full split unless organic search matters. Effort **High**.

### Low priority

- **9. Accessibility notes per component** — largely free since 1st-Pouf is Radix-backed.
  **Low-Med / Low effort.**
- **10. Colors page** — palette in HEX/RGB/HSL/var/class with copy. **Low / Low.**
- **11. "Open in v0"** — v0 unlikely to render claymorphism; Vercel-specific. **Skip.**
- **12. `llms.txt` + registry-schema doc + MCP** — `llms.txt` is a cheap on-trend win
  (**Med / Low**); schema doc **Low-Med / Low**; MCP server **defer**.
- **13. Charts / Figma / Directory / Typeset** — out of scope. **Skip.**

## 2. Recommended additions (priority order)

1. **Props/API table on every component** — derive from CVA `variants` + types.
2. **Ship + document dark mode** — author `.dark` clay tokens (invert shadow light-source);
   `/docs/dark-mode`; header light/dark toggle.
3. **Inline Preview⇄Code tabs + copy** on each demo (replace navigate-away View source).
4. **⌘K command-palette search** — dogfood 1st-Pouf's Dialog/Command.
5. **Blocks page** — group by category; each block installs via the registry with its own
   Preview/Code + light/dark; keep `/examples` as full-page *templates*; label the tiers.
6. **Clay Theme Customizer v1** — radius + shadow-depth/softness + primary-hue sliders,
   live preview, copy CSS variables.
7. **Manual install tab + Astro/Vite/Next getting-started guides.**
8. **`llms.txt` + one-page registry-schema doc.**

**Deliberately skip/defer:** full per-component page split (use stable anchors), Open-in-v0,
Colors page, Charts, Figma, MCP server.
