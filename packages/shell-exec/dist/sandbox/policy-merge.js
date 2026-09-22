/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/shell-exec/dist/sandbox/policy-merge.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function mergePathsIntersection(...sources) {
  const definedSources = sources.filter((s3) => s3 !== void 0);
  if (definedSources.length === 0) {
    return [];
  }
  if (definedSources.some((s3) => s3.length === 0)) {
    return [];
  }
  if (definedSources.length === 1) {
    return deduplicatePaths(definedSources[0]).map(normalizePath);
  }
  let result = new Set(definedSources[0].map(normalizePath));
  for (let i = 1; i < definedSources.length; i++) {
    const sourceSet = new Set(definedSources[i].map(normalizePath));
    result = new Set([...result].filter((path31) => sourceSet.has(path31)));
  }
  return [...result];
}
function rankedPolicyField({ defaultValue, rank }) {
  return {
    defaultValue,
    merge: (...sources) => {
      const definedSources = sources.filter((source) => source !== void 0);
      if (definedSources.length === 0) {
        return defaultValue;
      }
      return definedSources.reduce((strictest, source) => rank[source] < rank[strictest] ? source : strictest);
    }
  };
}
function intersectingPathPolicyField() {
  return {
    defaultValue: [],
    merge: (...sources) => mergePathsIntersection(...sources)
  };
}
function normalizePath(path31) {
  const normalized = path31.replace(/\\/g, "/").replace(/\/+$/, "");
  if (normalized === "") {
    return "/";
  }
  if (/^[a-zA-Z]:$/.test(normalized)) {
    return `${normalized}/`;
  }
  return normalized;
}
function deduplicatePaths(paths) {
  const seen = /* @__PURE__ */ new Set();
  const result = [];
  for (const path31 of paths) {
    const normalized = normalizePath(path31);
    if (!seen.has(normalized)) {
      seen.add(normalized);
      result.push(path31);
    }
  }
  return result;
}
var readBoundaryPolicyField, additionalReadPathsPolicyField;
var init_policy_merge = __esm({
  "../packages/shell-exec/dist/sandbox/policy-merge.js"() {
    "use strict";
    init_hardcoded_policy();
    init_network_policy_utils();
    readBoundaryPolicyField = rankedPolicyField({
      defaultValue: "system",
      rank: {
        workspace: 0,
        system: 1
      }
    });
    additionalReadPathsPolicyField = intersectingPathPolicyField();
  }
});

