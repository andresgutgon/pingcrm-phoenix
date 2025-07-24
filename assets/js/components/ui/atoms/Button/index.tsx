import { type ComponentProps } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { buttonVariants } from './buttonVariants'
import { Icon, IconProps } from '@/components/ui/atoms/Icon'

type ButtonIconProps = IconProps & {
  placement?: 'left' | 'right'
}

export type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    fullWidth?: boolean
    asChild?: boolean
    loading?: boolean
    iconProps?: ButtonIconProps
    screenReaderText?: string
  }

function Button({
  className,
  variant,
  size,
  children,
  iconProps,
  asChild = false,
  disabled = false,
  loading = false,
  fullWidth = false,
  screenReaderText,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button'

  if (!children && !iconProps) {
    throw new Error('Button must have children or iconProps')
  }
  const iconPlacement = iconProps?.placement || 'left'

  return (
    <Comp
      data-slot='button'
      className={cn(buttonVariants({ variant, size, className }), {
        'cursor-pointer': !disabled,
        'cursor-not-allowed': disabled,
        'w-full': fullWidth,
      })}
      data-loading={loading}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <Icon name='loader' className='animate-spin' />
      ) : iconProps && iconPlacement === 'left' ? (
        <Icon
          {...iconProps}
          className={cn('flex-shrink-0', iconProps.className)}
        />
      ) : null}
      {children}
      {screenReaderText ? (
        <span className='sr-only'>{screenReaderText}</span>
      ) : null}
    </Comp>
  )
}

export { Button }
