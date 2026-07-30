import { useState } from 'react'
import { Card } from '../surface'
import { Stack, Row, Spacer } from '../layout'
import { Heading, Text, Eyebrow } from '../text'
import { RadioGroup } from '../radiogroup'
import { Button } from '../Button'
import { Progress } from '../progress'
import { Badge, Blob } from '../media'
import { Icon } from '../Icon'

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
    q: 'Why does 1st-Pouf use ink text on pastel buttons, never white?',
    options: [
      { value: 'a', label: 'White fails WCAG AA on the pastels' },
      { value: 'b', label: 'It looked nicer' },
      { value: 'c', label: 'The reference required it' },
    ],
    answer: 'a',
  },
  {
    q: "What does a Segmented option's pressed-in look mean?",
    options: [
      { value: 'a', label: "It's disabled" },
      { value: 'b', label: "It's the selected option" },
      { value: 'c', label: "It's loading" },
    ],
    answer: 'b',
  },
  {
    q: 'Why do Stack and Row both set min-width: 0?',
    options: [
      { value: 'a', label: 'So every child is forced to a minimum size' },
      { value: 'b', label: "So a child can shrink and truncate instead of overflowing" },
      { value: 'c', label: 'It has no visible effect' },
    ],
    answer: 'b',
  },
  {
    q: "What replaced emoji across 1st-Pouf's icon vocabulary?",
    options: [
      { value: 'a', label: 'A stroked SVG icon set' },
      { value: 'b', label: 'Coloured PNGs' },
      { value: 'c', label: 'Plain Unicode symbols' },
    ],
    answer: 'a',
  },
]

/** An example quiz card: progress, five questions, instant right/wrong
 * feedback per answer, and a scored result screen with a per-question recap
 * and a restart. */
export function QuizBlock() {
  const [step, setStep] = useState(0)
  const [choice, setChoice] = useState('')
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState(0)
  const [history, setHistory] = useState<boolean[]>([])

  const current = QUESTIONS[Math.min(step, QUESTIONS.length - 1)]!
  const correct = choice === current.answer
  const pct = ((step + (revealed ? 1 : 0)) / QUESTIONS.length) * 100
  const done = step >= QUESTIONS.length - 1 && revealed

  function next() {
    if (!revealed) {
      setRevealed(true)
      setHistory((h) => [...h, correct])
      if (correct) setScore((s) => s + 1)
      return
    }
    setStep((s) => s + 1)
    setChoice('')
    setRevealed(false)
  }

  function restart() {
    setStep(0)
    setScore(0)
    setChoice('')
    setRevealed(false)
    setHistory([])
  }

  const pctScore = Math.round((score / QUESTIONS.length) * 100)
  const verdict = pctScore === 100 ? 'Perfect score!' : pctScore >= 60 ? 'Nice work' : 'Keep practising'

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
            <Stack gap={4}>
              <Blob icon={pctScore >= 60 ? 'trophy' : 'flame'} tone={pctScore >= 60 ? 'yellow' : 'orange'} />
              <Stack gap={1}>
                <Heading level={2}>{verdict}</Heading>
                <Text muted>You scored {score} of {QUESTIONS.length} ({pctScore}%).</Text>
              </Stack>
              <Stack gap={2}>
                {QUESTIONS.map((question, i) => (
                  <Row key={i} gap={2} wrap={false}>
                    <Icon name={history[i] ? 'ok' : 'fail'} size="sm" />
                    <Text size="sm" muted truncate>{question.q}</Text>
                  </Row>
                ))}
              </Stack>
              <Button tone="mint" onClick={restart}>Play again</Button>
            </Stack>
          ) : (
            <>
              <Heading level={3}>{current.q}</Heading>
              <RadioGroup label="Answer" value={choice} onChange={setChoice} options={current.options} disabled={revealed} />
              {revealed && (
                <Row gap={2} wrap={false}>
                  <Icon name={correct ? 'ok' : 'fail'} size="sm" />
                  <Text muted>{correct ? 'Correct!' : `The answer was "${current.options.find((o) => o.value === current.answer)?.label}".`}</Text>
                </Row>
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
