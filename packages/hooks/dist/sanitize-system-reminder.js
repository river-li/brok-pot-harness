/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/hooks/dist/sanitize-system-reminder.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var SYSTEM_REMINDER_TAG_PATTERN = /<(\/?)system_reminder>/gi;
function sanitizeSystemReminderContent(content) {
  return content.replace(SYSTEM_REMINDER_TAG_PATTERN, (_match, slash) => `<${slash}system_reminder_>`);
}

