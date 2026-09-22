/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/tools/email-tool-format.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var SAND_LIST_EMAIL_INBOXES_TOOL_NAME = "list_email_inboxes";
var SAND_CLAIM_EMAIL_INBOX_TOOL_NAME = "claim_email_inbox";
var SAND_SEARCH_EMAIL_THREADS_TOOL_NAME = "search_email_threads";
var SAND_READ_EMAIL_THREAD_TOOL_NAME = "read_email_thread";
var SAND_READ_EMAIL_ATTACHMENT_TOOL_NAME = "read_email_attachment";
function formatEmailAttachmentSize(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) return "unknown size";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
function formatEmailAddress(address) {
  const name17 = address.name.trim();
  return name17.length > 0 ? `${name17} <${address.email}>` : address.email;
}
function formatEmailAddresses(addresses) {
  return addresses.map(formatEmailAddress).join(", ");
}
function formatEmailTimestamp(ms2) {
  if (!Number.isFinite(ms2) || ms2 <= 0) return "unknown time";
  return new Date(ms2).toISOString().replace(/\.\d{3}Z$/, "Z");
}
function formatEmailDirection(direction) {
  switch (direction) {
    case "inbound":
      return "received";
    case "outbound":
      return "sent";
    case "unknown":
      return "direction unknown";
  }
}

