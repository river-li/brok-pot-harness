var SandAutoReviewPendingApprovalError = class extends Error {
};
function sameAutoReviewModes(a, b2) {
  const modesOfB = new Map(Object.entries(b2));
  return Object.entries(a).every(([surface, mode]) => modesOfB.get(surface) === mode);
}
function createAutoReviewGate(deps) {
  let lastSeenModes;
  return {
    currentModes() {
      const modes = deps.getModes?.() ?? deps.baseModes;
      const retiredSurfaces = /* @__PURE__ */ new Set();
      if (modes.hostShell !== "enforce") {
        retiredSurfaces.add("host_shell");
      }
      if (modes.boxShell !== "enforce") {
        retiredSurfaces.add("box_shell");
      }
      if (modes.mcp !== "enforce") {
        retiredSurfaces.add("mcp");
      }
      if (modes.computer !== "enforce") {
        retiredSurfaces.add("computer");
      }
      if (modes.automationWrite !== "enforce") {
        retiredSurfaces.add("automation_write");
      }
      if (modes.cloudAgent !== "enforce") {
        retiredSurfaces.add("cloud_agent");
      }
      if (modes.subagentLaunch !== "enforce") {
        retiredSurfaces.add("subagent");
      }
      if (lastSeenModes !== void 0 && !sameAutoReviewModes(lastSeenModes, modes)) {
        retiredSurfaces.add("feedback");
        retiredSurfaces.add("bot_share");
      }
      lastSeenModes = modes;
      deps.controller()?.expireSurfaces(retiredSurfaces);
      return modes;
    },
    assertNoPendingApproval() {
      const pending = deps.controller()?.getPendingApprovals() ?? [];
      if (pending.length > 0) {
        throw new SandAutoReviewPendingApprovalError(
          "Another action is waiting for Auto-review approval; no new side effect may start yet."
        );
      }
    },
    userInstructions() {
      const instructions = deps.getInstructions?.();
      if (instructions === void 0 || instructions.allowInstructions.length === 0 && instructions.blockInstructions.length === 0) {
        return void 0;
      }
      return {
        allowInstructions: [...instructions.allowInstructions],
        blockInstructions: [...instructions.blockInstructions]
      };
    }
  };
}
