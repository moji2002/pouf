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
      className={[
        'pouf-slider relative flex items-center w-full h-7 [touch-action:none] select-none',
        'data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed',
      ].join(' ')}
      value={value}
      onValueChange={onChange}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
    >
      <RSlider.Track className="pouf-slider__track relative flex-1 h-3.5 rounded-[999px] bg-bg cushion-field">
        <RSlider.Range className="pouf-slider__range absolute h-full rounded-[999px] bg-purple [box-shadow:inset_0_-3px_0_rgba(0,0,0,0.1)]" />
      </RSlider.Track>
      {value.map((_, i) => (
        <RSlider.Thumb key={i} className={[
            /* Ties to the range it drags via the same purple ring — one
             * control, not a bead and a separate knob. */
            'pouf-slider__thumb block w-[22px] h-[22px] rounded-[50%] bg-surface border-none cursor-pointer',
            '[box-shadow:inset_0_0_0_3px_var(--purple),inset_0_-2px_0_rgba(0,0,0,0.08),0_3px_6px_rgba(58,46,92,0.22)]',
            '[transition:box-shadow_140ms_ease,transform_140ms_ease]',
            'hover:[transform:scale(1.08)] active:[transform:scale(0.94)]',
            'focus-visible:[outline:3px_solid_var(--ink)] focus-visible:outline-offset-[3px]',
            'data-[disabled]:cursor-not-allowed',
          ].join(' ')} aria-label={label ? `${label} thumb ${i + 1}` : undefined} />
      ))}
    </RSlider.Root>
  )
}
