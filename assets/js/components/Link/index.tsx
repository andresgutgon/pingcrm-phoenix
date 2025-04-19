import { ReactNode } from 'react'
import Routes, { PathParamsWithQuery, RoutePath } from '@/routes/routes'
import { Link as InertiaLink, InertiaLinkProps } from '@inertiajs/react'

type LinkProps<T extends RoutePath> = Omit<InertiaLinkProps, 'href'> & {
  to: T
  params?: PathParamsWithQuery<T>
  children: ReactNode
}

export const Link = <T extends RoutePath>({
  to,
  params,
  children,
  ...props
}: LinkProps<T>) => {
  const href = Routes.replaceParams(to, params)
  return (
    <InertiaLink href={href} {...props}>
      {children}
    </InertiaLink>
  )
}
