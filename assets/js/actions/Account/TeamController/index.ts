import { buildUrl, type RouteQueryOptions, type RouteDefinition, type RouteDefinitionWithParameters, type WayfinderUrl } from './../../../wayfinder'

/**
 * @see PingcrmWeb.Account.TeamController::show
 * @route /account/team
*/

export const teamPage = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
  url: teamPage.url(options).path,
  method: 'get',
})

teamPage.definition = {
  methods: ["get"],
  url: '/account/team',
  parameters: {}
} satisfies RouteDefinitionWithParameters<['get']>

teamPage.url = (options?: RouteQueryOptions): WayfinderUrl => {
  return buildUrl({
    definition: teamPage.definition,
    options
  })
}

teamPage.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
  url: teamPage.url(options).path,
  method: 'get',
})


const TeamController = { teamPage }

export default TeamController
