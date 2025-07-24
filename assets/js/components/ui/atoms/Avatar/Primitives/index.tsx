import { ComponentProps } from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { Text } from '@/components/ui/atoms/Text'

import { cn } from '@/lib/utils'
import {
  BackgroundColor,
  colors,
  TextColor,
} from '@/components/ui/tokens/colors'

export type AvatarRootProps = ComponentProps<typeof AvatarPrimitive.Root> & {
  size?: 'normal'
  rounded?: 'normal' | 'full'
}
function AvatarRoot({
  size = 'normal',
  rounded = 'normal',
  ...props
}: AvatarRootProps) {
  return (
    <AvatarPrimitive.Root
      data-slot='avatar'
      className={cn('relative flex shrink-0 overflow-hidden', {
        'h-8 w-8 size-8': size === 'normal',
        'rounded-full': rounded === 'full',
        'rounded-lg': rounded === 'normal',
      })}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot='avatar-image'
      className={cn('aspect-square size-full', className)}
      {...props}
    />
  )
}

function AvatarFallback({
  rounded = 'normal',
  children,
  bgColor = 'backgroundMuted',
  color = 'foregroundMuted',
  ...props
}: ComponentProps<typeof AvatarPrimitive.Fallback> & {
  bgColor?: BackgroundColor
  color?: TextColor
  rounded?: AvatarRootProps['rounded']
}) {
  return (
    <AvatarPrimitive.Fallback
      data-slot='avatar-fallback'
      className={cn(
        'flex size-full items-center justify-center rounded-full',
        colors.backgrounds[bgColor],
        {
          'rounded-lg': rounded === 'normal',
          'rounded-full': rounded === 'full',
        },
      )}
      {...props}
    >
      <Text.H5 color={color}>{children}</Text.H5>
    </AvatarPrimitive.Fallback>
  )
}

export { AvatarRoot, AvatarImage, AvatarFallback }
