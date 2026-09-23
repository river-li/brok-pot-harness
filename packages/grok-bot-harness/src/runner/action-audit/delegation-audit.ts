init_dist4();
var sandDelegationAuditorKey = createKey(/* @__PURE__ */ Symbol("sand.delegation-auditor"), void 0);
function recordDelegationDispatched(ctx, dispatch) {
  ctx.get(sandDelegationAuditorKey)?.dispatched(ctx, dispatch);
}
function recordDelegationCompleted(ctx, settled) {
  ctx.get(sandDelegationAuditorKey)?.completed(ctx, settled);
}
