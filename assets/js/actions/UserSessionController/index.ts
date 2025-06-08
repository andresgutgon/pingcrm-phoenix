import { queryParams, isCurrentUrl, type RouteQueryOptions, type RouteDefinition, type WayfinderUrl } from './../../wayfinder'

/**
 * @see PingcrmWeb.UserSessionController::create
 * @see lib/pingcrm_web/controllers/user_session_controller.ex:13
 * @route /login
*/

export const create = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
  url: create.url(options).path,
  method: 'post',
})

create.definition = {
  methods: ["post"],
  url: '/login'
} satisfies RouteDefinition<['post']>
create.url = (options?: RouteQueryOptions): WayfinderUrl => {
  let routePath = create.definition.url

  
  routePath = create.definition.url
  routePath = routePath.replace(/\/+$/, '') || '/'
    const path = routePath + queryParams(options);

  return {
    path,
    isCurrent: isCurrentUrl({
      routePath,
      currentPath: options?.currentPath,
      matchExact: options?.matchExact
    })
  }

}
create.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
  url: create.url(options).path,
  method: 'post',
})

/**
 * @see PingcrmWeb.UserSessionController::delete
 * @see lib/pingcrm_web/controllers/user_session_controller.ex:26
 * @route /logout
*/

export const deleteMethod = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
  url: deleteMethod.url(options).path,
  method: 'delete',
})

deleteMethod.definition = {
  methods: ["delete"],
  url: '/logout'
} satisfies RouteDefinition<['delete']>
deleteMethod.url = (options?: RouteQueryOptions): WayfinderUrl => {
  let routePath = deleteMethod.definition.url

  
  routePath = deleteMethod.definition.url
  routePath = routePath.replace(/\/+$/, '') || '/'
    const path = routePath + queryParams(options);

  return {
    path,
    isCurrent: isCurrentUrl({
      routePath,
      currentPath: options?.currentPath,
      matchExact: options?.matchExact
    })
  }

}
deleteMethod.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
  url: deleteMethod.url(options).path,
  method: 'delete',
})

/**
 * @see PingcrmWeb.UserSessionController::new
 * @see lib/pingcrm_web/controllers/user_session_controller.ex:7
 * @route /login
*/

export const login = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
  url: login.url(options).path,
  method: 'get',
})

login.definition = {
  methods: ["get"],
  url: '/login'
} satisfies RouteDefinition<['get']>
login.url = (options?: RouteQueryOptions): WayfinderUrl => {
  let routePath = login.definition.url

  
  routePath = login.definition.url
  routePath = routePath.replace(/\/+$/, '') || '/'
    const path = routePath + queryParams(options);

  return {
    path,
    isCurrent: isCurrentUrl({
      routePath,
      currentPath: options?.currentPath,
      matchExact: options?.matchExact
    })
  }

}
login.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
  url: login.url(options).path,
  method: 'get',
})


const UserSessionController = { create, delete: deleteMethod, login }

export default UserSessionController
