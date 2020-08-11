import { validPath } from "./Util";
import { routes, Route, getRoutes } from "./Route";

if (typeof window === "undefined") {
  throw new Error("simy can usable in browsers.");
}

export let Options: ({
  render?: ((data: string, options: {
    [key: string]: any
  }) => string),
  pagesObject: ({
    [key: string]: string
  });
  errorRoute?: Route;
});

export const setOptions = ((options: typeof Options): void => {
  if (!options.pagesObject) {
    throw new Error("options parameter must be include pagesObject.");
  }

  Options = options;
});

export const initialize = (() => {
  window.onload = window.onpopstate = (function () {
    const render = (Options.render || ((data, options) => (new Function("d", "return `" + data + "`"))(options)));

    if (routes.some((route) => validPath(route.path))) {
      const route = routes.find((route) => validPath(route.path)) as Route;

      document.body.innerHTML = render(Options.pagesObject[route.file], (route.data || {}));
    } else {
      const errorRoute = (Options.errorRoute || (getRoutes().find((route) => route.path === "/error") as Route));

      document.body.innerHTML = (render(
        Options.pagesObject[errorRoute.file],
        Object.assign({}, (errorRoute.data || {}), {
          code: 404,
          description: "This page can't found."
        })
      ));
    }
  });
});