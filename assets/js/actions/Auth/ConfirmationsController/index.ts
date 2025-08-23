import { buildUrl, type RouteQueryOptions, type RouteDefinition, type RouteDefinitionWithParameters, type WayfinderUrl } from './../../../wayfinder'

/**
 * @see PingcrmWeb.Auth.ConfirmationsController::confirm_user
 * @see lib/pingcrm_web/controllers/auth/confirmations_controller.ex:42
 * @route /confirm/:token
*/

export const confirmUser = (args: { token: string | number } | [string | number] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
  url: confirmUser.url(args, options).path,
  method: 'post',
})

confirmUser.definition = {
  methods: ["post"],
  url: '/confirm/:token',
  parameters: { token: { name: "token", optional: false, required: true, glob: false } }
} satisfies RouteDefinitionWithParameters<['post']>

confirmUser.url = (args: { token: string | number } | [string | number] | string | number,  options?: RouteQueryOptions): WayfinderUrl => {
  return buildUrl({
    definition: confirmUser.definition,
    args,
    options
  })
}

confirmUser.post = (args: { token: string | number } | [string | number] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
  url: confirmUser.url(args, options).path,
  method: 'post',
})

/**
 * @see PingcrmWeb.Auth.ConfirmationsController::confirmation_sent
 * @see lib/pingcrm_web/controllers/auth/confirmations_controller.ex:7
 * @route /confirmation-sent
*/

export const confirmationSent = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
  url: confirmationSent.url(options).path,
  method: 'get',
})

confirmationSent.definition = {
  methods: ["get"],
  url: '/confirmation-sent',
  parameters: {}
} satisfies RouteDefinitionWithParameters<['get']>

confirmationSent.url = (options?: RouteQueryOptions): WayfinderUrl => {
  return buildUrl({
    definition: confirmationSent.definition,
    options
  })
}

confirmationSent.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
  url: confirmationSent.url(options).path,
  method: 'get',
})

/**
 * @see PingcrmWeb.Auth.ConfirmationsController::create
 * @see lib/pingcrm_web/controllers/auth/confirmations_controller.ex:19
 * @route /confirm
*/

export const resendConfirmation = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
  url: resendConfirmation.url(options).path,
  method: 'post',
})

resendConfirmation.definition = {
  methods: ["post"],
  url: '/confirm',
  parameters: {}
} satisfies RouteDefinitionWithParameters<['post']>

resendConfirmation.url = (options?: RouteQueryOptions): WayfinderUrl => {
  return buildUrl({
    definition: resendConfirmation.definition,
    options
  })
}

resendConfirmation.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
  url: resendConfirmation.url(options).path,
  method: 'post',
})

/**
 * @see PingcrmWeb.Auth.ConfirmationsController::edit
 * @see lib/pingcrm_web/controllers/auth/confirmations_controller.ex:36
 * @route /confirm/:token
*/

export const edit = (args: { token: string | number } | [string | number] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
  url: edit.url(args, options).path,
  method: 'get',
})

edit.definition = {
  methods: ["get"],
  url: '/confirm/:token',
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
 * @see PingcrmWeb.Auth.ConfirmationsController::new
 * @see lib/pingcrm_web/controllers/auth/confirmations_controller.ex:15
 * @route /confirm
*/

export const newMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
  url: newMethod.url(options).path,
  method: 'get',
})

newMethod.definition = {
  methods: ["get"],
  url: '/confirm',
  parameters: {}
} satisfies RouteDefinitionWithParameters<['get']>

newMethod.url = (options?: RouteQueryOptions): WayfinderUrl => {
  return buildUrl({
    definition: newMethod.definition,
    options
  })
}

newMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
  url: newMethod.url(options).path,
  method: 'get',
})


const ConfirmationsController = { confirmUser, confirmationSent, resendConfirmation, edit, new: newMethod }

export default ConfirmationsController
