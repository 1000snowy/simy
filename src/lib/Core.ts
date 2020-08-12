import { validPath, parseLocation, parseQuery, getFullPath } from "./Util";
import { routes, Route, getRoutes } from "./Route";

if (typeof window === "undefined") {
  throw new Error("simy can usable in browsers.");
}

export let Options: ({
  render?: ((data: string, options?: {
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

export const loadPage = ((fullPath: string, route: Route, data?: { [key: string]: any }) => {
  if (!!route.file) {
    const render = (Options.render || ((data, options): string => (new Function("d", "return `" + data + "`"))(options)));

    window.history.pushState({}, document.head.title, fullPath);

    document.body.innerHTML = render(Options.pagesObject[route.file(parseLocation())], Object.assign({}, (data || route.data || {}), {
      inc: ((file: string, options?: any) => {
        return render(Options.pagesObject[file], (options || {}));
      }),
      location: parseLocation()
    }));
  } else if (!!route.redirect) {
    window.history.pushState({}, document.head.title, fullPath);

    window.location.href = route.redirect(parseLocation(), route);
  }
});

export const giveError = ((errorCode: number, errorDescription: string) => {
  const errorRoute = (Options.errorRoute || (getRoutes().find((route) => route.path === "/error") as Route));

  loadPage(errorRoute.path, errorRoute, Object.assign({}, (errorRoute.data || {}), {
    code: 404,
    description: "This page can't found."
  }));
});

export const initialize = (() => {
  window.onload = window.onpopstate = (function () {
    if (routes.some((route) => validPath(route.path))) {
      const route = routes.find((route) => validPath(route.path)) as Route;

      loadPage(getFullPath(window.location.href), route);
    } else {
      giveError(404, "This page can't found.");
    }
  });



  document.onclick = ((event) => {
    const element = (event.target as HTMLElement);

    if (element.nodeName === "A") {
      event.preventDefault();
      event.stopPropagation();

      const anchorElement = (element as HTMLAnchorElement);
      const parsedLocation = parseLocation();

      if (anchorElement.href.startsWith(`${parsedLocation.protocol}://${parsedLocation.host}`)) {
        if (routes.some((route) => validPath(route.path, anchorElement.href))) {
          const route = (routes.find((route) => validPath(route.path, anchorElement.href)) as Route);

          loadPage(getFullPath(anchorElement.href), route);
        } else {
          giveError(404, "This page can't found.");
        }
      } else {
        window.location.href = anchorElement.href;
      }
    }
  });
});