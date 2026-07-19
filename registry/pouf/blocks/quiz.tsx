import { useState } from 'react'
import { Card } from '../surface'
import { Stack, Row, Spacer } from '../layout'
import { Heading, Text, Eyebrow } from '../text'
import { RadioGroup } from '../radiogroup'
import { Button } from '../Button'
import { Progress } from '../progress'
import { Badge } from '../media'

const QUESTIONS = [
  {
    q: 'In claymorphism, what signals that a control is interactive?',
    options: [
      { value: 'a', label: 'A bright colour' },
      { value: 'b', label: 'Depth — it looks raised, and presses in' },
      { value: 'c', label: 'An underline' },
    ],
    answer: 'b',
  },
  {
    q: 'Why does Pouf use ink text on pastel buttons, never white?',
    options: [
      { value: 'a', label: 'White fails WCAG AA on the pastels' },
      { value: 'b', label: 'It looked nicer' },
      { value: 'c', label: 'The reference required it' },
    ],
    answer: 'a',
  },
]

/** An example quiz card: progress, a question, single-select options, and
 * inline scoring. */
export function QuizBlock() {
  const [step, setStep] = useState(0)
  const [choice, setChoice] = useState('')
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState(0)

  const current = QUESTIONS[Math.min(step, QUESTIONS.length - 1)]!
  const correct = choice === current.answer
  const pct = ((step + (revealed ? 1 : 0)) / QUESTIONS.length) * 100
  const done = step >= QUESTIONS.length - 1 && revealed

  function next() {
    if (!revealed) {
      setRevealed(true)
      if (correct) setScore((s) => s + 1)
      return
    }
    setStep((s) => s + 1)
    setChoice('')
    setRevealed(false)
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: 24 }}>
      <Card>
        <Stack gap={5}>
          <Stack gap={2}>
            <Row justify="between">
              <Eyebrow>Question {Math.min(step + 1, QUESTIONS.length)} of {QUESTIONS.length}</Eyebrow>
              <Badge tone="mint">{score} correct</Badge>
            </Row>
            <Progress value={pct} tone="purple" label="Quiz progress" />
          </Stack>

          {done ? (
            <Stack gap={3}>
              <Heading level={2}>Nice! 🎉</Heading>
              <Text muted>You scored {score} of {QUESTIONS.length}.</Text>
              <Button tone="mint" onClick={() => { setStep(0); setScore(0); setChoice(''); setRevealed(false) }}>Play again</Button>
            </Stack>
          ) : (
            <>
              <Heading level={3}>{current.q}</Heading>
              <RadioGroup label="Answer" value={choice} onChange={setChoice} options={current.options} disabled={revealed} />
              {revealed && (
                <Text muted>{correct ? '✓ Correct!' : `✗ The answer was “${current.options.find((o) => o.value === current.answer)?.label}”.`}</Text>
              )}
              <Row wrap={false}>
                <Spacer />
                <Button disabled={!choice} onClick={next}>{revealed ? 'Next' : 'Check'}</Button>
              </Row>
            </>
          )}
        </Stack>
      </Card>
    </div>
  )
}
