import { buildUrl, type RouteQueryOptions, type RouteDefinition, type RouteDefinitionWithParameters, type WayfinderUrl } from './../../../wayfinder'

/**
 * @see PingcrmWeb.Account.BillingController::show
 * @route /account/billing
*/

export const billingPage = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
  url: billingPage.url(options).path,
  method: 'get',
})

billingPage.definition = {
  methods: ["get"],
  url: '/account/billing',
  parameters: {}
} satisfies RouteDefinitionWithParameters<['get']>

billingPage.url = (options?: RouteQueryOptions): WayfinderUrl => {
  return buildUrl({
    definition: billingPage.definition,
    options
  })
}

billingPage.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
  url: billingPage.url(options).path,
  method: 'get',
})


const BillingController = { billingPage }

export default BillingController
