interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

/** A list, not a Row of Rows: nav > ol is what a screen reader expects from a
 * breadcrumb, and aria-current marks the page you are on.
 *
 * The separator is a slash — the first build used the `expand` chevron, which
 * points DOWN (it is the Select's open-affordance), so every crumb appeared to
 * open a dropdown. A slash is decorative punctuation and is hidden from
 * readers; links carry ink + underline (hover moves the underline's colour,
 * which works — the old hover set `color` on a child that had its own). */
export function Breadcrumb({ items }: BreadcrumbProps) {
  if (items.length === 0) return null

  return (
    <nav aria-label="Breadcrumb">
      <ol className="clay-breadcrumb">
        {items.map((item, i) => {
          const last = i === items.length - 1
          return (
            <li key={i} className="clay-breadcrumb__item">
              {i > 0 && (
                <span className="clay-breadcrumb__sep" aria-hidden="true">
                  /
                </span>
              )}
              {last || !item.href ? (
                <span className="clay-breadcrumb__current" aria-current={last ? 'page' : undefined}>
                  {item.label}
                </span>
              ) : (
                <a className="clay-breadcrumb__link" href={item.href}>
                  {item.label}
                </a>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
