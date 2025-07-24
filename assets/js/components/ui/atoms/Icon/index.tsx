import { lazy, Suspense } from 'react'
import { cn } from '@/lib/utils'
import {
  type LucideProps,
  type LucideIconName,
  LUCIDE_IMPORTS,
} from './lucideIcons'

type IconName = LucideIconName

export type IconProps = LucideProps & {
  name: IconName
  size?: 'small' | 'normal'
}

const getSize = (size: IconProps['size']) =>
  cn({
    'w-4 h-4': size === 'small',
    'w-6 h-6': size === 'normal',
  })

export function Icon({ name, size: iconSize, className, ...props }: IconProps) {
  const IconComponent = lazy(LUCIDE_IMPORTS[name])
  const size = getSize(iconSize ?? 'small')
  return (
    <Suspense fallback={<span className={cn('inline-block', size)} />}>
      <IconComponent {...props} className={cn(size, className)} />
    </Suspense>
  )
}
