/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/mcp-agent-exec/dist/common.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function extractTextFromNonTextContent(item) {
  var _a20, _b2;
  const itemAny = item;
  if (itemAny.resource && typeof itemAny.resource === "object") {
    const resource = itemAny.resource;
    if (typeof resource.text === "string") {
      return resource.text;
    } else if (typeof resource.blob === "string") {
      try {
        return Buffer.from(resource.blob, "base64").toString("utf8");
      } catch (_c2) {
        return `[Binary resource: ${(_a20 = resource.uri) !== null && _a20 !== void 0 ? _a20 : "unknown"}]`;
      }
    } else {
      return `Resource: ${(_b2 = resource.uri) !== null && _b2 !== void 0 ? _b2 : "unknown"}${resource.name ? ` (${resource.name})` : ""}`;
    }
  } else if (itemAny.uri) {
    return `Resource: ${itemAny.uri}${itemAny.name ? ` (${itemAny.name})` : ""}`;
  } else {
    return `Unsupported content type "${item.type}": ${JSON.stringify(item)}`;
  }
}

