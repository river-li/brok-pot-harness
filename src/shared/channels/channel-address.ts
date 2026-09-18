var DISCORD_PLATFORM = "discord";
var SLACK_PLATFORM = "slack";
function formatChannelAddress(address) {
  return `${address.platform}:${address.chat}`;
}
function parseChannelAddress(raw) {
  const trimmed = raw.trim();
  const separator = trimmed.indexOf(":");
  if (separator <= 0) return null;
  const platform2 = trimmed.slice(0, separator).trim();
  const chat = trimmed.slice(separator + 1).trim();
  if (platform2.length === 0 || chat.length === 0) return null;
  return { platform: platform2, chat };
}
