import { ReactNode } from 'react'
import cn from 'classnames'
import { Link } from '@inertiajs/react'
import { WayfinderUrl } from '@/wayfinder'

export function MainMenuItem({
  link,
  text,
  icon,
}: {
  link: WayfinderUrl
  text: string
  icon?: ReactNode
}) {
  return (
    <Link
      href={link.path}
      className={cn('flex items-center group px-12 py-3 space-x-3', {
        'bg-indigo-500': link.isCurrent,
      })}
    >
      <div
        className={cn({
          'text-white': link.isCurrent,
          'text-indigo-400 group-hover:text-white': !link.isCurrent,
        })}
      >
        {icon}
      </div>
      <div
        className={cn({
          'text-white': link.isCurrent,
          'text-indigo-200 group-hover:text-white': !link.isCurrent,
        })}
      >
        {text}
      </div>
    </Link>
  )
}
