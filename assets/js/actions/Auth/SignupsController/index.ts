import { buildUrl, type RouteQueryOptions, type RouteDefinition, type RouteDefinitionWithParameters, type WayfinderUrl } from './../../../wayfinder'

/**
 * @see PingcrmWeb.Auth.SignupsController::create
 * @route /signup
*/

export const signupCreate = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
  url: signupCreate.url(options).path,
  method: 'post',
})

signupCreate.definition = {
  methods: ["post"],
  url: '/signup',
  parameters: {}
} satisfies RouteDefinitionWithParameters<['post']>

signupCreate.url = (options?: RouteQueryOptions): WayfinderUrl => {
  return buildUrl({
    definition: signupCreate.definition,
    options
  })
}

signupCreate.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
  url: signupCreate.url(options).path,
  method: 'post',
})

/**
 * @see PingcrmWeb.Auth.SignupsController::new
 * @route /signup
*/

export const signup = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
  url: signup.url(options).path,
  method: 'get',
})

signup.definition = {
  methods: ["get"],
  url: '/signup',
  parameters: {}
} satisfies RouteDefinitionWithParameters<['get']>

signup.url = (options?: RouteQueryOptions): WayfinderUrl => {
  return buildUrl({
    definition: signup.definition,
    options
  })
}

signup.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
  url: signup.url(options).path,
  method: 'get',
})


const SignupsController = { signupCreate, signup }

export default SignupsController
