import * as RDialog from '@radix-ui/react-dialog'
import type { ReactNode } from 'react'
import { Button } from './Button'
import { Icon } from './Icon'
import { Stack } from './layout'
import { Heading, Text } from './text'

interface SheetProps {
  /** Omit for a fully controlled sheet (open/onOpenChange) with no in-place
   *  trigger — e.g. opened from a table row click. */
  trigger?: ReactNode
  title: string
  description?: string
  children: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

/** A side sheet — NOT a centred dialog.
 *
 * The old Sheet reused .clay-dialog, so "Open sheet" produced something visually
 * identical to a modal. A sheet reads as a panel that slides in from an edge: the
 * right on desktop, the bottom on a phone (where the thumb is). Enter and exit are
 * CSS animations keyed off Radix's data-state — Radix's Presence keeps the node
 * mounted until the close animation ends, so it slides out too, no framer needed.
 */
export function Sheet({ trigger, title, description, children, open, onOpenChange }: SheetProps) {
  return (
    <RDialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <RDialog.Trigger asChild>{trigger}</RDialog.Trigger>}
      <RDialog.Portal>
        <RDialog.Overlay className="clay-overlay" />
        <RDialog.Content className="clay-sheet-dialog">
          <div className="clay-sheet-panel">
            <div className="clay-dialog__head">
              <Stack gap={1}>
                <RDialog.Title asChild>
                  <div>
                    <Heading level={3}>{title}</Heading>
                  </div>
                </RDialog.Title>
                {description && (
                  <RDialog.Description asChild>
                    <div>
                      <Text size="sm" muted>
                        {description}
                      </Text>
                    </div>
                  </RDialog.Description>
                )}
              </Stack>
              <RDialog.Close asChild>
                <Button variant="quiet" size="sm" label="Close">
                  <Icon name="close" size="sm" />
                </Button>
              </RDialog.Close>
            </div>
            <div className="clay-dialog__body">{children}</div>
          </div>
        </RDialog.Content>
      </RDialog.Portal>
    </RDialog.Root>
  )
}
