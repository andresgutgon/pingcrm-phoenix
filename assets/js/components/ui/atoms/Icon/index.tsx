import { ComponentType, lazy, LazyExoticComponent, Suspense } from 'react'
import { cn } from '@/lib/utils'
import {
  type LucideProps,
  type LucideIconName,
  LUCIDE_IMPORTS,
} from './lucide-icons'
import { colors, DarkTextColor, TextColor } from '@/components/ui/tokens/colors'
import {
  Opacity,
  opacity as opacityTokens,
} from '@/components/ui/tokens/opacity'
import {
  CustomIconName,
  CUSTOM_ICON_IMPORTS,
} from '@/components/ui/atoms/Icon/custom-icons'

const ICON_IMPORTS = { ...LUCIDE_IMPORTS, ...CUSTOM_ICON_IMPORTS }
export type IconName = LucideIconName | CustomIconName

export type IconProps = LucideProps & {
  name: IconName
  color?: TextColor
  darkColor?: DarkTextColor
  opacity?: Opacity
  size?: 'xsmall' | 'small' | 'normal'
}

const getSize = (size: IconProps['size']) =>
  cn({
    'w-2 h-2': size === 'xsmall',
    'w-4 h-4': size === 'small',
    'w-6 h-6': size === 'normal',
  })

const lazyIcons: Partial<
  Record<IconName, LazyExoticComponent<ComponentType<LucideProps>>>
> = {}

export function Icon({
  name,
  color,
  darkColor,
  size: iconSize,
  className,
  opacity,
  ...props
}: IconProps) {
  if (!lazyIcons[name]) {
    lazyIcons[name] = lazy(ICON_IMPORTS[name])
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
      <IconComponent
        {...props}
        data-icon-atom={true}
        className={cn(size, className, {
          [opacityTokens[opacity!]]: opacity,
          [colors.textColors[color!]]: color,
          [colors.darkTextColors[darkColor!]]: darkColor,
        })}
      />
    </Suspense>
  )
}
