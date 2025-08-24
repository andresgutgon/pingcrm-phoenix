import { buildUrl, type RouteQueryOptions, type RouteDefinition, type RouteDefinitionWithParameters, type WayfinderUrl } from './../../wayfinder'

/**
 * @see PingcrmWeb.HomeController::show
 * @route /
*/

export const publicHome = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
  url: publicHome.url(options).path,
  method: 'get',
})

publicHome.definition = {
  methods: ["get"],
  url: '/',
  parameters: {}
} satisfies RouteDefinitionWithParameters<['get']>

publicHome.url = (options?: RouteQueryOptions): WayfinderUrl => {
  return buildUrl({
    definition: publicHome.definition,
    options
  })
}

publicHome.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
  url: publicHome.url(options).path,
  method: 'get',
})


const HomeController = { publicHome }

export default HomeController
