import { Button } from '@/components/ui/atoms/Button'
import { useTheme } from 'next-themes'
import { CSSProperties } from 'react'

import { Toaster as Sonner, toast as sonnerToast, ToasterProps } from 'sonner'

export type ToastProps = {
  id: string | number
  title: string
  description?: string
  button?: {
    label: string
    onClick: () => void
  }
  variant?: 'info' | 'success' | 'error' | 'warning' | 'default'
}

export function Toast({
  id,
  variant = 'default',
  title,
  description,
  button,
}: ToastProps) {
  return (
    <div className='flex rounded-lg bg-white shadow-lg ring-1 ring-black/5 w-full md:max-w-[364px] items-center p-4'>
      <div className='flex flex-1 items-center'>
        <div className='w-full'>
          <p className='text-sm font-medium text-gray-900'>{title}</p>
          <p className='mt-1 text-sm text-gray-500'>{description}</p>
        </div>
      </div>
      {button ? (
        <Button
          size='sm'
          onClick={() => {
            button.onClick()
            sonnerToast.dismiss(id)
          }}
        >
          {button.label}
        </Button>
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
