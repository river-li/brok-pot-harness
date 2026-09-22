/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/box-store-sync/claim-set.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var ClaimSet = class {
  claimed = /* @__PURE__ */ new Set();
  has(path31) {
    return this.claimed.has(path31);
  }
  tryClaim(path31) {
    if (this.claimed.has(path31)) return false;
    this.claimed.add(path31);
    return true;
  }
  release(path31) {
    this.claimed.delete(path31);
  }
  snapshot() {
    return new Set(this.claimed);
  }
};
async function settleAllThenThrowFirst(promises3) {
  const settled = await Promise.allSettled(promises3);
  const failure2 = settled.find(
    (result) => result.status === "rejected"
  );
  if (failure2 != null) throw failure2.reason;
}

