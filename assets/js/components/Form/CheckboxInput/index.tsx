import { ComponentProps } from 'react'

type Props = ComponentProps<'input'> & {
  label?: string
}

export function CheckboxInput({ label, name, ...props }: Props) {
  return (
    <label className='flex items-center select-none' htmlFor={name}>
      <input
        id={name}
        name={name}
        type='checkbox'
        className='mr-2 form-checkbox rounded text-indigo-600 focus:ring-indigo-600'
        {...props}
      />
      <span className='text-sm'>{label}</span>
    </label>
  )
}
