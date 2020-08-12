export interface SimyLocation {
  host: string;
  port: (number | null);
  protocol: ("http" | "https"),
  path: string;
  hash: (string | null);
  query: ({
    [key: string]: string
  });
}

export const parseLocation = ((href: string = window.location.href): SimyLocation => {
  const query: {
    [key: string]: string
  } = {};
  const path = (`/${href.split("://")[1].split("/").slice(1).join("/").split("?")[0]}`);

  if (href.split("?").length !== 1) {
    const queryStrings = href.split("?")[1].split("&");

    for (const queryString of queryStrings) {
      query[queryString.split("=")[0]] = queryString.split("=")[1];
    }
  }

  return ({
    host: href.split("://")[1].split("/")[0],
    port: ((href.split(":").length == 3) ? Number(href.split(":")[2].split("/")[0]) : null),
    protocol: href.split("://")[0] as ("http" | "https"),
    path: ((path !== "/") ? (path.endsWith("/") ? path.split("/").slice(0, -1).join("/") : path) : "/"),
    hash: ((path.split("#").length !== 1) ? path.split("#").slice(1)[0] : null),
    query
  });
});

export const validPath = ((path: string, href: string = window.location.href): boolean => {
  const currentPath = parseLocation(href).path;
  let isValid = false;

  for (let i = 0; i < path.split("/").length; i++) {
    const pathSep = path.split("/")[i];
    const currentPathSep = currentPath.split("/")[i];

    if ((pathSep.startsWith(":") && !!currentPathSep) || (!pathSep.startsWith(":") && (currentPathSep === pathSep))) {
      isValid = true;
    } else {
      isValid = false;
      break;
    }
  }

  return (isValid && (path.split("/").length === currentPath.split("/").length));
});

export const parseQuery = ((query: {
  [key: string]: string
}) => {
  const queryArray = [];

  for (const [key, value] of Object.entries(query)) {
    queryArray.push(`${key}=${value}`);
  }

  return (`?${queryArray.join("&")}`);
});

export const parsePathParams = ((path: string, currentPath: string = parseLocation().path) => {
  const paramsArray: {
    [key: string]: string
  } = {};

  for (let i = 0; i < path.split("/").length; i++) {
    const pathSep = path.split("/")[i];
    const currentPathSep = currentPath.split("/")[i];

    if (pathSep.startsWith(":")) {
      paramsArray[pathSep.slice(1)] = currentPathSep;
    }
  }

  return paramsArray;
});

export const getFullPath = ((href: string) => {
  const parsedElement = parseLocation(href);

  return (parsedElement.path + ((Object.keys(parsedElement.query).length !== 0) ? parseQuery(parsedElement.query) : "") + (parsedElement.hash ? ("#" + parsedElement.hash) : ""));
});

export const parseFile = ((data: string): string => {
  return data.slice(18, -2).replace(/\\r/g, "").replace(/\\n/g, "").replace(/\\"/g, "\"");
});