import { buildUrl, type RouteQueryOptions, type RouteDefinition, type RouteDefinitionWithParameters, type WayfinderUrl } from './../../wayfinder'

/**
 * @see PingcrmWeb.ProfileController::show
 * @see lib/pingcrm_web/controllers/profile_controller.ex:5
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
 * @see PingcrmWeb.ProfileController::update
 * @see lib/pingcrm_web/controllers/profile_controller.ex:10
 * @route /profile
*/

export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
  url: update.url(options).path,
  method: 'put',
})

update.definition = {
  methods: ["put"],
  url: '/profile',
  parameters: {}
} satisfies RouteDefinitionWithParameters<['put']>

update.url = (options?: RouteQueryOptions): WayfinderUrl => {
  return buildUrl({
    definition: update.definition,
    options
  })
}

update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
  url: update.url(options).path,
  method: 'put',
})

/**
 * @see PingcrmWeb.ProfileController::update_password
 * @see lib/pingcrm_web/controllers/profile_controller.ex:25
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


const ProfileController = { myProfile, update, updatePassword }

export default ProfileController
