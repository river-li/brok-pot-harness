/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../dune/src/internal/deep-links/declaration.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var ROUTE_PATH = /^\/v(0|[1-9]\d*)(?:\/[a-z0-9-]+)+$/;
var PARAM_NAME = /^[a-z][a-zA-Z0-9]*$/;
var RESERVED_PARAM_NAMES = /* @__PURE__ */ new Set(["version", "route", "source"]);
var ROUTE_NAME = /^[a-z][a-z0-9-]*$/;
var AUTHORITY_NAME = /^[a-z][a-z0-9-]*$/;
var SCHEME_NAME = /^[a-z][a-z0-9+.-]*$/;
var SPECIAL_SCHEMES = /* @__PURE__ */ new Set(["file", "ftp", "http", "https", "ws", "wss"]);
var completedRouteDeclarations = /* @__PURE__ */ new WeakSet();
function deepLinkRoute(path31, params) {
  const versionMatch = ROUTE_PATH.exec(path31);
  if (versionMatch?.[1] === void 0) {
    throw new DeepLinkDeclarationError(
      `route path "${path31}" must be /v<version>/<segment> with lowercase kebab segments`
    );
  }
  const version3 = Number.parseInt(versionMatch[1], 10);
  for (const [name17, validator2] of Object.entries(params)) {
    if (!PARAM_NAME.test(name17) || RESERVED_PARAM_NAMES.has(name17)) {
      throw new DeepLinkDeclarationError(
        `route path "${path31}" has an invalid param name "${name17}"`
      );
    }
    if (typeof validator2?.check !== "function" || typeof validator2.expects !== "string") {
      throw new DeepLinkDeclarationError(`route path "${path31}" param "${name17}" is not a validator`);
    }
  }
  const frozenParams = Object.freeze({ ...params });
  const route = Object.freeze({
    path: path31,
    version: version3,
    params: frozenParams
  });
  completedRouteDeclarations.add(route);
  return route;
}
function declareDeepLinkSurface(options2) {
  if (!AUTHORITY_NAME.test(options2.authority)) {
    throw new DeepLinkDeclarationError(
      `authority "${options2.authority}" must be a lowercase token`
    );
  }
  const canonicalScheme = options2.schemes[0];
  if (canonicalScheme === void 0) {
    throw new DeepLinkDeclarationError("schemes must name at least one scheme");
  }
  if (new Set(options2.schemes).size !== options2.schemes.length) {
    throw new DeepLinkDeclarationError("schemes must be distinct");
  }
  for (const scheme of options2.schemes) {
    if (!SCHEME_NAME.test(scheme)) {
      throw new DeepLinkDeclarationError(`scheme "${scheme}" must be a lowercase URI scheme token`);
    }
    if (SPECIAL_SCHEMES.has(scheme)) {
      throw new DeepLinkDeclarationError(`scheme "${scheme}" is a reserved web scheme`);
    }
  }
  if (!Number.isSafeInteger(options2.maxUrlLength) || options2.maxUrlLength < 1) {
    throw new DeepLinkDeclarationError("maxUrlLength must be a positive integer");
  }
  const routesByName = /* @__PURE__ */ new Map();
  const routesByPath = /* @__PURE__ */ new Map();
  for (const [name17, declaration] of Object.entries(options2.routes)) {
    if (!ROUTE_NAME.test(name17)) {
      throw new DeepLinkDeclarationError(`route name "${name17}" must be a lowercase kebab token`);
    }
    if (!completedRouteDeclarations.has(declaration)) {
      throw new DeepLinkDeclarationError(`route "${name17}" must come from deepLinkRoute(...)`);
    }
    if (routesByPath.has(declaration.path)) {
      throw new DeepLinkDeclarationError(`route path "${declaration.path}" is declared twice`);
    }
    const route = { name: name17, declaration };
    routesByName.set(name17, route);
    routesByPath.set(declaration.path, route);
  }
  const grammar = {
    authority: options2.authority,
    canonicalScheme,
    schemeProtocols: new Set(options2.schemes.map((scheme) => `${scheme}:`)),
    maxUrlLength: options2.maxUrlLength,
    routesByName,
    routesByPath
  };
  return Object.freeze({
    authority: options2.authority,
    schemes: Object.freeze([...options2.schemes]),
    maxUrlLength: options2.maxUrlLength,
    routes: Object.freeze({ ...options2.routes }),
    parse: (raw) => {
      const result = parseDeepLink(grammar, raw);
      return result.ok ? result.parsed : null;
    },
    parseDetailed: (raw) => parseDeepLink(grammar, raw),
    buildUrl: (routeName, ...args) => buildDeepLinkUrl(grammar, routeName, args[0]),
    isDeepLink: (value) => isDeepLinkValue(grammar, value)
  });
}

