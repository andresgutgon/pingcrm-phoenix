import { ComponentProps } from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { Text } from '@/components/ui/atoms/Text'

import { cn } from '@/lib/utils'
import {
  BackgroundColor,
  colors,
  TextColor,
  BorderColor,
} from '@/components/ui/tokens/colors'

export type AvatarRootProps = ComponentProps<typeof AvatarPrimitive.Root> & {
  size?: 'normal' | 'preview'
  rounded?: 'normal' | 'full'
  borderColor?: BorderColor
}
function AvatarRoot({
  size = 'normal',
  rounded = 'normal',
  borderColor,
  ...props
}: AvatarRootProps) {
  const border = borderColor ? colors.borderColors[borderColor] : undefined
  return (
    <AvatarPrimitive.Root
      data-slot='avatar'
      className={cn('relative flex shrink-0 overflow-hidden', border, {
        'h-8 w-8 size-8': size === 'normal',
        'h-32 w-32 size-32': size === 'preview',
        'rounded-full': rounded === 'full',
        'rounded-lg': rounded === 'normal',
        border: borderColor !== undefined,
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
      className={cn('aspect-square size-full object-cover', className)}
      {...props}
    />
  )
}

function AvatarFallback({
  rounded = 'normal',
  children,
  bgColor = 'backgroundMuted',
  color = 'foreground',
  size = 'normal',
  ...props
}: ComponentProps<typeof AvatarPrimitive.Fallback> & {
  bgColor?: BackgroundColor
  color?: TextColor
  rounded?: AvatarRootProps['rounded']
  size?: AvatarRootProps['size']
}) {
  const TextComp = size === 'preview' ? Text.H3 : Text.H5
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
      <TextComp color={color}>{children}</TextComp>
    </AvatarPrimitive.Fallback>
  )
}

export { AvatarRoot, AvatarImage, AvatarFallback }
