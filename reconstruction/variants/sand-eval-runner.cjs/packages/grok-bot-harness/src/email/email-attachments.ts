/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/email/email-attachments.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
var import_node_path62 = require("node:path");

// @recovered-fragment 2/2
var SAND_EMAIL_MAX_ATTACHMENTS = 10;
var SAND_EMAIL_ATTACHMENT_PREVIEW_MAX_BYTES = 8 * 1024;
var SAND_EMAIL_ATTACHMENT_PREVIEW_TRUNCATED_MARKER = "\n[\u2026 truncated]";
var SAND_EMAIL_ATTACHMENT_MAX_BYTES = 10 * 1024 * 1024;
var SAND_EMAIL_ATTACHMENTS_TOTAL_MAX_BYTES = 25 * 1024 * 1024;
var EMAIL_ATTACHMENT_BUCKETS = /* @__PURE__ */ new Set([
  ATTACHMENTS_DIRNAME,
  ASSETS_DIRNAME
]);
function unsafeSegments(path30) {
  return path30.split("/").some((segment) => segment === ".." || segment === ".");
}
function toBoxDataRootPath(path30) {
  const aliasPrefix = `${SAND_BOX_MODEL_VISIBLE_DATA_ROOT}/`;
  return path30.startsWith(aliasPrefix) ? `${SAND_BOX_DATA_ROOT}/${path30.slice(aliasPrefix.length)}` : path30;
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
  const agentRoot = toBoxDataRootPath(import_node_path62.posix.normalize(agentDir));
  const candidate = import_node_path62.posix.isAbsolute(raw) ? raw : import_node_path62.posix.join(agentRoot, raw);
  const normalized = toBoxDataRootPath(import_node_path62.posix.normalize(candidate));
  const relative9 = import_node_path62.posix.relative(agentRoot, normalized);
  if (relative9.length === 0 || relative9.startsWith("..") || import_node_path62.posix.isAbsolute(relative9)) {
    return { ok: false, reason: "is outside your agent directory." };
  }
  const [bucket, ...rest] = relative9.split("/");
  if (bucket === void 0 || !EMAIL_ATTACHMENT_BUCKETS.has(bucket) || rest.length === 0) {
    return {
      ok: false,
      reason: `must be under ${import_node_path62.posix.join(agentDir, ATTACHMENTS_DIRNAME)} or ${import_node_path62.posix.join(agentDir, ASSETS_DIRNAME)}.`
    };
  }
  return { ok: true, path: normalized };
}
function formatSandEmailAttachmentSize(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} bytes`;
}

