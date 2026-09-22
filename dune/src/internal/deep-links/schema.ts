/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../dune/src/internal/deep-links/schema.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function routeString(input) {
  const options2 = input instanceof RegExp ? { pattern: input } : input ?? {};
  if (options2.pattern !== void 0 && options2.oneOf !== void 0) {
    throw new DeepLinkDeclarationError("routeString takes a pattern or a oneOf list, not both");
  }
  if (options2.maxDecodedLength !== void 0) {
    if (!Number.isSafeInteger(options2.maxDecodedLength) || options2.maxDecodedLength < 1) {
      throw new DeepLinkDeclarationError("routeString maxDecodedLength must be a positive integer");
    }
  }
  if (options2.oneOf !== void 0) {
    if (options2.oneOf.length === 0) {
      throw new DeepLinkDeclarationError("routeString oneOf must name at least one value");
    }
    if (new Set(options2.oneOf).size !== options2.oneOf.length) {
      throw new DeepLinkDeclarationError("routeString oneOf values must be distinct");
    }
    for (const value of options2.oneOf) {
      if (value.length === 0 || hasDeepLinkControlCharacters(value)) {
        throw new DeepLinkDeclarationError(
          "routeString oneOf values must be nonempty and control-character free"
        );
      }
    }
  }
  const matcher = options2.pattern === void 0 ? void 0 : anchoredMatcher(options2.pattern);
  const allowed = options2.oneOf === void 0 ? void 0 : new Set(options2.oneOf);
  const expects = describeExpectation(options2, matcher);
  return toValidator(expects, (value, path31) => {
    if (typeof value !== "string") return rejected2(path31, expects, value);
    if (options2.maxDecodedLength !== void 0 && value.length > options2.maxDecodedLength) {
      return rejected2(path31, expects, value);
    }
    if (allowed !== void 0 && !allowed.has(value)) return rejected2(path31, expects, value);
    if (matcher !== void 0 && !matcher.test(value)) return rejected2(path31, expects, value);
    return { ok: true, value };
  });
}
function routeOptional(member) {
  return { ...member, optional: true };
}
function anchoredMatcher(pattern) {
  const flags = pattern.flags.replace(/[gy]/g, "");
  return new RegExp(`^(?:${pattern.source})$`, flags);
}
function describeExpectation(options2, matcher) {
  let base = "string";
  if (options2.oneOf !== void 0) {
    base = options2.oneOf.map((value) => JSON.stringify(value)).join(" | ");
  } else if (matcher !== void 0) {
    base = `string matching /${options2.pattern?.source}/${matcher.flags}`;
  }
  return options2.maxDecodedLength === void 0 ? base : `${base} of at most ${options2.maxDecodedLength} characters`;
}
function rejected2(path31, expected, value) {
  return { ok: false, path: path31, expected, received: typeof value };
}

