import { lazy, Suspense } from 'react'
import {
  type LucideProps,
  type LucideIconName,
  LUCIDE_IMPORTS,
} from './lucideIcons'

type IconName = LucideIconName

export type IconProps = LucideProps & {
  name: IconName
}

export function Icon({ name, ...props }: IconProps) {
  const IconComponent = lazy(LUCIDE_IMPORTS[name])
  return (
    <Suspense fallback={<span className='inline-block w-4 h-4' />}>
      <IconComponent {...props} />
    </Suspense>
  )
}
