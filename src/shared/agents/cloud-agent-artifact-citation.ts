/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/agents/cloud-agent-artifact-citation.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var ARTIFACTS_ROOT_PREFIX = `${SAND_CLOUD_AGENT_ARTIFACTS_BOX_ROOT}/`;
function addCitedToken(cited, raw) {
  const token = raw.replace(/^[./]+/u, "").replace(/[.]+$/u, "");
  if (token.length === 0) {
    return;
  }
  cited.add(token);
  const base = token.split("/").at(-1);
  if (base !== void 0 && base.length > 0) {
    cited.add(base);
  }
}
function decodedTokenOrNull(raw) {
  try {
    return decodeURIComponent(raw);
  } catch (error42) {
    if (error42 instanceof URIError) return null;
    throw error42;
  }
}
function citedFileTokens(text2) {
  const cited = /* @__PURE__ */ new Set();
  for (const raw of text2.split(/[^\w./%-]+/u)) {
    addCitedToken(cited, raw);
    if (raw.includes("%")) {
      const decoded = decodedTokenOrNull(raw);
      if (decoded !== null) addCitedToken(cited, decoded);
    }
  }
  return cited;
}
var TOKEN_SAFE_FILE_NAME = /^[\w./%-]+$/u;
function citedCloudAgentArtifactPaths(text2, paths) {
  const cited = citedFileTokens(text2);
  return paths.filter((path31) => {
    const fileName = path31.split("/").at(-1) ?? "";
    if (fileName.length === 0) return false;
    if (cited.has(fileName) || cited.has(path31.replace(/^\/+/u, ""))) return true;
    return !TOKEN_SAFE_FILE_NAME.test(fileName) && text2.includes(fileName);
  });
}

