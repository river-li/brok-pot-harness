/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/tools/listener-connect-cards.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function displayName(platform) {
  return listenerIntegrationManifest(platform)?.displayName ?? platform;
}
async function surfaceListenerConnectCards({
  trigger,
  isListenerPlatformConnected,
  emit
}) {
  if (isListenerPlatformConnected == null) return null;
  const platforms = listenerPlatformsInTrigger(trigger);
  if (platforms.length === 0) return null;
  const disconnected = [];
  for (const platform of platforms) {
    try {
      if (!await isListenerPlatformConnected(platform)) {
        disconnected.push(platform);
      }
    } catch (error3) {
      process.stderr.write(
        `sand.automation.listener_connection_read_failed platform=${platform} error_class=${errorLogTag(error3)}
`
      );
    }
  }
  if (disconnected.length === 0) return null;
  for (const platform of disconnected) {
    emit({
      type: "listener-connect",
      platform,
      reason: "so this routine can fire"
    });
  }
  const names3 = disconnected.map(displayName).join(" and ");
  return `${names3} ${disconnected.length === 1 ? "isn't" : "aren't"} connected to the user's Cursor account yet, so this routine won't fire until they connect. The connect card is already in the chat \u2014 say so in your own words, but don't paste a link or send them to settings, and don't ask them to report back: you're resumed automatically once it connects.`;
}

