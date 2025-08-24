import { buildUrl, type RouteQueryOptions, type RouteDefinition, type RouteDefinitionWithParameters, type WayfinderUrl } from './../../../wayfinder'

/**
 * @see PingcrmWeb.Dashboard.DashboardIndexController::index
 * @route /dashboard
*/

export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
  url: dashboard.url(options).path,
  method: 'get',
})

dashboard.definition = {
  methods: ["get"],
  url: '/dashboard',
  parameters: {}
} satisfies RouteDefinitionWithParameters<['get']>

dashboard.url = (options?: RouteQueryOptions): WayfinderUrl => {
  return buildUrl({
    definition: dashboard.definition,
    options
  })
}

dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
  url: dashboard.url(options).path,
  method: 'get',
})

/**
 * @see PingcrmWeb.Dashboard.DashboardIndexController::index
 * @route /dashboard/contacts
*/

export const contacts = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
  url: contacts.url(options).path,
  method: 'get',
})

contacts.definition = {
  methods: ["get"],
  url: '/dashboard/contacts',
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
 * @see PingcrmWeb.Dashboard.DashboardIndexController::index
 * @route /dashboard/organizations
*/

export const organizations = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
  url: organizations.url(options).path,
  method: 'get',
})

organizations.definition = {
  methods: ["get"],
  url: '/dashboard/organizations',
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
 * @see PingcrmWeb.Dashboard.DashboardIndexController::index
 * @route /dashboard/reports
*/

export const reports = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
  url: reports.url(options).path,
  method: 'get',
})

reports.definition = {
  methods: ["get"],
  url: '/dashboard/reports',
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


const DashboardIndexController = { dashboard, contacts, organizations, reports }

export default DashboardIndexController
