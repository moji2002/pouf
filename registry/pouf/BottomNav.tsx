import clsx from 'clsx'
import * as RDialog from '@radix-ui/react-dialog'
import { useState } from 'react'
import { Icon, type IconName } from './Icon'
import { Row } from './layout'
import { Heading, Text } from './text'
import { toneClass, type Tone } from './tone'
import { isActivePath, type LinkComponent } from './NavLink'

const Anchor: LinkComponent = (props) => <a {...props} />

export interface NavItem {
  href: string
  label: string
  icon: IconName
  tone: Tone
}

/** Note what is NOT here: `toneClass(item.tone)`. The tab deliberately ignores
 *  its item's tone, so every active tab is the same purple. item.tone still
 *  drives the sidebar and the Menu sheet, where only one link is lit at a time
 *  and a per-screen colour is an accent rather than a carousel. */
function Tab({
  item,
  active,
  link: Link = Anchor,
}: {
  item: NavItem
  active: boolean
  link?: LinkComponent
}) {
  return (
    <Link
      href={item.href}
      className={clsx('pouf-tab', active && 'pouf-tab--active')}
      aria-current={active ? 'page' : undefined}
    >
      <Icon name={item.icon} size="md" />
      <span className="pouf-tab__label">{item.label}</span>
    </Link>
  )
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

interface Props {
  /** The tabs shown directly in the bar. Keep this short — everything else
   *  lives behind Menu. */
  primary: NavItem[]
  /** Every destination, grouped, for the Menu sheet. Grouped rather than flat
   *  for the same reason as the sidebar: an undifferentiated list of nine hides
   *  which screens you'd open daily and which you'd touch once. */
  groups: NavGroup[]
  /** The app's current pathname — pouf has no router; the host app does. */
  currentPath: string
  /** Swap in your router's Link (must forward href/className/children). */
  link?: LinkComponent
}

/** Mobile bottom navigation.
 *
 * Bottom rather than top because it is the only part of a phone screen a thumb
 * reaches without regripping — and this is an app someone opens to check a
 * position while walking.
 *
 * Only a few destinations fit honestly; the rest go behind Menu rather than
 * being crushed into unreadable 8px labels. Menu is a real tab (not a hamburger
 * in a corner) so the overflow is thumb-reachable too, and it lights up when the
 * current page isn't one of the primary tabs — otherwise navigating to
 * Configuration would leave every tab dark and the operator unable to tell where
 * they are.
 */
export function BottomNav({ primary, groups, currentPath, link: Link = Anchor }: Props) {
  const [open, setOpen] = useState(false)

  const onPrimary = primary.some((i) => isActivePath(i.href, currentPath))

  return (
    <nav className="pouf-bottomnav" aria-label="Main">
      {primary.map((item) => (
        <Tab key={item.href} item={item} active={isActivePath(item.href, currentPath)} link={Link} />
      ))}

      <RDialog.Root open={open} onOpenChange={setOpen}>
        <RDialog.Trigger asChild>
          <button
            type="button"
            className={clsx('pouf-tab', !onPrimary && 'pouf-tab--active')}
            aria-current={!onPrimary ? 'page' : undefined}
          >
            <Icon name="menu" size="md" />
            <span className="pouf-tab__label">Menu</span>
          </button>
        </RDialog.Trigger>
        <RDialog.Portal>
          <RDialog.Overlay className="pouf-overlay" />
          <RDialog.Content className="pouf-sheet" aria-describedby={undefined}>
            <div className="pouf-sheet__handle" />
            <RDialog.Title asChild>
              <div>
                <Heading level={3}>All screens</Heading>
              </div>
            </RDialog.Title>
            {/* Grouped by spacing, deliberately unlabelled. The headings read as
                clutter at this size, and the clusters do the work on their own —
                proximity groups without adding a word of chrome. */}
            <div className="pouf-sheet__body">
              {/* onClick lives here (rather than on each Link) because Link is
                  swappable down to the bare LinkComponent signature, which has
                  no onClick slot — delegating to this wrapper closes the sheet
                  on navigate without widening that type. */}
              <div className="pouf-nav" onClick={() => setOpen(false)}>
                {groups.map((g) => (
                  <div className="pouf-navgroup" key={g.title}>
                    {g.items.map((item) => {
                      const active = isActivePath(item.href, currentPath)
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={clsx(
                            'pouf-navlink',
                            active && 'pouf-navlink--active',
                            active && toneClass(item.tone),
                          )}
                          aria-current={active ? 'page' : undefined}
                        >
                          <Icon name={item.icon} size="md" />
                          {item.label}
                        </Link>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
            <RDialog.Close asChild>
              <button type="button" className="pouf-btn pouf-btn--quiet pouf-btn--block pouf-btn--sm">
                <Row gap={2} wrap={false}>
                  <Icon name="close" size="sm" />
                  <Text size="sm">Close</Text>
                </Row>
              </button>
            </RDialog.Close>
          </RDialog.Content>
        </RDialog.Portal>
      </RDialog.Root>
    </nav>
  )
}
