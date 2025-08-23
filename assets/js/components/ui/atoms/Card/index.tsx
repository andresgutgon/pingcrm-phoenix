import { ReactNode } from 'react'
import {
  type CardRootProps,
  CardRoot,
  CardTitle,
  CardDescription,
  CardHeader,
  CardAction,
  CardContent,
  CardFooter,
  HeaderProps,
  TitleProps,
} from './Primitives'

export function Card({
  children,
  variant = 'default',
  headerProps: { align } = { align: 'left' },
  title,
  description,
  action,
  footer,
}: {
  children?: ReactNode
  variant?: CardRootProps['variant']
  headerProps?: Omit<HeaderProps, 'children'>
  title?: TitleProps
  description?: string
  action?: ReactNode
  footer?: ReactNode
}) {
  const hasHeader = !!title || !!description || !!action
  const textAlign = action ? 'left' : align

  return (
    <CardRoot variant={variant}>
      {hasHeader ? (
        <CardHeader align={textAlign}>
          {title ? <CardTitle {...title} align={textAlign} /> : null}
          {description ? (
            <CardDescription align={textAlign}>{description}</CardDescription>
          ) : null}
          {action ? <CardAction>{action}</CardAction> : null}
        </CardHeader>
      ) : null}
      <CardContent>{children}</CardContent>
      {footer ? <CardFooter>{footer}</CardFooter> : null}
    </CardRoot>
  )
}
