// gallery/harness/capture.ts — runs INSIDE the browser.
//
// gate.ts bundles this file with `Bun.build` (format: "iife") and injects the
// result via `page.addScriptTag`, then calls `window.captureComputedStyles()`
// through `page.evaluate`. It's a real TypeScript module (typechecked as part
// of the gallery project) rather than a string blob reconstructed by regex —
// string-injecting source at runtime was tried first and was brittle (no
// syntax checking, silently wrong on any edit here).

export type StyleSnapshot = Record<string, Record<string, string>>

export function captureComputedStyles(): StyleSnapshot {
  const root = document.querySelector('[data-demo-root]')
  if (!root) throw new Error('captureComputedStyles: no [data-demo-root] on the page')
  const out: StyleSnapshot = {}
  let i = 0
  const walk = (el: Element) => {
    const key = `${i++}:${el.tagName.toLowerCase()}`
    const styles: Record<string, string> = {}
    for (const pseudo of [null, '::before', '::after'] as const) {
      const cs = getComputedStyle(el, pseudo)
      if (pseudo && cs.content === 'none') continue
      const prefix = pseudo ?? ''
      for (let p = 0; p < cs.length; p++) {
        const prop = cs.item(p)
        styles[prefix + prop] = cs.getPropertyValue(prop)
      }
    }
    out[key] = styles
    for (const child of el.children) walk(child)
  }
  walk(root)
  return out
}

// Element addressing is preorder index + tag — deliberately NOT class names,
// so a rename sweep or a Tailwind migration (which replace classes wholesale)
// diffs clean when the rendering is truly identical.

// The bundle is injected as a plain <script> (not type="module"), so nothing
// here is reachable from page.evaluate unless it's hung off `window` itself.
;(window as unknown as { captureComputedStyles: typeof captureComputedStyles }).captureComputedStyles =
  captureComputedStyles
