/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/local-exec/messages-error-classifier.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var CODE_BY_MESSAGE = /* @__PURE__ */ new Map([
  [SAND_NO_LOCAL_MACHINE_MESSAGE, "no_local_machine"],
  [SAND_LOCAL_EXEC_UNSUPPORTED_FRAME_MESSAGE, "incompatible_versions"],
  [SAND_LOCAL_EXEC_UNSUPPORTED_RESULT_MESSAGE, "incompatible_versions"],
  [SAND_LOCAL_TOOLS_DISABLED_MESSAGE, "local_tools_disabled"],
  [SAND_MESSAGES_DISABLED_MESSAGE, "messages_disabled"],
  [SAND_LOCAL_TOOLS_UNAPPROVED_MESSAGE, "permission_denied"],
  [SAND_LOCAL_TOOLS_ASK_UNAVAILABLE_MESSAGE, "permission_denied"],
  [SAND_LOCAL_TOOLS_UNDESCRIBABLE_MESSAGE, "permission_denied"],
  [SAND_LOCAL_TOOLS_PREPARATORY_MESSAGE, "permission_denied"],
  [SAND_LOCAL_TOOLS_TARGET_TOO_LARGE_MESSAGE, "permission_denied"],
  ["sidecar_missing", "sidecar_unavailable"],
  ["sidecar_install_dir_missing", "sidecar_unavailable"],
  ["sidecar_timeout", "sidecar_unavailable"],
  ["sidecar_closed", "sidecar_unavailable"],
  ["sidecar_unreachable", "sidecar_unavailable"],
  ["helper_snapshot-messages-db_failed", "helper_snapshot_failed"],
  ["helper_send-message_failed", "helper_send_failed"],
  ["helper_copy-attachment_failed", "helper_attachment_failed"],
  ["helper_check-messages-permissions_failed", "helper_permissions_failed"],
  ["helper_find-contacts_failed", "helper_contacts_failed"],
  ["helper_resolve-handles_failed", "helper_contacts_failed"],
  ["messages_automation_denied", "automation_denied"],
  ["messages_addressing_failed", "addressing_failed"],
  ["messages_contacts_denied", "contacts_denied"]
]);
var CODE_BY_LABELLED_SUFFIX = [
  [COMPUTER_UNAVAILABLE_SUFFIX, "computer_unavailable"],
  [COMPUTER_TEMPORARILY_UNREACHABLE_SUFFIX, "response_timeout"],
  [MESSAGES_UNSUPPORTED_SUFFIX, "messages_unsupported"]
];
var DECLINED_MESSAGES = /* @__PURE__ */ new Set([
  SAND_LOCAL_TOOLS_DENIED_MESSAGE,
  SAND_LOCAL_TOOLS_ABANDONED_MESSAGE,
  SAND_LOCAL_TOOLS_STALE_TASK_MESSAGE,
  SAND_LOCAL_TOOLS_ASK_EXPIRED_MESSAGE,
  SAND_LOCAL_TOOLS_ASK_CANCELLED_MESSAGE
]);
function isMessagesDecline(error3) {
  return error3 instanceof Error && DECLINED_MESSAGES.has(error3.message);
}
function sandMessagesErrorCode(error3) {
  if (!(error3 instanceof Error)) return "other";
  if ("code" in error3 && error3.code !== void 0) {
    return SAND_MESSAGES_ERROR_CODES.find((code) => code === error3.code) ?? "other";
  }
  const exact = CODE_BY_MESSAGE.get(error3.message);
  if (exact !== void 0) return exact;
  return CODE_BY_LABELLED_SUFFIX.find(([suffix]) => error3.message.endsWith(suffix))?.[1] ?? "other";
}

