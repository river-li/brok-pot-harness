/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/automations/listener-integrations.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function isListenerPlatform(value) {
  return LISTENER_INTEGRATION_PLATFORMS.some((platform) => platform === value);
}
function listenerPlatformsInTrigger(trigger) {
  const platforms = /* @__PURE__ */ new Set();
  for (const listener of triggerListeners(trigger)) {
    if (isListenerPlatform(listener.type)) platforms.add(listener.type);
  }
  return [...platforms];
}

