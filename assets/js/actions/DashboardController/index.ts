import { queryParams, isCurrentUrl, type RouteQueryOptions, type RouteDefinition, type WayfinderUrl } from './../../wayfinder'

/**
 * @see PingcrmWeb.DashboardController::index
 * @see lib/pingcrm_web/controllers/dashboard_controller.ex:4
 * @route /
*/

export const home = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
  url: home.url(options).path,
  method: 'get',
})

home.definition = {
  methods: ["get"],
  url: '/'
} satisfies RouteDefinition<['get']>
home.url = (options?: RouteQueryOptions): WayfinderUrl => {
  let routePath = home.definition.url

  
  routePath = home.definition.url
  routePath = routePath.replace(/\/+$/, '') || '/'
    const path = routePath + queryParams(options);

  return {
    path,
    isCurrent: isCurrentUrl({
      routePath,
      currentPath: options?.currentPath,
      matchExact: options?.matchExact
    })
  }

}
home.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
  url: home.url(options).path,
  method: 'get',
})

/**
 * @see PingcrmWeb.DashboardController::index
 * @see lib/pingcrm_web/controllers/dashboard_controller.ex:4
 * @route /contacts
*/

export const contacts = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
  url: contacts.url(options).path,
  method: 'get',
})

contacts.definition = {
  methods: ["get"],
  url: '/contacts'
} satisfies RouteDefinition<['get']>
contacts.url = (options?: RouteQueryOptions): WayfinderUrl => {
  let routePath = contacts.definition.url

  
  routePath = contacts.definition.url
  routePath = routePath.replace(/\/+$/, '') || '/'
    const path = routePath + queryParams(options);

  return {
    path,
    isCurrent: isCurrentUrl({
      routePath,
      currentPath: options?.currentPath,
      matchExact: options?.matchExact
    })
  }

}
contacts.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
  url: contacts.url(options).path,
  method: 'get',
})

/**
 * @see PingcrmWeb.DashboardController::index
 * @see lib/pingcrm_web/controllers/dashboard_controller.ex:4
 * @route /organizations
*/

export const organizations = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
  url: organizations.url(options).path,
  method: 'get',
})

organizations.definition = {
  methods: ["get"],
  url: '/organizations'
} satisfies RouteDefinition<['get']>
organizations.url = (options?: RouteQueryOptions): WayfinderUrl => {
  let routePath = organizations.definition.url

  
  routePath = organizations.definition.url
  routePath = routePath.replace(/\/+$/, '') || '/'
    const path = routePath + queryParams(options);

  return {
    path,
    isCurrent: isCurrentUrl({
      routePath,
      currentPath: options?.currentPath,
      matchExact: options?.matchExact
    })
  }

}
organizations.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
  url: organizations.url(options).path,
  method: 'get',
})

/**
 * @see PingcrmWeb.DashboardController::index
 * @see lib/pingcrm_web/controllers/dashboard_controller.ex:4
 * @route /reports
*/

export const reports = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
  url: reports.url(options).path,
  method: 'get',
})

reports.definition = {
  methods: ["get"],
  url: '/reports'
} satisfies RouteDefinition<['get']>
reports.url = (options?: RouteQueryOptions): WayfinderUrl => {
  let routePath = reports.definition.url

  
  routePath = reports.definition.url
  routePath = routePath.replace(/\/+$/, '') || '/'
    const path = routePath + queryParams(options);

  return {
    path,
    isCurrent: isCurrentUrl({
      routePath,
      currentPath: options?.currentPath,
      matchExact: options?.matchExact
    })
  }

}
reports.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
  url: reports.url(options).path,
  method: 'get',
})


const DashboardController = { home, contacts, organizations, reports }

export default DashboardController
