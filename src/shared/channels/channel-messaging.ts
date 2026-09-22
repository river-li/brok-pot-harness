/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/channels/channel-messaging.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_dist5();
init_locale();

// @recovered-fragment 2/2
var sourceCopyI18n = setupI18n({
  locale: DEFAULT_LOCALE,
  messages: { [DEFAULT_LOCALE]: {} }
});
function connectorCopyForPrompt(copy) {
  return typeof copy === "string" ? copy : sourceCopyI18n._(copy);
}
var CHANNEL_CONFIG_FILENAME = "connection.json";
var CHANNEL_MAX_LABEL_LENGTH = 80;
function clampChannelLabel(label) {
  return clampLine(label, CHANNEL_MAX_LABEL_LENGTH);
}
function buildChannelOutboundMessage(message) {
  if (message.type === "text") {
    const image2 = (message.images ?? []).find((entry) => entry.url.length > 0);
    if (image2 != null) {
      return {
        kind: "attachment",
        url: image2.url,
        caption: message.content.length > 0 ? message.content : null
      };
    }
    return message.content.length > 0 ? { kind: "text", text: message.content } : null;
  }
  if (message.type === "attachment") {
    const caption = message.alt != null && message.alt.length > 0 ? message.alt : null;
    if (message.url.length > 0) {
      const fileName = message.file_name;
      return {
        kind: "attachment",
        url: message.url,
        caption,
        ...fileName != null && fileName.length > 0 ? { fileName } : {}
      };
    }
    return caption != null ? { kind: "text", text: caption } : null;
  }
  return null;
}
function describeConnection(connection) {
  const manifest = findConnectorManifest(connection.platform);
  const platformName = manifest?.displayName ?? connection.platform;
  const detail = connection.status === "error" && connection.detail != null ? ` (${connection.detail})` : "";
  const creatorDm = connection.creatorDmAddress != null && connection.creatorDmAddress.length > 0 ? `. DM the user who connected it at ${connection.creatorDmAddress} \u2014 sending there opens the DM, so you don't need to wait for them to message you first` : "";
  return `- ${platformName} "${connection.label}" [${connection.status}]${detail}. Address people on it as ${connection.platform}:<chat id>${creatorDm}`;
}
var CHANNELS_INTRO_LINE = "Channels: outside messaging surfaces you can talk on, beyond this Grok Bot chat.";
function channelsLocationLine(location2) {
  return `Each connected channel lives in a subfolder at ${location2} holding a ${CHANNEL_CONFIG_FILENAME}. That file holds only a label, never a credential; the secret is kept in a separate store you cannot read. To disconnect one, prefer the update_state tool (target "channel", action "disconnect", the platform); a background connector notices and closes the live connection within a few seconds.`;
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
function renderChannelsSystemPrompt(manifests, connections, location2, options2) {
  if (location2 == null) return "";
  if (!hasChannelsToShow(manifests, connections)) return "";
  const lines2 = options2?.skillPointer != null ? [
    CHANNELS_INTRO_LINE,
    channelsLocationLine(location2),
    CHANNELS_ADDRESS_LINE,
    CHANNELS_INBOUND_LINE,
    CHANNELS_REACTIONS_LINE,
    options2.skillPointer,
    ...renderChannelPlatformGuideLines(manifests)
  ] : [
    CHANNELS_INTRO_LINE,
    channelsLocationLine(location2),
    CHANNELS_SECRET_LINE,
    CHANNELS_ADDRESS_LINE,
    CHANNELS_INBOUND_LINE,
    ...CHANNELS_PROTOCOL_LINES,
    ...renderChannelPlatformGuideLines(manifests)
  ];
  const hasLiveConnection = (platform2) => connections.some((connection) => connection.platform === platform2);
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
function formatChannelReactionSummary(reaction) {
  if (reaction.messageQuote != null && reaction.messageQuote.length > 0) {
    return `reacted ${reaction.emoji} to your message: "${reaction.messageQuote}"`;
  }
  return `reacted ${reaction.emoji} to a message`;
}
function groupEnvelopesByAddress(envelopes) {
  const grouped = /* @__PURE__ */ new Map();
  for (const envelope of envelopes) {
    const key = formatChannelAddress(envelope.address);
    const bucket = grouped.get(key) ?? [];
    bucket.push(envelope);
    grouped.set(key, bucket);
  }
  return grouped;
}
function isVoiceCallCloseOnlyWake(envelopes) {
  if (envelopes.length === 0) return false;
  const [first] = envelopes;
  if (first == null) return false;
  const line = formatChannelAddress(first.address);
  return envelopes.every(
    (envelope) => formatChannelAddress(envelope.address) === line && envelope.address.platform === VOICE_CALL_CHANNEL_PLATFORM && VoiceCallChannel.callIdOf(formatChannelAddress(envelope.address)) !== null && envelope.reaction == null && (envelope.images?.length ?? 0) === 0
  ) && envelopes.some((envelope) => envelope.text === VOICE_CALL_ENDED_MESSAGE);
}
function anyVoiceCallCloseOnlyWake(envelopes) {
  for (const bucket of groupEnvelopesByAddress(envelopes).values()) {
    if (isVoiceCallCloseOnlyWake(bucket)) return true;
  }
  return false;
}
function voiceLineAwaitingAnAnswer(envelopes) {
  if (envelopes.length === 0) return null;
  if (!envelopes.some((envelope) => envelope.reaction == null)) return null;
  if (envelopes.some((envelope) => envelope.text === VOICE_CALL_ENDED_MESSAGE)) return null;
  const addresses = envelopes.map((envelope) => formatChannelAddress(envelope.address));
  if (addresses.some((addressToken) => VoiceCallChannel.callIdOf(addressToken) === null)) {
    return null;
  }
  return addresses[0] ?? null;
}
function firstVoiceLineAwaitingAnAnswer(envelopes) {
  for (const bucket of groupEnvelopesByAddress(envelopes).values()) {
    const line = voiceLineAwaitingAnAnswer(bucket);
    if (line !== null) return line;
  }
  return null;
}
var SLACK_INBOUND_WAKE_CLOSING = [
  "Reply to them by calling SendToUser with the channel target set to the address shown above",
  "While you work, Slack shows a live status line in this conversation with what you are doing, so people here already see the checking, searching and drafting as it happens; a message that narrates the same step only adds a bubble they scroll past",
  "People read the conversation as one exchange in which the result lands once, when it is ready, and a brief acknowledgement before a long task is the only split that reads naturally; keep working the rest of your task too, but do not leave them hanging"
].join("\n");
function buildChannelInboundWakePrompt(envelopes) {
  const grouped = groupEnvelopesByAddress(envelopes);
  const blocks = [];
  for (const [addressToken, bucket] of grouped) {
    const [head] = bucket;
    if (head == null) continue;
    const platform2 = findConnectorManifest(head.address.platform);
    const platformName = platform2?.displayName ?? head.address.platform;
    const transcript = bucket.map(
      (envelope) => envelope.reaction != null ? `  ${envelope.sender} ${formatChannelReactionSummary(envelope.reaction)}` : `  ${envelope.sender}: ${envelope.text}`
    ).join("\n");
    blocks.push(`On ${platformName}, from ${addressToken}:
${transcript}`);
  }
  const hasMessage = envelopes.some((envelope) => envelope.reaction == null);
  const plural2 = envelopes.length === 1 ? "" : "s";
  const opening = hasMessage ? `${CHANNEL_INBOUND_WAKE_CUE} New message${plural2} on a channel you are connected to.` : `${CHANNEL_INBOUND_WAKE_CUE} New reaction${plural2} on a channel you are connected to.`;
  const fromAnOutsidePlatform = [...grouped.keys()].some(
    (addressToken) => VoiceCallChannel.callIdOf(addressToken) === null
  );
  const slackOnly = envelopes.every((envelope) => envelope.address.platform === SLACK_PLATFORM);
  const closing = hasMessage ? slackOnly ? SLACK_INBOUND_WAKE_CLOSING : "Reply to them by calling SendToUser with the channel target set to the address shown above. Open with a quick one-line acknowledgement first, then send progress and the result as separate messages as they happen, never one long message at the end. Keep each message short: this is a messaging app, so reply in brief, chat-style messages (lead with the answer, a sentence or two), not long ones. Keep working the rest of your task too, but do not leave them hanging." : "You don't need to reply; act on a reaction only if it's useful (e.g. acknowledge, adjust, or continue). If you do choose to respond, use SendToUser with the channel target shown above.";
  const voiceClosings = [];
  for (const bucket of grouped.values()) {
    const line = voiceLineAwaitingAnAnswer(bucket);
    if (line !== null) {
      voiceClosings.push(
        MainLoopVoicePrompt.wakeClosing({ sendTool: "SendToUser", address: line })
      );
    }
    if (isVoiceCallCloseOnlyWake(bucket)) {
      voiceClosings.push(MainLoopVoicePrompt.callEndedClosing({ sendTool: "SendToUser" }));
    }
  }
  return [
    opening,
    ...fromAnOutsidePlatform ? ["This is activity from someone on an outside platform, not the user typing in this app."] : [],
    "",
    blocks.join("\n\n"),
    ...fromAnOutsidePlatform ? ["", closing] : [],
    ...voiceClosings.flatMap((text2) => ["", text2])
  ].join("\n");
}
var CHANNEL_DELIVERY_FAILED_WAKE_CUE = "[channel-delivery-failed]";
function classifyChannelDeliveryFailure({
  addressToken,
  rawMessage
}) {
  const address = parseChannelAddress(addressToken);
  const trimmed = rawMessage.trim();
  if (address == null || /not a valid channel address/i.test(trimmed)) {
    return { kind: "channel_address_invalid", params: { address: addressToken } };
  }
  if (trimmed === "No channel delivery mechanism is registered.") {
    return { kind: "channel_messaging_unavailable", params: {} };
  }
  const platform2 = findConnectorManifest(address.platform)?.displayName ?? address.platform;
  if (/no live .* connection/i.test(trimmed)) {
    return { kind: "channel_platform_not_connected", params: { platform: platform2 } };
  }
  return { kind: "channel_delivery_failed", params: { platform: platform2, technicalDetail: trimmed } };
}
function humanizeChannelDeliveryFailure({
  addressToken,
  rawMessage
}) {
  const address = parseChannelAddress(addressToken);
  const platformName = address != null ? findConnectorManifest(address.platform)?.displayName ?? address.platform : null;
  const trimmed = rawMessage.trim();
  if (address == null || /not a valid channel address/i.test(trimmed)) {
    return `"${addressToken}" isn't a valid channel address, so that message wasn't delivered.`;
  }
  if (trimmed === "No channel delivery mechanism is registered.") {
    return "Channel messaging isn't available on this computer, so that message wasn't delivered.";
  }
  if (/no live .* connection/i.test(trimmed)) {
    return `${platformName} isn't connected on this computer, so that message wasn't delivered. Connect ${platformName} (add its token) to send there.`;
  }
  return `Couldn't deliver that message to ${platformName}: ${trimmed}`;
}
function buildChannelDeliveryFailureWakePrompt(failures) {
  const lines2 = failures.map((failure2) => `- To ${failure2.addressToken}: ${failure2.reason}`);
  const plural2 = failures.length === 1 ? "" : "s";
  return [
    `${CHANNEL_DELIVERY_FAILED_WAKE_CUE} A message you tried to send to a channel did not go through.`,
    "This is a system notice about your own outbound send, not the user typing in this app. You may have already told the user it was sent, so correct the record.",
    ...lines2,
    `Tell the user plainly here, in this in-app chat (a SendToUser with no channel target), that the message${plural2} didn't go through and why, so they aren't left believing it was delivered. Don't silently retry the same channel; if it isn't connected, offer to help connect it.`
  ].join("\n");
}
var CHANNEL_CREDENTIAL_FIELD = "token";

