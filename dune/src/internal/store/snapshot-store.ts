function createSnapshotStore(initial) {
  let snapshot = initial;
  const listeners2 = /* @__PURE__ */ new Set();
  const publish = (next) => {
    if (Object.is(next, snapshot)) return;
    snapshot = next;
    for (const listener of [...listeners2]) listener();
  };
  return {
    get: () => snapshot,
    subscribe: (listener) => {
      listeners2.add(listener);
      return () => {
        listeners2.delete(listener);
      };
    },
    set: publish,
    update: (map4) => publish(map4(snapshot))
  };
}
