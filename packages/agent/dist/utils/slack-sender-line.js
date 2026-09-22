/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/utils/slack-sender-line.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function formatSlackSenderLine(senderName, senderId, senderType) {
  const name17 = senderName?.trim();
  const id = senderId?.trim();
  if ((name17 === void 0 || name17.length === 0) && (id === void 0 || id.length === 0)) {
    return void 0;
  }
  const type2 = senderType?.trim();
  const typeSuffix = type2 !== void 0 && type2.length > 0 ? ` (${type2})` : "";
  if (name17 !== void 0 && name17.length > 0 && id !== void 0 && id.length > 0) {
    return `The current message is being sent by ${name17} (${id})${typeSuffix}`;
  }
  const present = name17 !== void 0 && name17.length > 0 ? name17 : id;
  return `The current message is being sent by ${present}${typeSuffix}`;
}

