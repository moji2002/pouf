import * as RSeparator from '@radix-ui/react-separator'

export function Separator() {
  return (
    <RSeparator.Root
      className="pouf-separator border-none h-px bg-[rgba(201,168,255,0.3)] my-(--s2) mx-0"
      decorative
    />
  )
}
