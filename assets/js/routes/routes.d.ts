interface Route {
  readonly name: string;
  readonly action: string;
  readonly path: string;
  readonly method: string;
  readonly controller: string;
  readonly params: readonly string[];
}

type HTTPMethod = GET | *;

type QueryParam = string | number | boolean | null | undefined;
type QueryParams = Record<string, QueryParam | QueryParam[]>;

type RouteParams = {
  "index": Record<string, never>;
  "dev.dashboard.css-:md5.css": {md5: string | number};
  "dev.dashboard.js-:md5.js": {md5: string | number};
  "dev.dashboard.home": Record<string, never>;
  "dev.dashboard.page": {page: string | number};
  "dev.dashboard.page": {node: string | number; page: string | number};
  "dev.mailbox": Record<string, never>
}

type RouteName = "index" | "dev.dashboard.css-:md5.css" | "dev.dashboard.js-:md5.js" | "dev.dashboard.home" | "dev.dashboard.page" | "dev.dashboard.page" | "dev.mailbox";

type RouteParamsWithQuery<T extends Record<string, any>> = T & {
  _query?: QueryParams;
}

type RoutePathConfig = {
  "/": Record<string, never>;
      "/dev/dashboard": Record<string, never>;
      "/dev/dashboard/:node/:page": {node: string | number; page: string | number};
      "/dev/dashboard/:page": {page: string | number};
      "/dev/dashboard/css-:md5": {md5: string | number};
      "/dev/dashboard/js-:md5": {md5: string | number};
      "/dev/mailbox": Record<string, never>
}

type RoutePath = keyof RoutePathConfig;

type PathParamsWithQuery<T extends RoutePath> = RoutePathConfig[T] & {
  _query?: QueryParams;
}

declare const Routes: {
  readonly routes: readonly Route[];

  route<T extends RouteName>(
    name: T,
    params?: RouteParamsWithQuery<RouteParams[T]>
  ): string;

  path<T extends RouteName>(
    name: T,
    params?: RouteParamsWithQuery<RouteParams[T]>
  ): string;

  replaceParams<T extends RoutePath>(
    path: T,
    params?: PathParamsWithQuery<T>
  ): string;

  method(name: RouteName): HTTPMethod;

  hasRoute(name: string): name is RouteName;
};

export as namespace Routes;
export { RoutePath, PathParamsWithQuery };
export = Routes;
