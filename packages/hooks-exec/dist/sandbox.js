init_sandbox_pb();
function isSandboxed(policy) {
  if (!policy) {
    return false;
  }
  return policy.type !== SandboxPolicy_Type.INSECURE_NONE && policy.type !== SandboxPolicy_Type.UNSPECIFIED;
}
