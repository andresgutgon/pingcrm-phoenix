import { ComponentProps, CSSProperties } from 'react'
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
  isUploading?: boolean
  progress?: number
}
const JS_SIZE: Record<Exclude<AvatarRootProps['size'], undefined>, number> = {
  normal: 32,
  preview: 128,
}

function ProgressRing({
  size = 'normal',
  progress = 0,
}: {
  size: AvatarRootProps['size']
  progress: number
}) {
  const jsSize = JS_SIZE[size]
  const stroke = 4
  const viewBoxSize = jsSize + stroke / 2

  // expand svg so stroke isn't clipped
  const radius = jsSize / 2 - stroke / 2 // <-- shrink radius so stroke fits inside
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  const center = jsSize / 2

  return (
    <>
      <svg
        className='stroke-emerald-500 w-full h-full'
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        style={{ transform: 'rotate(-90deg)' }}
      >
        <circle
          fill='transparent'
          stroke='currentColor'
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap='round'
          r={radius}
          cx={center}
          cy={center}
          className='transition-[stroke-dashoffset] duration-500 ease-in-out text-green-400'
        />
      </svg>

      {/* Dot */}
      <div
        className={cn(
          'border border-green-50',
          'transform-origin-[center]',
          '[transform:rotate(calc(var(--angle)*1deg))_translateX(calc(var(--dot-radius)*1px))]',
          'absolute top-1/2 left-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2',
          'rounded-full bg-green-600 transition-transform duration-500 ease-in-out',
        )}
      />
    </>
  )
}

function AvatarRoot({
  size = 'normal',
  rounded = 'normal',
  borderColor,
  isUploading = false,
  progress = 0,
  children,
  ...props
}: AvatarRootProps) {
  const border = borderColor ? colors.borderColors[borderColor] : undefined
  const avatarSize = JS_SIZE[size]
  const radius = avatarSize / 2
  const angle = (progress / 100) * 360 - 90

  return (
    <AvatarPrimitive.Root
      data-slot='avatar'
      style={
        {
          '--progress': progress,
          '--angle': angle,
          '--dot-radius': radius,
        } as CSSProperties
      }
      className={cn('relative flex shrink-0', border, {
        'h-8 w-8': size === 'normal',
        'h-32 w-32': size === 'preview',
        'rounded-full': rounded === 'full',
        'rounded-lg': rounded === 'normal',
        border: borderColor !== undefined,
      })}
      {...props}
    >
      {/* Avatar content */}
      <div
        className={cn('overflow-hidden size-full', {
          'rounded-full': rounded === 'full',
          'rounded-lg': rounded === 'normal',
        })}
      >
        {children}
      </div>

      {/* Ring + dot */}
      <div
        className={cn(
          'z-10 absolute -inset-1 flex items-center justify-center',
          {
            'opacity-0': !isUploading,
          },
        )}
      >
        <ProgressRing size={size} progress={progress} />
      </div>
    </AvatarPrimitive.Root>
  )
}

function AvatarImage({
  className,
  ...props
}: ComponentProps<typeof AvatarPrimitive.Image>) {
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
