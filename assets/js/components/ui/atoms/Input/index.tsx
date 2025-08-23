import { InputHTMLAttributes, ComponentPropsWithRef } from 'react'

import { cn } from '@/lib/utils'
import { font } from '@/components/ui/tokens/fonts'
import { FormField, type FormFieldProps } from '@/components/ui/atoms/FormField'

export type InputProps = ComponentPropsWithRef<'input'> &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> &
  Omit<FormFieldProps, 'children'> & {
    hideNativeAppearance?: boolean
  }

const Input = ({
  ref,
  className,
  label,
  info,
  error,
  description,
  type,
  hideNativeAppearance = false,
  ...props
}: InputProps) => {
  return (
    <FormField
      label={label}
      info={info}
      description={description}
      error={error}
      hidden={props.hidden}
    >
      <input
        ref={ref}
        type={type}
        className={cn(
          font.size.h5,
          'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground',
          'dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1',
          'text-base shadow-xs transition-[color,box-shadow] outline-none',
          'file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium',
          'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          'aria-invalid:border-destructive-border aria-invalid:ring-destructive-ring',
          className,
          {
            hidden: !!props.hidden,
            'appearance-none': hideNativeAppearance,
          },
        )}
        {...props}
      />
    </FormField>
  )
}

export { Input }
