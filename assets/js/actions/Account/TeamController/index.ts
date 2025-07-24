import { buildUrl, type RouteQueryOptions, type RouteDefinition, type RouteDefinitionWithParameters, type WayfinderUrl } from './../../../wayfinder'

/**
 * @see PingcrmWeb.Account.TeamController::show
 * @see lib/pingcrm_web/controllers/account/team_controller.ex:4
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
