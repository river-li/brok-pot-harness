var import_node_path169 = require("node:path");
var SAND_EMAIL_MAX_ATTACHMENTS = 10;
var SAND_EMAIL_ATTACHMENT_PREVIEW_MAX_BYTES = 8 * 1024;
var SAND_EMAIL_ATTACHMENT_PREVIEW_TRUNCATED_MARKER = "\n[\u2026 truncated]";
var SAND_EMAIL_ATTACHMENT_MAX_BYTES = 10 * 1024 * 1024;
var SAND_EMAIL_ATTACHMENTS_TOTAL_MAX_BYTES = 25 * 1024 * 1024;
var EMAIL_ATTACHMENT_BUCKETS = /* @__PURE__ */ new Set([
  ATTACHMENTS_DIRNAME,
  ASSETS_DIRNAME
]);
function unsafeSegments(path31) {
  return path31.split("/").some((segment) => segment === ".." || segment === ".");
}
function toBoxDataRootPath(path31) {
  const aliasPrefix = `${SAND_BOX_MODEL_VISIBLE_DATA_ROOT}/`;
  return path31.startsWith(aliasPrefix) ? `${SAND_BOX_DATA_ROOT}/${path31.slice(aliasPrefix.length)}` : path31;
}
function resolveSandEmailAttachmentPath({
  raw,
  agentDir
}) {
  if (raw.includes("\0") || raw.trim().length === 0) {
    return { ok: false, reason: "is not a valid path." };
  }
  if (raw.endsWith("/")) {
    return { ok: false, reason: "names a directory, not a file." };
  }
  if (unsafeSegments(raw)) {
    return { ok: false, reason: "may not contain `..` or `.` segments." };
  }
  const agentRoot = toBoxDataRootPath(import_node_path169.posix.normalize(agentDir));
  const candidate = import_node_path169.posix.isAbsolute(raw) ? raw : import_node_path169.posix.join(agentRoot, raw);
  const normalized = toBoxDataRootPath(import_node_path169.posix.normalize(candidate));
  const relative18 = import_node_path169.posix.relative(agentRoot, normalized);
  if (relative18.length === 0 || relative18.startsWith("..") || import_node_path169.posix.isAbsolute(relative18)) {
    return { ok: false, reason: "is outside your agent directory." };
  }
  const [bucket, ...rest] = relative18.split("/");
  if (bucket === void 0 || !EMAIL_ATTACHMENT_BUCKETS.has(bucket) || rest.length === 0) {
    return {
      ok: false,
      reason: `must be under ${import_node_path169.posix.join(agentDir, ATTACHMENTS_DIRNAME)} or ${import_node_path169.posix.join(agentDir, ASSETS_DIRNAME)}.`
    };
  }
  return { ok: true, path: normalized };
}
function formatSandEmailAttachmentSize(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} bytes`;
}
