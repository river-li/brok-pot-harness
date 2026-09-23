var import_node_crypto84 = require("node:crypto");
var MESSAGE_CHANNEL_PLATFORMS = /* @__PURE__ */ new Set(["slack", "discord"]);
var HASH_HEX_LENGTH = 32;
function hashMessageChannelAddress(address) {
  const trimmed = address.trim();
  const platform2 = trimmed.slice(0, Math.max(0, trimmed.indexOf(":")));
  if (!MESSAGE_CHANNEL_PLATFORMS.has(platform2)) return void 0;
  return (0, import_node_crypto84.createHash)("sha256").update(trimmed, "utf8").digest("hex").slice(0, HASH_HEX_LENGTH);
}
