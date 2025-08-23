import { buildUrl, type RouteQueryOptions, type RouteDefinition, type RouteDefinitionWithParameters, type WayfinderUrl } from './../../wayfinder'

/**
 * @see PingcrmWeb.DirectUploadsController::sign
 * @see lib/pingcrm_web/controllers/direct_uploads_controller.ex:5
 * @route /direct_uploads/:uploader/sign
*/

export const sign = (args: { uploader: string | number } | [string | number] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
  url: sign.url(args, options).path,
  method: 'post',
})

sign.definition = {
  methods: ["post"],
  url: '/direct_uploads/:uploader/sign',
  parameters: { uploader: { name: "uploader", optional: false, required: true, glob: false } }
} satisfies RouteDefinitionWithParameters<['post']>

sign.url = (args: { uploader: string | number } | [string | number] | string | number,  options?: RouteQueryOptions): WayfinderUrl => {
  return buildUrl({
    definition: sign.definition,
    args,
    options
  })
}

sign.post = (args: { uploader: string | number } | [string | number] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
  url: sign.url(args, options).path,
  method: 'post',
})


const DirectUploadsController = { sign }

export default DirectUploadsController
