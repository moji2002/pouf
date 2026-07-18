import { ToggleGroup } from '../toggle'
import type { Demo } from './types'

export const toggleGroupDemos: Demo[] = [
  { id: 'default', states: ['hover', 'focus'], render: () => (
      <span data-subject>
        <ToggleGroup
          label="Format"
          value={['bold']}
          onChange={() => {}}
          options={[
            { value: 'bold', label: 'Bold', icon: 'add' },
            { value: 'italic', label: 'Italic', icon: 'draft' },
            { value: 'mono', label: 'Mono', icon: 'settings' },
          ]}
        />
      </span>
    ) },
  { id: 'multi-selected', render: () => (
      <ToggleGroup
        label="Format"
        value={['bold', 'italic']}
        onChange={() => {}}
        options={[
          { value: 'bold', label: 'Bold' },
          { value: 'italic', label: 'Italic' },
          { value: 'mono', label: 'Mono' },
        ]}
      />
    ) },
  { id: 'none-selected', render: () => (
      <ToggleGroup
        label="Format"
        value={[]}
        onChange={() => {}}
        options={[
          { value: 'bold', label: 'Bold' },
          { value: 'italic', label: 'Italic' },
        ]}
      />
    ) },
]
