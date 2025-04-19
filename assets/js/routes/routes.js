const Routes = (function() {
  const routes = [{"name":"index","path":"/","controller":"PingcrmWeb.HomeController","params":[],"action":"index","method":"GET"},{"name":"nominations.show","path":"/nominations/:id","controller":"PingcrmWeb.HomeController","params":["id"],"action":"show","method":"GET"},{"name":"dev.dashboard.css-:md5.css","path":"/dev/dashboard/css-:md5","controller":"Phoenix.LiveDashboard.Assets","params":["md5"],"action":"css","method":"GET"},{"name":"dev.dashboard.js-:md5.js","path":"/dev/dashboard/js-:md5","controller":"Phoenix.LiveDashboard.Assets","params":["md5"],"action":"js","method":"GET"},{"name":"dev.dashboard.home","path":"/dev/dashboard","controller":"Phoenix.LiveView.Plug","params":[],"action":"home","method":"GET"},{"name":"dev.dashboard.page","path":"/dev/dashboard/:page","controller":"Phoenix.LiveView.Plug","params":["page"],"action":"page","method":"GET"},{"name":"dev.dashboard.page","path":"/dev/dashboard/:node/:page","controller":"Phoenix.LiveView.Plug","params":["node","page"],"action":"page","method":"GET"},{"name":"dev.mailbox","path":"/dev/mailbox","controller":"Plug.Swoosh.MailboxPreview","params":[],"action":[],"method":"*"}];

  function replaceParams(path, params = {}) {
    let result = path;
    const routeParams = {...params};
    delete routeParams._query;

    // Keep track of used route parameters
    const usedParams = new Set();

    Object.keys(routeParams).forEach(key => {
      if (result.includes(`:${key}`)) {
        result = result.replace(`:${key}`, String(routeParams[key]));
        usedParams.add(key);
      }
    });

    const queryParams = {...params};
    const explicitQueryParams = queryParams._query || {};
    delete queryParams._query;

    // Remove used route parameters from query params
    usedParams.forEach(key => delete queryParams[key]);

    const allQueryParams = {...queryParams, ...explicitQueryParams};
    const queryString = Object.keys(allQueryParams).length
      ? '?' + new URLSearchParams(Object.fromEntries(
          Object.entries(allQueryParams).filter(([_, v]) => v != null)
        )).toString()
      : '';

    return result + queryString;
  }

  function route(name, params = {}) {
    const route = routes.find(r => r.name === name);
    if (!route) throw new Error(`Route '${name}' not found`);

    return replaceParams(route.path, params);
  }

  function path(name, params = {}) {
    return route(name, params);
  }

  function method(name) {
    const route = routes.find(r => r.name === name);
    if (!route) throw new Error(`Route '${name}' not found`);
    return route.method;
  }

  function hasRoute(name) {
    return routes.some(r => r.name === name);
  }

  return {
    routes,
    route,
    path,
    method,
    hasRoute,
    replaceParams
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Routes;
} else if (typeof window !== 'undefined' && window) {
  window.Routes = Routes;
}

export default Routes;
