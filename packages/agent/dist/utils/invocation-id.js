/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/utils/invocation-id.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_dist4();
init_dist3();
var invocationCounter = new LRUCache({
  max: 1e5
});
var INVOCATION_SUFFIX_ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";
function generateSmallUuid() {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => INVOCATION_SUFFIX_ALPHABET.charAt(byte % INVOCATION_SUFFIX_ALPHABET.length)).join("");
}
function getNextInvocationCount(requestId2) {
  const currentCount = invocationCounter.get(requestId2) ?? 0;
  invocationCounter.set(requestId2, currentCount + 1);
  return currentCount;
}
function getInvocationIdFromRequestId(requestId2) {
  const currentCount = getNextInvocationCount(requestId2);
  return `${requestId2}-${currentCount}-${generateSmallUuid()}`;
}
var defaultGenerator = () => {
  return crypto.randomUUID();
};
var invocationIdGeneratorKey = createKey(/* @__PURE__ */ Symbol("invocationIdGenerator"), defaultGenerator);
function getInvocationId(ctx) {
  const generator = ctx.get(invocationIdGeneratorKey);
  return generator();
}

