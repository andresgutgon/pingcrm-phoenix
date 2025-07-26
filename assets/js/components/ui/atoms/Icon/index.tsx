import { ComponentType, lazy, LazyExoticComponent, Suspense } from 'react'
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

const lazyIcons: Partial<
  Record<IconName, LazyExoticComponent<ComponentType<LucideProps>>>
> = {}

export function Icon({ name, size: iconSize, className, ...props }: IconProps) {
  if (!lazyIcons[name]) {
    lazyIcons[name] = lazy(LUCIDE_IMPORTS[name])
  }
  const IconComponent = lazyIcons[name]
  const size = getSize(iconSize ?? 'small')
  return (
    <Suspense
      fallback={
        <svg
          fill='none'
          className={cn('inline-block shrink-0 animate-spin text-muted', size)}
          viewBox='0 0 24 24'
          aria-hidden='true'
        >
          <circle
            cx='12'
            cy='12'
            r='10'
            stroke='currentColor'
            strokeWidth='2'
          />
        </svg>
      }
    >
      <IconComponent {...props} className={cn(size, className)} />
    </Suspense>
  )
}
