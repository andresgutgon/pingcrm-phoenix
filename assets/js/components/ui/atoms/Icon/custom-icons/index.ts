export const CUSTOM_ICON_IMPORTS = {
  google: () => import('./logos/Google'),
}

export type CustomIconName = keyof typeof CUSTOM_ICON_IMPORTS
