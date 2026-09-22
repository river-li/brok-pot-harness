/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/utils/invocation-id.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_dist();
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
function getNextInvocationCount(requestId) {
  const currentCount = invocationCounter.get(requestId) ?? 0;
  invocationCounter.set(requestId, currentCount + 1);
  return currentCount;
}
function getInvocationIdFromRequestId(requestId) {
  const currentCount = getNextInvocationCount(requestId);
  return `${requestId}-${currentCount}-${generateSmallUuid()}`;
}
var defaultGenerator = () => {
  return crypto.randomUUID();
};
var invocationIdGeneratorKey = createKey(/* @__PURE__ */ Symbol("invocationIdGenerator"), defaultGenerator);
function getInvocationId(ctx) {
  const generator = ctx.get(invocationIdGeneratorKey);
  return generator();
}

