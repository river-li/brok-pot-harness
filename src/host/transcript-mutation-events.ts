/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/transcript-mutation-events.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var listeners = /* @__PURE__ */ new Set();
function subscribeTranscriptMutations(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
function publishTranscriptMutation(mutation) {
  for (const listener of listeners) {
    try {
      listener(mutation);
    } catch {
    }
  }
}

