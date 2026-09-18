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
