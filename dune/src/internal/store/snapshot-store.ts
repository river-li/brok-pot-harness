/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../dune/src/internal/store/snapshot-store.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
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

