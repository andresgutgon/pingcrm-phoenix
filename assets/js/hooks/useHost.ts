import { useCallback, useMemo } from 'react'
import { usePage } from '@inertiajs/react'
import { PageProps } from '@/types'

export function useHost() {
  const { site_url, app_url } = usePage<PageProps>().props

  const buildAppUrl = useCallback(
    ({ path }: { path?: string } = {}) =>
      path ? `${app_url}${path}` : app_url,
    [app_url],
  )
  const buildSiteUrl = useCallback(
    ({ path }: { path?: string } = {}) =>
      path ? `${site_url}${path}` : site_url,
    [site_url],
  )

  return useMemo(
    () => ({ buildAppUrl, buildSiteUrl }),
    [buildAppUrl, buildSiteUrl],
  )
}
