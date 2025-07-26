import { CSSProperties } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/atoms/Button'

import { Toaster as Sonner, toast as sonnerToast, ToasterProps } from 'sonner'
import { Icon, IconProps } from '@/components/ui/atoms/Icon'

const toastVariants = cva('', {
  variants: {
    variant: {
      default: 'bg-background ring-foreground dark:ring-gray-600',
      info: 'bg-blue-50 dark:bg-blue-900 ring-blue-200 dark:ring-blue-700',
      success:
        'bg-green-50 dark:bg-green-900 ring-green-200 dark:ring-green-700',
      error: 'bg-red-50 dark:bg-red-900 ring-red-200 dark:ring-red-700',
      warning:
        'bg-yellow-50 dark:bg-yellow-900 ring-yellow-200 dark:ring-yellow-700',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const titleVariants = cva('text-sm font-medium leading-5', {
  variants: {
    variant: {
      default: 'text-gray-900 dark:text-gray-100',
      info: 'text-blue-900 dark:text-blue-100',
      success: 'text-green-900 dark:text-green-100',
      error: 'text-red-900 dark:text-red-100',
      warning: 'text-yellow-900 dark:text-yellow-100',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const descriptionVariants = cva('mt-1 text-sm leading-5 break-words', {
  variants: {
    variant: {
      default: 'text-gray-600 dark:text-gray-300',
      info: 'text-blue-700 dark:text-blue-200',
      success: 'text-green-700 dark:text-green-200',
      error: 'text-red-700 dark:text-red-200',
      warning: 'text-yellow-700 dark:text-yellow-200',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const iconBgVariants = cva(
  'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3',
  {
    variants: {
      variant: {
        default: 'bg-gray-100 dark:bg-gray-700',
        info: 'bg-blue-100 dark:bg-blue-800',
        success: 'bg-green-100 dark:bg-green-800',
        error: 'bg-red-100 dark:bg-red-800',
        warning: 'bg-yellow-100 dark:bg-yellow-800',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

const iconVariants = cva('w-4 h-4', {
  variants: {
    variant: {
      default: 'text-gray-500 dark:text-gray-400',
      info: 'text-blue-500 dark:text-blue-400',
      success: 'text-green-500 dark:text-green-400',
      error: 'text-red-500 dark:text-red-400',
      warning: 'text-yellow-500 dark:text-yellow-400',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

type Variant = VariantProps<typeof toastVariants>['variant']
export type ToastProps = {
  id: string | number
  title: string
  variant?: Variant
  description?: string
  button?: {
    label: string
    onClick: () => void
  }
}

function getIconName(variant: Variant): IconProps['name'] | undefined {
  switch (variant) {
    case 'info':
      return 'info'
    case 'success':
      return 'checkCircle'
    case 'error':
      return 'xCircle'
    case 'warning':
      return 'alertCircle'
    default:
      return undefined
  }
}

export function Toast({
  id,
  variant = 'default',
  title,
  description,
  button,
}: ToastProps) {
  const iconName = getIconName(variant)
  return (
    <div
      className={cn(
        'flex gap-x-3 rounded-md shadow-md ring-1 w-full md:max-w-[420px] p-4',
        toastVariants({ variant }),
      )}
    >
      {iconName ? (
        <div className={iconBgVariants({ variant })}>
          <Icon name={iconName} className={iconVariants({ variant })} />
        </div>
      ) : null}

      <div className='flex-1 min-w-0 mr-3'>
        <p className={titleVariants({ variant })}>{title}</p>
        {description && (
          <p className={descriptionVariants({ variant })}>{description}</p>
        )}
      </div>
      {button ? (
        <div className='flex-shrink-0'>
          <Button
            size='sm'
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
