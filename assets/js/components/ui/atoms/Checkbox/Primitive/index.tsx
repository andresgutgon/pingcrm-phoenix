import { ComponentPropsWithRef } from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { cn } from '@/lib/utils'
import { Icon } from '@/components/ui/atoms/Icon'

export type CheckedState = CheckboxPrimitive.CheckedState
export type CheckboxAtomProps = ComponentPropsWithRef<
  typeof CheckboxPrimitive.Root
>
function CheckboxAtom({ ref, className, ...props }: CheckboxAtomProps) {
  return (
    <CheckboxPrimitive.Root
      ref={ref}
      data-slot='checkbox'
      className={cn(
        'size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow',
        'peer border-input dark:bg-input/30',

        // Checked
        'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary',
        'data-[state=checked]:border-primary',
        'data-[state=indeterminate]:text-primary data-[state=indeterminate]:border-primary',
        'data-[state=indeterminate]:text-primary focus-visible:border-primary',

        // Focus
        'focus-visible:border-ring focus-visible:ring-ring/50',
        'outline-none focus-visible:ring-[3px]',

        // Invalid
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',

        // Disabled
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot='checkbox-indicator'
        className='flex items-center justify-center text-current transition-none'
      >
        {props.checked === 'indeterminate' && <Icon name='minus' />}
        {props.checked === true && <Icon name='check' />}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

CheckboxAtom.displayName = CheckboxPrimitive.Root.displayName

export { CheckboxAtom }
