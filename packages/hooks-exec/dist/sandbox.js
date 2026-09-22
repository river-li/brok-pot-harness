/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/hooks-exec/dist/sandbox.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_sandbox_pb();
function isSandboxed(policy) {
  if (!policy) {
    return false;
  }
  return policy.type !== SandboxPolicy_Type.INSECURE_NONE && policy.type !== SandboxPolicy_Type.UNSPECIFIED;
}

