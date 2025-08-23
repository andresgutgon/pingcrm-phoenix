import { buildUrl, type RouteQueryOptions, type RouteDefinition, type RouteDefinitionWithParameters, type WayfinderUrl } from './../../../wayfinder'

/**
 * @see PingcrmWeb.Account.SettingsController::show
 * @see lib/pingcrm_web/controllers/account/settings_controller.ex:9
 * @route /account
*/

export const account = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
  url: account.url(options).path,
  method: 'get',
})

account.definition = {
  methods: ["get"],
  url: '/account',
  parameters: {}
} satisfies RouteDefinitionWithParameters<['get']>

account.url = (options?: RouteQueryOptions): WayfinderUrl => {
  return buildUrl({
    definition: account.definition,
    options
  })
}

account.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
  url: account.url(options).path,
  method: 'get',
})


const SettingsController = { account }

export default SettingsController
