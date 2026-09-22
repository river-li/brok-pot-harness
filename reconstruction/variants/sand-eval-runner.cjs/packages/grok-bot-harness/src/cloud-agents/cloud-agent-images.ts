/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/cloud-agents/cloud-agent-images.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_dist2();

// @recovered-fragment 2/2
var CLOUD_AGENT_DOCUMENT_BYTE_LIMIT = ATTACHMENT_BYTE_LIMIT;
var CLOUD_AGENT_VIDEO_BYTE_LIMIT = Math.min(
  VIDEO_BYTE_LIMIT,
  DEFAULT_INLINE_VIDEO_MAX_BYTES
);
var REQUEST_PROMPT_HEADROOM_BYTES = 2 * 1024 * 1024;
var CLOUD_AGENT_ATTACHMENTS_TOTAL_BYTE_LIMIT = BACKEND_REQUEST_BODY_SIZE_LIMIT_BYTES - REQUEST_PROMPT_HEADROOM_BYTES;
var BYTES_PER_MB = 1024 * 1024;
function formatMegabytes(bytes) {
  return `${Math.round(bytes / BYTES_PER_MB)} MB`;
}
var CLOUD_AGENT_DOCUMENT_LIMIT_LABEL = formatMegabytes(CLOUD_AGENT_DOCUMENT_BYTE_LIMIT);
var CLOUD_AGENT_VIDEO_LIMIT_LABEL = formatMegabytes(CLOUD_AGENT_VIDEO_BYTE_LIMIT);
var CLOUD_AGENT_ATTACHMENTS_TOTAL_LIMIT_LABEL = formatMegabytes(
  CLOUD_AGENT_ATTACHMENTS_TOTAL_BYTE_LIMIT
);

