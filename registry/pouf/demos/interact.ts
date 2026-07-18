/** Helpers for "-open"/open-by-default demos of overlays that expose no
 * controlled `open` prop (Confirm, Select, Combobox, DropdownMenu, AlertBell,
 * BottomNav's Menu sheet). Where a component DOES expose `open`, use that
 * directly instead — these are a fallback for when it doesn't. */

/** Fires the DOM event sequence Radix's various open triggers listen for.
 * `.click()` alone is not enough: Select opens on pointerdown, not click. */
export function simulateOpen(el: Element | null | undefined) {
  if (!el || !(el instanceof HTMLElement)) return
  const base = { bubbles: true, cancelable: true, view: window }
  el.dispatchEvent(new PointerEvent('pointerdown', { ...base, pointerId: 1, button: 0, pointerType: 'mouse' }))
  el.dispatchEvent(new MouseEvent('mousedown', base))
  el.dispatchEvent(new PointerEvent('pointerup', { ...base, pointerId: 1, button: 0, pointerType: 'mouse' }))
  el.dispatchEvent(new MouseEvent('mouseup', base))
  el.click()
}

/** Fires the pointer-enter sequence Tooltip/HoverCard listen for to arm their
 * open-delay timer. Real time still has to elapse afterwards for Radix's own
 * setTimeout to fire — these have no controlled `open` prop, so a demo can
 * only kick off the same interaction a real hover would. */
export function simulateHover(el: Element | null | undefined) {
  if (!el || !(el instanceof HTMLElement)) return
  const pointerBase = { bubbles: true, cancelable: true, view: window, pointerId: 1, pointerType: 'mouse' as const }
  const mouseBase = { bubbles: true, cancelable: true, view: window }
  el.dispatchEvent(new PointerEvent('pointerover', pointerBase))
  el.dispatchEvent(new PointerEvent('pointermove', pointerBase))
  el.dispatchEvent(new MouseEvent('mouseover', mouseBase))
  el.dispatchEvent(new MouseEvent('mousemove', mouseBase))
}
