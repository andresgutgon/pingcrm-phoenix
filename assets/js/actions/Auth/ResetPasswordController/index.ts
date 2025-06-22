import { buildUrl, type RouteQueryOptions, type RouteDefinition, type RouteDefinitionWithParameters, type WayfinderUrl } from './../../../wayfinder'

/**
 * @see PingcrmWeb.Auth.ResetPasswordController::create
 * @see lib/pingcrm_web/controllers/auth/reset_password_controler.ex:13
 * @route /reset_password
*/

export const sendResetPasswordInstructions = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
  url: sendResetPasswordInstructions.url(options).path,
  method: 'post',
})

sendResetPasswordInstructions.definition = {
  methods: ["post"],
  url: '/reset_password',
  parameters: {}
} satisfies RouteDefinitionWithParameters<['post']>

sendResetPasswordInstructions.url = (options?: RouteQueryOptions): WayfinderUrl => {
  return buildUrl({
    definition: sendResetPasswordInstructions.definition,
    options
  })
}

sendResetPasswordInstructions.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
  url: sendResetPasswordInstructions.url(options).path,
  method: 'post',
})

/**
 * @see PingcrmWeb.Auth.ResetPasswordController::edit
 * @see lib/pingcrm_web/controllers/auth/reset_password_controler.ex:29
 * @route /reset_password/:token
*/

export const edit = (args: { token: string | number } | [string | number] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
  url: edit.url(args, options).path,
  method: 'get',
})

edit.definition = {
  methods: ["get"],
  url: '/reset_password/:token',
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
 * @see PingcrmWeb.Auth.ResetPasswordController::new
 * @see lib/pingcrm_web/controllers/auth/reset_password_controler.ex:9
 * @route /reset_password
*/

export const forgotPassword = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
  url: forgotPassword.url(options).path,
  method: 'get',
})

forgotPassword.definition = {
  methods: ["get"],
  url: '/reset_password',
  parameters: {}
} satisfies RouteDefinitionWithParameters<['get']>

forgotPassword.url = (options?: RouteQueryOptions): WayfinderUrl => {
  return buildUrl({
    definition: forgotPassword.definition,
    options
  })
}

forgotPassword.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
  url: forgotPassword.url(options).path,
  method: 'get',
})

/**
 * @see PingcrmWeb.Auth.ResetPasswordController::update
 * @see lib/pingcrm_web/controllers/auth/reset_password_controler.ex:37
 * @route /reset_password/:token
*/

export const update = (args: { token: string | number } | [string | number] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
  url: update.url(args, options).path,
  method: 'put',
})

update.definition = {
  methods: ["put"],
  url: '/reset_password/:token',
  parameters: { token: { name: "token", optional: false, required: true, glob: false } }
} satisfies RouteDefinitionWithParameters<['put']>

update.url = (args: { token: string | number } | [string | number] | string | number,  options?: RouteQueryOptions): WayfinderUrl => {
  return buildUrl({
    definition: update.definition,
    args,
    options
  })
}

update.put = (args: { token: string | number } | [string | number] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
  url: update.url(args, options).path,
  method: 'put',
})


const ResetPasswordController = { sendResetPasswordInstructions, edit, forgotPassword, update }

export default ResetPasswordController
