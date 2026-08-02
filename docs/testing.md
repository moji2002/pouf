# Testing copied 1st-Pouf components

1st-Pouf components become part of your application when the shadcn CLI copies
their source. Test the behavior your users depend on with your application's
runner; avoid snapshots of Tailwind class strings or internal component details.

## Install the test tools

This setup uses Vitest, jsdom, and Testing Library:

```bash
pnpm add -D vitest jsdom @testing-library/react \
  @testing-library/user-event @testing-library/jest-dom
```

Add a test environment:

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
```

```ts
// src/test/setup.ts
import '@testing-library/jest-dom/vitest'
```

Then add a script such as `"test": "vitest run"` to your `package.json`.

## Button behavior

Keep the test beside the copied component so its import remains relative when
your app moves folders:

```tsx
// src/components/pouf/Button.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('runs the action exposed by its accessible name', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    render(<Button onClick={onSave}>Save changes</Button>)

    await user.click(screen.getByRole('button', { name: 'Save changes' }))

    expect(onSave).toHaveBeenCalledOnce()
  })

  it('blocks repeat actions while loading', () => {
    render(<Button loading>Save changes</Button>)

    const button = screen.getByRole('button', { name: 'Save changes' })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
  })
})
```

The assertions cover the public contract—an accessible action and its pending
state—without pinning generated utility classes.

## NumberInput behavior

`NumberInput` deliberately exposes its editable field as a labelled textbox,
not an ARIA `spinbutton`. Query the role it actually promises and exercise the
keyboard behavior:

```tsx
// src/components/pouf/NumberInput.test.tsx
import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { NumberInput } from './NumberInput'

function Quantity() {
  const [value, setValue] = useState('1')
  return (
    <NumberInput
      label="Quantity"
      value={value}
      onChange={setValue}
      min={0}
      max={3}
    />
  )
}

describe('NumberInput', () => {
  it('steps the controlled value with the keyboard', async () => {
    const user = userEvent.setup()
    render(<Quantity />)
    const input = screen.getByRole('textbox', { name: 'Quantity' })

    await user.click(input)
    await user.keyboard('{ArrowUp}')

    expect(input).toHaveValue('2')
  })
})
```

Prefer roles and accessible names over CSS selectors. That keeps a test valid
when the cushion styling changes without changing behavior.

## Portals and browser polyfills

Button and NumberInput need no special browser mocks. Radix-based overlays such
as Dialog, Select, and Tooltip render through portals; Testing Library searches
`document.body` by default, so query them with `screen.getByRole(...)` after the
interaction that opens them.

jsdom does not implement every layout API. If a copied component uses one, add
the narrowest polyfill to `src/test/setup.ts`—commonly `ResizeObserver`,
`matchMedia`, or pointer-capture methods. Do not add every possible mock up
front; a focused polyfill makes failures easier to understand.

## Why tests are not registry payloads

A registry component should not choose or rewrite the consumer's test runner,
DOM environment, path aliases, or setup file. Those decisions belong to the
application. Keep tests co-located in your project and adapt the relative import
to wherever the shadcn CLI installed your copy.
