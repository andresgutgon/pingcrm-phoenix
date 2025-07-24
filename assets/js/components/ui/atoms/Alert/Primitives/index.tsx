import { HTMLAttributes, ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Icon } from '@/components/ui/atoms/Icon'

const alertVariants = cva(
  'relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current',
  {
    variants: {
      variant: {
        success: 'bg-card text-card-foreground',
        warning: 'bg-yellow-50 text-yellow-800 [&>svg]:text-yellow-500',
        error:
          'text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90',
      },
    },
    defaultVariants: {
      variant: 'success',
    },
  },
)

function AlertTitle({
  children,
  onClose,
}: {
  children: ReactNode
  onClose?: () => void
}) {
  return (
    <div
      data-slot='alert-title'
      className='col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight flex items-center justify-between gap-2'
    >
      {children}
      {onClose ? (
        <button
          type='button'
          className='text-muted-foreground hover:text-foreground cursor-pointer'
          onClick={onClose}
        >
          <Icon name='x' size='small' />
        </button>
      ) : null}
    </div>
  )
}

function AlertDescription({ children }: { children: ReactNode }) {
  return (
    <div
      data-slot='alert-description'
      className='text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed'
    >
      {children}
    </div>
  )
}

export type AlertProps = HTMLAttributes<HTMLDivElement> & {
  variant: VariantProps<typeof alertVariants>['variant']
  children: ReactNode
}

function Alert({ variant, children }: AlertProps) {
  return (
    <div data-slot='alert' role='alert' className={alertVariants({ variant })}>
      {children}
    </div>
  )
}

export { Alert, AlertTitle, AlertDescription }
