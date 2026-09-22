/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/hooks-carriers/dist/hook-additional-context-render.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function renderHookAdditionalContextSystemReminder(content, onOversize) {
  const normalized = content === null || content === void 0 ? void 0 : content.trim();
  if (!normalized) {
    return void 0;
  }
  if (normalized.length > HOOK_ADDITIONAL_CONTEXT_MAX_CHARS) {
    onOversize === null || onOversize === void 0 ? void 0 : onOversize(normalized.length, HOOK_ADDITIONAL_CONTEXT_MAX_CHARS);
    return void 0;
  }
  const sanitized = sanitizeSystemReminderContent(normalized);
  return `<system_reminder>
${sanitized}
</system_reminder>`;
}

