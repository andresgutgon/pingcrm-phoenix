import { buildUrl, type RouteQueryOptions, type RouteDefinition, type RouteDefinitionWithParameters, type WayfinderUrl } from './../../../wayfinder'

/**
 * @see PingcrmWeb.Profile.ProfileController::show
 * @see lib/pingcrm_web/controllers/profile/profile_controller.ex:10
 * @route /profile
*/

export const myProfile = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
  url: myProfile.url(options).path,
  method: 'get',
})

myProfile.definition = {
  methods: ["get"],
  url: '/profile',
  parameters: {}
} satisfies RouteDefinitionWithParameters<['get']>

myProfile.url = (options?: RouteQueryOptions): WayfinderUrl => {
  return buildUrl({
    definition: myProfile.definition,
    options
  })
}

myProfile.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
  url: myProfile.url(options).path,
  method: 'get',
})

/**
 * @see PingcrmWeb.Profile.ProfileController::update
 * @see lib/pingcrm_web/controllers/profile/profile_controller.ex:15
 * @route /profile
*/

export const updateProfile = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
  url: updateProfile.url(options).path,
  method: 'patch',
})

updateProfile.definition = {
  methods: ["patch"],
  url: '/profile',
  parameters: {}
} satisfies RouteDefinitionWithParameters<['patch']>

updateProfile.url = (options?: RouteQueryOptions): WayfinderUrl => {
  return buildUrl({
    definition: updateProfile.definition,
    options
  })
}

updateProfile.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
  url: updateProfile.url(options).path,
  method: 'patch',
})

/**
 * @see PingcrmWeb.Profile.ProfileController::change_account
 * @see lib/pingcrm_web/controllers/profile/profile_controller.ex:61
 * @route /profile/change_account/:id
*/

export const changeAccount = (args: { id: string | number } | [string | number] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
  url: changeAccount.url(args, options).path,
  method: 'post',
})

changeAccount.definition = {
  methods: ["post"],
  url: '/profile/change_account/:id',
  parameters: { id: { name: "id", optional: false, required: true, glob: false } }
} satisfies RouteDefinitionWithParameters<['post']>

changeAccount.url = (args: { id: string | number } | [string | number] | string | number,  options?: RouteQueryOptions): WayfinderUrl => {
  return buildUrl({
    definition: changeAccount.definition,
    args,
    options
  })
}

changeAccount.post = (args: { id: string | number } | [string | number] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
  url: changeAccount.url(args, options).path,
  method: 'post',
})

/**
 * @see PingcrmWeb.Profile.ProfileController::set_default_account
 * @see lib/pingcrm_web/controllers/profile/profile_controller.ex:79
 * @route /profile/set_default_account/:account_id
*/

export const setDefaultAccount = (args: { account_id: string | number } | [string | number] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
  url: setDefaultAccount.url(args, options).path,
  method: 'patch',
})

setDefaultAccount.definition = {
  methods: ["patch"],
  url: '/profile/set_default_account/:account_id',
  parameters: { account_id: { name: "account_id", optional: false, required: true, glob: false } }
} satisfies RouteDefinitionWithParameters<['patch']>

setDefaultAccount.url = (args: { account_id: string | number } | [string | number] | string | number,  options?: RouteQueryOptions): WayfinderUrl => {
  return buildUrl({
    definition: setDefaultAccount.definition,
    args,
    options
  })
}

setDefaultAccount.patch = (args: { account_id: string | number } | [string | number] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
  url: setDefaultAccount.url(args, options).path,
  method: 'patch',
})

/**
 * @see PingcrmWeb.Profile.ProfileController::update_email
 * @see lib/pingcrm_web/controllers/profile/profile_controller.ex:29
 * @route /profile/email
*/

export const updateEmail = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
  url: updateEmail.url(options).path,
  method: 'patch',
})

updateEmail.definition = {
  methods: ["patch"],
  url: '/profile/email',
  parameters: {}
} satisfies RouteDefinitionWithParameters<['patch']>

updateEmail.url = (options?: RouteQueryOptions): WayfinderUrl => {
  return buildUrl({
    definition: updateEmail.definition,
    options
  })
}

updateEmail.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
  url: updateEmail.url(options).path,
  method: 'patch',
})

/**
 * @see PingcrmWeb.Profile.ProfileController::update_password
 * @see lib/pingcrm_web/controllers/profile/profile_controller.ex:47
 * @route /profile/password
*/

export const updatePassword = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
  url: updatePassword.url(options).path,
  method: 'patch',
})

updatePassword.definition = {
  methods: ["patch"],
  url: '/profile/password',
  parameters: {}
} satisfies RouteDefinitionWithParameters<['patch']>

updatePassword.url = (options?: RouteQueryOptions): WayfinderUrl => {
  return buildUrl({
    definition: updatePassword.definition,
    options
  })
}

updatePassword.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
  url: updatePassword.url(options).path,
  method: 'patch',
})


const ProfileController = { myProfile, updateProfile, changeAccount, setDefaultAccount, updateEmail, updatePassword }

export default ProfileController
