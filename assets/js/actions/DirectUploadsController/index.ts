import { buildUrl, type RouteQueryOptions, type RouteDefinition, type RouteDefinitionWithParameters, type WayfinderUrl } from './../../wayfinder'

/**
 * @see PingcrmWeb.DirectUploadsController::sign
 * @see lib/pingcrm_web/controllers/direct_uploads_controller.ex:11
 * @route /direct_uploads/:uploader/:entity_id/sign
*/

export const sign = (args: { uploader: string | number, entity_id: string | number } | [string | number, string | number], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
  url: sign.url(args, options).path,
  method: 'post',
})

sign.definition = {
  methods: ["post"],
  url: '/direct_uploads/:uploader/:entity_id/sign',
  parameters: { uploader: { name: "uploader", optional: false, required: true, glob: false }, entity_id: { name: "entity_id", optional: false, required: true, glob: false } }
} satisfies RouteDefinitionWithParameters<['post']>

sign.url = (args: { uploader: string | number, entity_id: string | number } | [string | number, string | number],  options?: RouteQueryOptions): WayfinderUrl => {
  return buildUrl({
    definition: sign.definition,
    args,
    options
  })
}

sign.post = (args: { uploader: string | number, entity_id: string | number } | [string | number, string | number], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
  url: sign.url(args, options).path,
  method: 'post',
})

/**
 * @see PingcrmWeb.DirectUploadsController::store
 * @see lib/pingcrm_web/controllers/direct_uploads_controller.ex:36
 * @route /direct_uploads/:uploader/:entity_id/store
*/

export const store = (args: { uploader: string | number, entity_id: string | number } | [string | number, string | number], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
  url: store.url(args, options).path,
  method: 'post',
})

store.definition = {
  methods: ["post"],
  url: '/direct_uploads/:uploader/:entity_id/store',
  parameters: { uploader: { name: "uploader", optional: false, required: true, glob: false }, entity_id: { name: "entity_id", optional: false, required: true, glob: false } }
} satisfies RouteDefinitionWithParameters<['post']>

store.url = (args: { uploader: string | number, entity_id: string | number } | [string | number, string | number],  options?: RouteQueryOptions): WayfinderUrl => {
  return buildUrl({
    definition: store.definition,
    args,
    options
  })
}

store.post = (args: { uploader: string | number, entity_id: string | number } | [string | number, string | number], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
  url: store.url(args, options).path,
  method: 'post',
})


const DirectUploadsController = { sign, store }

export default DirectUploadsController
