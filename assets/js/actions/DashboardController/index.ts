import { buildUrl, type RouteQueryOptions, type RouteDefinition, type RouteDefinitionWithParameters, type WayfinderUrl } from './../../wayfinder'

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
  url: '/',
  parameters: {}
} satisfies RouteDefinitionWithParameters<['get']>
home.url = (options?: RouteQueryOptions): WayfinderUrl => {
  return buildUrl({
    definition: home.definition,
    options
  })
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
  url: '/contacts',
  parameters: {}
} satisfies RouteDefinitionWithParameters<['get']>
contacts.url = (options?: RouteQueryOptions): WayfinderUrl => {
  return buildUrl({
    definition: contacts.definition,
    options
  })
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
  url: '/organizations',
  parameters: {}
} satisfies RouteDefinitionWithParameters<['get']>
organizations.url = (options?: RouteQueryOptions): WayfinderUrl => {
  return buildUrl({
    definition: organizations.definition,
    options
  })
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
  url: '/reports',
  parameters: {}
} satisfies RouteDefinitionWithParameters<['get']>
reports.url = (options?: RouteQueryOptions): WayfinderUrl => {
  return buildUrl({
    definition: reports.definition,
    options
  })
}
reports.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
  url: reports.url(options).path,
  method: 'get',
})


const DashboardController = { home, contacts, organizations, reports }

export default DashboardController
