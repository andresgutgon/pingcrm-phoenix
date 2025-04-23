import { ReactNode } from 'react'
import cn from 'classnames'
import { Link } from '@/components/Link'
import { type RoutePath } from '@/routes/routes'

export default function MainMenuItem({
  icon,
  link,
  text,
}: {
  icon?: ReactNode
  link: RoutePath
  text: string
}) {
  // TODO: Improve routes integration between Phoenix and React
  const isActive = false
  return (
    <div className='mb-4'>
      <Link to={link} className='flex items-center group py-3 space-x-3'>
        <div
          className={cn({
            'text-white': isActive,
            'text-indigo-400 group-hover:text-white': !isActive,
          })}
        >
          {icon}
        </div>
        <div
          className={cn({
            'text-white': isActive,
            'text-indigo-200 group-hover:text-white': !isActive,
          })}
        >
          {text}
        </div>
      </Link>
    </div>
  )
}
