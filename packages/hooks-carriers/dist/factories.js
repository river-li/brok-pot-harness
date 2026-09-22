/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/hooks-carriers/dist/factories.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_hook_additional_context_pb();

// @recovered-fragment 2/2
function normalizeHookAdditionalContext(content) {
  const normalized = content === null || content === void 0 ? void 0 : content.trim();
  return normalized !== void 0 && normalized.length > 0 ? normalized : void 0;
}
function createHookAdditionalContexts({ hookEventName, additionalContext }) {
  const normalized = normalizeHookAdditionalContext(additionalContext);
  if (normalized === void 0) {
    return [];
  }
  if (normalized.length > HOOK_ADDITIONAL_CONTEXT_MAX_CHARS) {
    throw new HookAdditionalContextTooLargeError({
      hookEventName,
      actualLength: normalized.length,
      maxLength: HOOK_ADDITIONAL_CONTEXT_MAX_CHARS
    });
  }
  return [
    new HookAdditionalContext({
      hookEventName,
      content: normalized
    })
  ];
}

