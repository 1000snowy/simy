import { Options } from "./Core";
import * as path from "path";

export const parseLocation = ((href: string = window.location.href) => {
  const query: {
    [key: string]: string
  } = {};
  const path = (`/${href.split("://")[1].split("/").slice(1).join("/")}`);

  if (href.split("?").length !== 1) {
    const queryStrings = href.split("?")[0].slice(1).split("&");

    for (let i = 0; i < queryStrings.length; i++) {
      query[queryStrings[i]] = queryStrings[i + 1];
      i++;
    }
  }

  return ({
    host: href.split("://")[1].split("/")[0],
    port: ((href.split(":").length == 3) ? href.split(":")[2].split("/")[0] : null),
    protocol: href.split("://")[0],
    path: ((path !== "/") ? (path.endsWith("/") ? path.split("/").slice(0, -1).join("/") : path) : "/"),
    hash: ((path.split("#").length !== 1) ? path.split("#").slice(1)[0] : null),
    query
  });
});

export const validPath = ((path: string, href: string = window.location.href): boolean => {
  const currentPath = parseLocation(href).path;
  let isValid = true;

  for (let i = 0; i < currentPath.split("/").slice(1).length; i++) {
    const pathSep = currentPath.split("/").slice(1)[i];

    if (((path.split("/").slice(1)[i] !== "") && !path.split("/").slice(1)[i]) || (!path.split("/").slice(1)[i].startsWith(":") && (pathSep !== path.split("/").slice(1)[i]))) {
      isValid = false;
      break;
    }
  }

  return isValid;
});

export const parseFile = ((data: string): string => {
  return data.slice(18, -2).replace(/\\r/g, "").replace(/\\n/g, "").replace(/\\"/g, "\"");
});