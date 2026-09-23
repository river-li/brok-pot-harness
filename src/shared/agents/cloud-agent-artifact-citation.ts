var ARTIFACTS_ROOT_PREFIX = `${SAND_CLOUD_AGENT_ARTIFACTS_BOX_ROOT}/`;
var BC_ID = /^bc-[A-Za-z0-9-]{1,80}$/;
function boxPathOf(source) {
  const trimmed = source.trim();
  if (!/^file:/i.test(trimmed)) return trimmed.startsWith("/") ? trimmed : null;
  if (!URL.canParse(trimmed)) return null;
  const url2 = new URL(trimmed);
  if (url2.protocol !== "file:" || url2.username.length > 0 || url2.password.length > 0) return null;
  return url2.pathname.length === 0 ? null : url2.pathname;
}
function cloudAgentArtifactCitation(source) {
  const path31 = boxPathOf(source);
  if (path31 == null || !path31.startsWith(ARTIFACTS_ROOT_PREFIX)) return null;
  const rest = path31.slice(ARTIFACTS_ROOT_PREFIX.length);
  const slash = rest.indexOf("/");
  if (slash <= 0 || slash === rest.length - 1) return null;
  const bcId = rest.slice(0, slash);
  if (!BC_ID.test(bcId)) return null;
  return { bcId, kind: getFilePreviewKind(path31) };
}
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
