import { Button } from './Button'
import { Row } from './layout'
import { Icon } from './Icon'
import { Text } from './text'

interface PaginationProps {
  page: number
  total: number
  onChange: (page: number) => void
}

/** Chevrons, not arrows: `up`/`down` carry trend meaning in this system, and the
 * first build used them here — a "previous page" that read as a value falling.
 * The indicator is plain ink; muted fails contrast on --bg at 13px. */
export function Pagination({ page, total, onChange }: PaginationProps) {
  if (total <= 1) return null

  return (
    <Row gap={2} justify="end">
      <Button variant="quiet" size="sm" disabled={page <= 1} onClick={() => onChange(page - 1)} label="Previous page">
        <Icon name="prev" size="sm" />
      </Button>
      <Text size="sm" num>
        {page} / {total}
      </Text>
      <Button variant="quiet" size="sm" disabled={page >= total} onClick={() => onChange(page + 1)} label="Next page">
        <Icon name="next" size="sm" />
      </Button>
    </Row>
  )
}
