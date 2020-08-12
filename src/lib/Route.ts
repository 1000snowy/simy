import { SimyLocation } from "./Util";

export interface Route {
  path: string;
  file?: ((location: SimyLocation) => string);
  redirect?: ((location: SimyLocation, route: Route) => string);
  filter?: (() => (boolean | Promise<boolean>));
  data?: ({
    [key: string]: any;
  });
}

export let routes: Route[] = [];

export const createRoutes = ((...args: Route[]): void => {
  for (const route of args) {
    routes.push(route);
  }
});

export const getRoutes = ((): Route[] => {
  return routes;
});

export const deleteRoutes = ((...args: Route[]): void => {
  for (const route of args) {
    routes = routes.filter((aRoute) => JSON.stringify(aRoute) !== JSON.stringify(route));
  }
});