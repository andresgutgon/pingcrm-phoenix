import { Check, CircleX, TriangleAlert } from 'lucide-react'
import CloseButton from '@/components/Button/CloseButton'
import { ReactNode } from 'react'
import cn from 'classnames'

export type AlertProps = {
  message: string
  icon?: ReactNode
  action?: ReactNode
  onClose?: () => void
  variant?: 'success' | 'error' | 'warning' | 'info'
  dataTestRef?: string
}

const COLOR = {
  info: 'blue',
  success: 'green',
  error: 'red',
  warning: 'yellow',
}

export default function Alert({
  icon,
  action,
  message,
  variant,
  onClose,
  dataTestRef,
}: AlertProps) {
  const iconComponent = {
    info: <Check size={20} />,
    success: <Check size={20} />,
    error: <CircleX size={20} />,
    warning: <TriangleAlert size={20} />,
  }[variant || 'success']

  return (
    <div
      data-test={dataTestRef}
      className={cn(
        'px-4 flex items-center justify-between rounded max-w-3xl',
        {
          'bg-blue-100 text-blue-800': variant === 'info',
          'bg-green-500 text-white': variant === 'success',
          'bg-red-500 text-white': variant === 'error',
          'bg-yellow-500 text-yellow-800': variant === 'warning',
        },
      )}
    >
      <div className='flex items-center space-x-2'>
        {icon || iconComponent}
        <div className='py-4 text-sm font-medium'>{message}</div>
      </div>
      {action}
      {onClose && (
        <CloseButton onClick={onClose} color={COLOR[variant || 'success']} />
      )}
    </div>
  )
}
