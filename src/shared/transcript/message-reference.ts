/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/transcript/message-reference.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var MESSAGE_ADDRESS_EXACT = /^t(?:\d+u(?:a\d+)?|(?:\d+|b)[as]\d+)$/;
function isMessageAddress(value) {
  return MESSAGE_ADDRESS_EXACT.test(value);
}

