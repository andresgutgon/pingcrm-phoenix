import { CSSProperties } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import { Button, ButtonProps } from '@/components/ui/atoms/Button'
import { Text } from '@/components/ui/atoms/Text'

import { Toaster as Sonner, toast as sonnerToast, ToasterProps } from 'sonner'

import { Icon, IconProps } from '@/components/ui/atoms/Icon'
import {
  BackgroundColor,
  colors,
  TextColor,
} from '@/components/ui/tokens/colors'

const toastVariants = cva('', {
  variants: {
    variant: {
      default: 'bg-background ring-input', // TODO: Check
      warning: 'bg-warning ring-warning-border',
      success: 'bg-success ring-success-border',
      destructive: 'bg-destructive ring-destructive-border',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

function iconBgColor(variant: ToastProps['variant']): BackgroundColor {
  switch (variant) {
    case 'success':
      return 'successMuted'
    case 'destructive':
      return 'destructiveMuted'
    case 'warning':
      return 'warningMuted'
    default:
      return 'sidebar'
  }
}

function iconColor(variant: ToastProps['variant']): TextColor {
  switch (variant) {
    case 'success':
      return 'success'
    case 'destructive':
      return 'destructive'
    case 'warning':
      return 'warning'
    default:
      return 'foreground'
  }
}

function getIconName(variant: Variant): IconProps['name'] | undefined {
  switch (variant) {
    case 'success':
      return 'checkCircle'
    case 'destructive':
      return 'xCircle'
    case 'warning':
      return 'alertCircle'
    default:
      return 'info'
  }
}
function getButtonVariant(variant: Variant): ButtonProps['variant'] {
  switch (variant) {
    case 'success':
      return 'success'
    case 'destructive':
      return 'destructive'
    case 'warning':
      return 'warning'
    default:
      return 'secondary'
  }
}

function titleColor(variant: ToastProps['variant']): TextColor {
  if (!variant || variant === 'default') {
    return 'foreground'
  }
  return variant
}

function descriptionColor(variant: ToastProps['variant']): TextColor {
  switch (variant) {
    case 'success':
      return 'successMuted'
    case 'destructive':
      return 'destructiveMuted'
    case 'warning':
      return 'warningMuted'
    default:
      return 'foregroundMuted'
  }
}

type Variant = VariantProps<typeof toastVariants>['variant']
export type ToastProps = {
  id: string | number
  title: string
  variant?: Variant
  description?: string
  width?: 'normal' | 'full'
  shadow?: boolean
  button?: {
    label: string
    onClick: () => void
  }
}

export function Toast({
  id,
  variant = 'default',
  width = 'full',
  shadow,
  title,
  description,
  button,
}: ToastProps) {
  const iconName = getIconName(variant)
  return (
    <div
      className={cn(
        'flex gap-x-3 rounded-md ring-1 w-full p-4',
        toastVariants({ variant }),
        {
          'md:w-80': width === 'normal',
          'shadow-md': shadow,
        },
      )}
    >
      {iconName ? (
        <div
          className={cn(
            'flex-shrink-0 w-8 h-8 rounded-md',
            'flex items-center justify-center mr-3',
            colors.backgrounds[iconBgColor(variant)],
          )}
        >
          <Icon size='small' name={iconName} color={iconColor(variant)} />
        </div>
      ) : null}

      <div className='flex-1 min-w-0 mr-3'>
        <Text.H5M display='block' asChild color={titleColor(variant)}>
          <h3>{title}</h3>
        </Text.H5M>
        {description && (
          <Text.H5 display='block' asChild color={descriptionColor(variant)}>
            <p>{description}</p>
          </Text.H5>
        )}
      </div>
      {button ? (
        <div className='flex-shrink-0'>
          <Button
            size='sm'
            variant={getButtonVariant(variant)}
            onClick={() => {
              button.onClick()
              sonnerToast.dismiss(id)
            }}
          >
            {button.label}
          </Button>
        </div>
      ) : null}
    </div>
  )
}

export function Toaster({ ...props }: ToasterProps) {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className='toaster group'
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        } as CSSProperties
      }
      {...props}
    />
  )
}
