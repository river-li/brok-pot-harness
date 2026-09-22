/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/media/box-file-path.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var BOX_FILE_ROOTS = ["/tmp/", "/workspace/", "/home/", "/root/"];
var PRIVATE_STORE_MARKERS = [
  "/sand-data/",
  "/agent-data/",
  "/.grokbot/",
  "/.cursor/sand"
];
function fileUrlPath(source) {
  if (!URL.canParse(source)) return null;
  const url2 = new URL(source);
  if (url2.protocol !== "file:") return null;
  if (url2.username.length > 0 || url2.password.length > 0) return null;
  if (url2.hostname.length > 0 && url2.hostname !== "localhost") return null;
  return url2.pathname.length === 0 ? null : url2.pathname;
}
function hasPrivateStoreMarker(path31) {
  return PRIVATE_STORE_MARKERS.some((marker17) => path31.includes(marker17));
}
function lexicalBoxFilePath(source) {
  const trimmed = source.trim();
  if (trimmed.length === 0 || trimmed.length > 4096) return null;
  if (trimmed.includes("\0") || trimmed.includes("\n") || trimmed.includes("\r")) return null;
  const path31 = /^file:/i.test(trimmed) ? fileUrlPath(trimmed) : trimmed;
  if (path31 == null || !path31.startsWith("/") || path31.includes("\\")) return null;
  const segments = path31.split("/");
  if (segments.length < 3) return null;
  if (segments.some(
    (segment, index) => index > 0 && (segment.length === 0 || segment === "." || segment === "..")
  )) {
    return null;
  }
  const normalized = `/${segments.slice(1).join("/")}`;
  if (!BOX_FILE_ROOTS.some((root) => normalized.startsWith(root))) return null;
  if (hasPrivateStoreMarker(normalized)) return null;
  if (getFilePreviewKind(normalized) === "unknown") return null;
  return normalized;
}
var MACOS_TMP_REALPATH_PREFIX = "/private/tmp/";
function resolvedBoxFilePath(realPath) {
  if (lexicalBoxFilePath(realPath) != null) return realPath;
  if (!realPath.startsWith(MACOS_TMP_REALPATH_PREFIX)) return null;
  const asTmp = `/tmp/${realPath.slice(MACOS_TMP_REALPATH_PREFIX.length)}`;
  return lexicalBoxFilePath(asTmp) == null ? null : realPath;
}

