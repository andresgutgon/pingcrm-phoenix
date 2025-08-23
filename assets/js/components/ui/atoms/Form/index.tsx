import { ComponentPropsWithRef, HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type FormProps = HTMLAttributes<HTMLFormElement> & ComponentPropsWithRef<'form'>

export function Form({ children, ref, className, ...props }: FormProps) {
  return (
    <form ref={ref} className={cn('space-y-4', className)} {...props}>
      {children}
    </form>
  )
}
