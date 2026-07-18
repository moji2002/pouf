import * as RSlider from '@radix-ui/react-slider'

interface SliderProps {
  value: number[]
  onChange: (value: number[]) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  label?: string
}

export function Slider({ value, onChange, min = 0, max = 100, step = 1, disabled, label }: SliderProps) {
  return (
    <RSlider.Root
      className="clay-slider"
      value={value}
      onValueChange={onChange}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      aria-label={label}
    >
      <RSlider.Track className="clay-slider__track">
        <RSlider.Range className="clay-slider__range" />
      </RSlider.Track>
      {value.map((_, i) => (
        <RSlider.Thumb key={i} className="clay-slider__thumb" aria-label={label ? `${label} thumb ${i + 1}` : undefined} />
      ))}
    </RSlider.Root>
  )
}
