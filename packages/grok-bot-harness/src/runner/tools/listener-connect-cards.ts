init_errors();
function displayName(platform2) {
  return listenerIntegrationManifest(platform2)?.displayName ?? platform2;
}
async function surfaceListenerConnectCards({
  trigger: trigger2,
  isListenerPlatformConnected,
  emit
}) {
  if (isListenerPlatformConnected == null) return null;
  const platforms = listenerPlatformsInTrigger(trigger2);
  if (platforms.length === 0) return null;
  const disconnected = [];
  for (const platform2 of platforms) {
    try {
      if (!await isListenerPlatformConnected(platform2)) {
        disconnected.push(platform2);
      }
    } catch (error42) {
      process.stderr.write(
        `sand.automation.listener_connection_read_failed platform=${platform2} error_class=${errorLogTag(error42)}
`
      );
    }
  }
  if (disconnected.length === 0) return null;
  for (const platform2 of disconnected) {
    emit({
      type: "listener-connect",
      platform: platform2,
      reason: "so this routine can fire"
    });
  }
  const names3 = disconnected.map(displayName).join(" and ");
  return `${names3} ${disconnected.length === 1 ? "isn't" : "aren't"} connected to the user's Cursor account yet, so this routine won't fire until they connect. The connect card is already in the chat. Say so in your own words, but don't paste a link or send them to settings, and don't ask them to report back. You're resumed automatically once it connects.`;
}
