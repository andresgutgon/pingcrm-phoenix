import { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Text } from '@/components/ui/atoms/Text'
import { TextAlign } from '@/components/ui/tokens/fonts'

export type HeaderProps = {
  children: ReactNode
  align?: TextAlign
}
function CardHeader({ children, align = 'left' }: HeaderProps) {
  return (
    <div
      data-slot='card-header'
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto]',
        {
          'text-center': align === 'center',
          'text-right': align === 'right',
        },
      )}
    >
      {children}
    </div>
  )
}

const COMMON_TITLE_PROPS = {
  'data-slot': 'card-title',
  overrideLineHeight: 'none' as const,
}
export type TitleProps = {
  content: string
  align?: TextAlign
  size?: 'normal' | 'big'
}
function CardTitle({ content, align, size = 'normal' }: TitleProps) {
  if (size === 'normal') {
    return (
      <Text.H4 {...COMMON_TITLE_PROPS} align={align}>
        {content}
      </Text.H4>
    )
  }

  return (
    <Text.H3 {...COMMON_TITLE_PROPS} align={align}>
      {content}
    </Text.H3>
  )
}

function CardDescription({
  children,
  align,
}: {
  children: ReactNode
  align?: TextAlign
}) {
  return (
    <Text.H5 data-slot='card-description' color='foregroundMuted' align={align}>
      {children}
    </Text.H5>
  )
}

function CardAction({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-action'
      className={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        className,
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-content'
      className={cn('px-6', className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-footer'
      className={cn('flex items-center px-6', className)}
      {...props}
    />
  )
}

export type CardRootProps = {
  children: ReactNode
  variant?: 'default' | 'primary'
}
function CardRoot({ variant = 'default', children }: CardRootProps) {
  return (
    <div
      data-slot='card'
      className={cn(
        'flex flex-col gap-6 rounded-xl py-6 ',
        'bg-card text-card-foreground',
        'border border-card-primary-border shadow-sm shadow-card-primary-shadow',
        {
          'border-card-border shadow-card-shadow': variant === 'default',
          'border-card-primary-border shadow-card-primary-shadow':
            variant === 'primary',
        },
      )}
    >
      {children}
    </div>
  )
}

export {
  CardRoot,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
