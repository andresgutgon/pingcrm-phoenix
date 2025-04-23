import cn from 'classnames'
import { ComponentProps } from 'react'

type Props = ComponentProps<'input'> & {
  error?: string
}

export default function TextInput({ name, className, error, ...props }: Props) {
  return (
    <input
      id={name}
      name={name}
      {...props}
      className={cn('form-input w-full rounded', className, {
        'border-red-400 focus:border-red-400 focus:ring-red-400': error,
      })}
    />
  )
}
