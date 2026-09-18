var MALFORMED_PERCENT = /%(?![0-9A-Fa-f]{2})/;
var DOT_SEGMENT = /\/\.{1,2}(?:\/|$)/;
function classifyParamValue(validator2, value) {
  if (typeof value !== "string") return "not-a-string";
  if (value.length === 0) return "empty";
  if (hasDeepLinkControlCharacters(value)) return "control";
  return validator2.check(value, []).ok ? "ok" : "invalid";
}
function parseDeepLink(grammar, raw) {
  if (typeof raw !== "string") return rejected("not-a-string");
  if (raw.length === 0) return rejected("empty");
  if (raw.length > grammar.maxUrlLength) return rejected("over-length");
  if (!isPrintableAscii(raw)) return rejected("non-printable");
  if (raw.includes("#")) return rejected("fragment");
  if (raw.includes("\\")) return rejected("backslash");
  if (MALFORMED_PERCENT.test(raw)) return rejected("percent-encoding");
  const queryStart = raw.indexOf("?");
  const beforeQuery = queryStart === -1 ? raw : raw.slice(0, queryStart);
  if (beforeQuery.includes("%")) return rejected("path-encoding");
  if (DOT_SEGMENT.test(beforeQuery)) return rejected("dot-segment");
  const lower = raw.toLowerCase();
  if (!startsWithDeclaredScheme(grammar, lower)) return rejected("scheme");
  let url2;
  try {
    url2 = new URL(raw);
  } catch {
    return rejected("unparseable");
  }
  if (url2.username !== "" || url2.password !== "") return rejected("userinfo");
  if (url2.port !== "") return rejected("port");
  if (url2.host !== grammar.authority) return rejected("authority");
  const route = grammar.routesByPath.get(url2.pathname);
  if (route === void 0) return rejected("path");
  const declaration = route.declaration;
  const seen = /* @__PURE__ */ new Map();
  for (const [key, value] of url2.searchParams) {
    if (!Object.hasOwn(declaration.params, key)) return rejected("query-key");
    const validator2 = declaration.params[key];
    if (validator2 === void 0) return rejected("query-key");
    if (seen.has(key)) return rejected("query-duplicate");
    const verdict = classifyParamValue(validator2, value);
    if (verdict === "empty" || verdict === "control") return rejected("query-value");
    if (verdict !== "ok") return rejected("param-invalid");
    seen.set(key, value);
  }
  const entries = [];
  for (const [key, validator2] of Object.entries(declaration.params)) {
    const value = seen.get(key);
    if (value === void 0) {
      if (validator2.optional === true) continue;
      return rejected("query-missing");
    }
    entries.push([key, value]);
  }
  const link = Object.freeze({
    version: declaration.version,
    route: route.name,
    ...Object.fromEntries(entries)
  });
  const canonicalUrl = canonicalize(grammar, route, entries);
  if (canonicalUrl.length > grammar.maxUrlLength) return rejected("over-length");
  return { ok: true, parsed: { link, canonicalUrl } };
}
function isDeepLinkValue(grammar, value) {
  if (!isUnknownRecord2(value)) return false;
  const own = (key) => Object.hasOwn(value, key) ? value[key] : void 0;
  const name17 = own("route");
  if (typeof name17 !== "string") return false;
  const route = grammar.routesByName.get(name17);
  if (route === void 0) return false;
  const declaration = route.declaration;
  if (own("version") !== declaration.version) return false;
  for (const key of Object.keys(value)) {
    if (key === "version" || key === "route") continue;
    if (!Object.hasOwn(declaration.params, key)) return false;
  }
  for (const [key, validator2] of Object.entries(declaration.params)) {
    const raw = own(key);
    if (raw === void 0) {
      if (validator2.optional === true) continue;
      return false;
    }
    if (classifyParamValue(validator2, raw) !== "ok") return false;
  }
  return true;
}
function buildDeepLinkUrl(grammar, routeName, params) {
  const route = grammar.routesByName.get(routeName);
  if (route === void 0) {
    throw new DeepLinkBuildError(`route "${routeName}" is not declared`);
  }
  const declaration = route.declaration;
  const supplied = params ?? {};
  for (const key of Object.keys(supplied)) {
    if (!Object.hasOwn(declaration.params, key)) {
      throw new DeepLinkBuildError(`route "${routeName}" has no param "${key}"`);
    }
  }
  const entries = [];
  for (const [key, validator2] of Object.entries(declaration.params)) {
    const value = Object.hasOwn(supplied, key) ? supplied[key] : void 0;
    if (value === void 0) {
      if (validator2.optional === true) continue;
      throw new DeepLinkBuildError(`route "${routeName}" requires param "${key}"`);
    }
    if (typeof value !== "string" || classifyParamValue(validator2, value) !== "ok") {
      throw new DeepLinkBuildError(
        `route "${routeName}" param "${key}" must be ${validator2.expects}`
      );
    }
    entries.push([key, value]);
  }
  const canonicalUrl = canonicalize(grammar, route, entries);
  if (canonicalUrl.length > grammar.maxUrlLength) {
    throw new DeepLinkBuildError(
      `route "${routeName}" builds a URL longer than ${grammar.maxUrlLength} characters`
    );
  }
  return canonicalUrl;
}
function canonicalize(grammar, route, entries) {
  const base = `${grammar.canonicalScheme}://${grammar.authority}${route.declaration.path}`;
  if (entries.length === 0) return base;
  const query = entries.map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join("&");
  return `${base}?${query}`;
}
function startsWithDeclaredScheme(grammar, lower) {
  for (const protocol of grammar.schemeProtocols) {
    if (lower.startsWith(protocol)) return true;
  }
  return false;
}
function isPrintableAscii(value) {
  for (let index = 0; index < value.length; index++) {
    const code = value.charCodeAt(index);
    if (code < 33 || code > 126) return false;
  }
  return true;
}
function rejected(reason) {
  return { ok: false, reason };
}
