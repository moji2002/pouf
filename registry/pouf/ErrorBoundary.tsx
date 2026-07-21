import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from './Button'
import { Card } from './surface'
import { Row, Stack } from './layout'
import { Heading, Text } from './text'
import { Blob } from './media'

interface Props {
  children: ReactNode
  /** Named so a fallback can say WHICH part died — "Positions failed" is
   *  actionable, "Something went wrong" is not. */
  name: string
  /** Reset when this changes (e.g. the route path), so navigating away from a
   *  crashed screen doesn't leave the error stuck on the new one. */
  resetKey?: string
}

interface State {
  error: Error | null
}

/** Catches render crashes so one broken part can't blank the whole page.
 *
 * If a render error in one section unmounted the whole tree, the user would be
 * left staring at a blank page with no way back. So boundaries wrap each screen
 * and each independent section, never the shell itself — a crash stays local and
 * the rest of the UI keeps working.
 *
 * Must be a class: there is still no hook equivalent of componentDidCatch.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Keep the stack in the console: the fallback deliberately doesn't render it
    // (it isn't useful to the person using the app), but it must not be swallowed either.
    console.error(`[${this.props.name}] render error`, error, info.componentStack)
  }

  componentDidUpdate(prev: Props): void {
    if (this.state.error && prev.resetKey !== this.props.resetKey) this.setState({ error: null })
  }

  render(): ReactNode {
    if (!this.state.error) return this.props.children
    return (
      <Card>
        <Stack gap={4}>
          <Row gap={3} wrap={false}>
            <Blob tone="warn" size="md" icon="warn" />
            <Stack gap={1}>
              <Heading level={3}>{this.props.name} couldn't be displayed</Heading>
              <Text muted>
                This section hit an error. The rest of the page still works.
              </Text>
            </Stack>
          </Row>
          <Text size="sm" mono>
            {this.state.error.message}
          </Text>
          <Row justify="end">
            <Button size="sm" tone="mint" onClick={() => this.setState({ error: null })}>
              Try again
            </Button>
          </Row>
        </Stack>
      </Card>
    )
  }
}
