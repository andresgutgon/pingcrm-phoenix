import { Icon, IconProps } from '@/components/ui/atoms/Icon'
import {
  AlertProps as PrimitiveAlertProps,
  Alert as AlertRoot,
  AlertTitle,
  AlertDescription,
} from './Primitives'
import { ReactNode } from 'react'

export type AlertVariant = Exclude<
  PrimitiveAlertProps['variant'],
  null | undefined
>

const ICON: Record<AlertVariant, IconProps['name']> = {
  success: 'checkCircle',
  warning: 'alertCircle',
  error: 'alertCircle',
}

export function Alert({
  variant,
  title,
  description,
  dataTestRef,
  onClose,
}: {
  variant: AlertVariant
  title: string
  description?: ReactNode | string
  dataTestRef?: string
  onClose?: () => void
}) {
  const iconName = variant ? ICON[variant] : 'alertCircle'
  return (
    <AlertRoot data-test={dataTestRef} variant={variant}>
      <Icon name={iconName} className='text-current' />
      <AlertTitle onClose={onClose}>{title}</AlertTitle>
      {description ? <AlertDescription>{description}</AlertDescription> : null}
    </AlertRoot>
  )
}
