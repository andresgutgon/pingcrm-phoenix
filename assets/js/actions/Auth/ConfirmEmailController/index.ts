import { buildUrl, type RouteQueryOptions, type RouteDefinition, type RouteDefinitionWithParameters, type WayfinderUrl } from './../../../wayfinder'

/**
 * @see PingcrmWeb.Auth.ConfirmEmailController::edit
 * @route /confirm-email/:token
*/

export const edit = (args: { token: string | number } | [string | number] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
  url: edit.url(args, options).path,
  method: 'get',
})

edit.definition = {
  methods: ["get"],
  url: '/confirm-email/:token',
  parameters: { token: { name: "token", optional: false, required: true, glob: false } }
} satisfies RouteDefinitionWithParameters<['get']>

edit.url = (args: { token: string | number } | [string | number] | string | number,  options?: RouteQueryOptions): WayfinderUrl => {
  return buildUrl({
    definition: edit.definition,
    args,
    options
  })
}

edit.get = (args: { token: string | number } | [string | number] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
  url: edit.url(args, options).path,
  method: 'get',
})

/**
 * @see PingcrmWeb.Auth.ConfirmEmailController::update
 * @route /confirm-email/:token
*/

export const confirmEmailChange = (args: { token: string | number } | [string | number] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
  url: confirmEmailChange.url(args, options).path,
  method: 'patch',
})

confirmEmailChange.definition = {
  methods: ["patch"],
  url: '/confirm-email/:token',
  parameters: { token: { name: "token", optional: false, required: true, glob: false } }
} satisfies RouteDefinitionWithParameters<['patch']>

confirmEmailChange.url = (args: { token: string | number } | [string | number] | string | number,  options?: RouteQueryOptions): WayfinderUrl => {
  return buildUrl({
    definition: confirmEmailChange.definition,
    args,
    options
  })
}

confirmEmailChange.patch = (args: { token: string | number } | [string | number] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
  url: confirmEmailChange.url(args, options).path,
  method: 'patch',
})


const ConfirmEmailController = { edit, confirmEmailChange }

export default ConfirmEmailController
