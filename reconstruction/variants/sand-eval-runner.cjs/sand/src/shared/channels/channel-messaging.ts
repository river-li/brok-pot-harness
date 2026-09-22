/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/channels/channel-messaging.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var sourceCopyI18n = setupI18n({
  locale: DEFAULT_LOCALE,
  messages: { [DEFAULT_LOCALE]: {} }
});
function connectorCopyForPrompt(copy) {
  return typeof copy === "string" ? copy : sourceCopyI18n._(copy);
}
var CHANNEL_CONFIG_FILENAME = "connection.json";
function describeConnection(connection) {
  const manifest = findConnectorManifest(connection.platform);
  const platformName = manifest?.displayName ?? connection.platform;
  const detail = connection.status === "error" && connection.detail != null ? ` (${connection.detail})` : "";
  const creatorDm = connection.creatorDmAddress != null && connection.creatorDmAddress.length > 0 ? `. DM the user who connected it at ${connection.creatorDmAddress} \u2014 sending there opens the DM, so you don't need to wait for them to message you first` : "";
  return `- ${platformName} "${connection.label}" [${connection.status}]${detail}. Address people on it as ${connection.platform}:<chat id>${creatorDm}`;
}
var CHANNELS_INTRO_LINE = "Channels: outside messaging surfaces you can talk on, beyond this Grok Bot chat.";
function channelsLocationLine(location) {
  return `Each connected channel lives in a subfolder at ${location} holding a ${CHANNEL_CONFIG_FILENAME}. That file holds only a label, never a credential; the secret is kept in a separate store you cannot read. To disconnect one, prefer the update_state tool (target "channel", action "disconnect", the platform); a background connector notices and closes the live connection within a few seconds.`;
}
function renderChannelPlatformGuideLines(manifests) {
  const lines2 = ["Platforms you can connect:"];
  for (const manifest of manifests) {
    if (manifest.availability !== "available") continue;
    lines2.push(`- ${manifest.displayName}: ${connectorCopyForPrompt(manifest.blurb)}`);
    for (const guideLine of manifest.connectGuide.split("\n")) {
      lines2.push(`  ${guideLine}`);
    }
  }
  return lines2;
}
function renderChannelsSystemPrompt(manifests, connections, location, options2) {
  if (location == null) return "";
  if (!hasChannelsToShow(manifests, connections)) return "";
  const lines2 = options2?.skillPointer != null ? [
    CHANNELS_INTRO_LINE,
    channelsLocationLine(location),
    CHANNELS_ADDRESS_LINE,
    CHANNELS_INBOUND_LINE,
    CHANNELS_REACTIONS_LINE,
    options2.skillPointer,
    ...renderChannelPlatformGuideLines(manifests)
  ] : [
    CHANNELS_INTRO_LINE,
    channelsLocationLine(location),
    CHANNELS_SECRET_LINE,
    CHANNELS_ADDRESS_LINE,
    CHANNELS_INBOUND_LINE,
    ...CHANNELS_PROTOCOL_LINES,
    ...renderChannelPlatformGuideLines(manifests)
  ];
  const hasLiveConnection = (platform) => connections.some((connection) => connection.platform === platform);
  const comingSoon = manifests.filter(
    (manifest) => manifest.availability === "coming-soon" && !hasLiveConnection(manifest.platform)
  );
  if (comingSoon.length > 0) {
    lines2.push(
      `Coming soon (not connectable yet): ${comingSoon.map((manifest) => manifest.displayName).join(", ")}.`
    );
  }
  if (connections.length > 0) {
    lines2.push(
      "Currently connected \u2014 this list is the source of truth. A channel listed [connected] is connected even if it keeps no subfolder at the folder above (some connections are managed elsewhere, like a bot's own Slack app installed from its Slack settings), so never decide a platform is disconnected by listing that folder or reading its files, and never request a credential (secret-request) for a platform listed [connected]:"
    );
    for (const connection of connections) {
      lines2.push(describeConnection(connection));
    }
  } else {
    lines2.push(
      "No channels connected yet. Offer to connect one when it would help the user reach people where they already are."
    );
  }
  return lines2.join("\n");
}
var SLACK_INBOUND_WAKE_CLOSING = [
  "Reply to them by calling SendToUser with the channel target set to the address shown above",
  "While you work, Slack shows a live status line in this conversation with what you are doing, so people here already see the checking, searching and drafting as it happens; a message that narrates the same step only adds a bubble they scroll past",
  "People read the conversation as one exchange in which the result lands once, when it is ready, and a brief acknowledgement before a long task is the only split that reads naturally; keep working the rest of your task too, but do not leave them hanging"
].join("\n");

