/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/subagents/combined-computer-use.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function selectionReason(args) {
  if (args.desktopAvailable !== true) return "no_desktop";
  if (args.boxAvailable !== true) return "box_unavailable";
  if (!args.toolsAvailable) return "tools_disabled";
  return "selected";
}
function createCombinedComputerUseSelection(options2) {
  let decision;
  let runStartedAtMs;
  const now = options2.now ?? Date.now;
  const toolsAvailable = !options2.disabledToolIdentifiers?.some(
    (id) => id.startsWith("BROWSER_") || id === "OPENAI_COMPUTER_USE" || id === "SHELL" || id === "READ"
  );
  return {
    peek: () => decision?.selected,
    peekDecision: () => decision,
    read: () => {
      if (decision !== void 0) return decision.selected;
      const selectedAtMs = now();
      const desktopAvailable = options2.remoteBoxHasDesktop === true;
      const boxAvailable = desktopAvailable === true ? options2.getRemoteBoxAvailable?.() !== false : "not_evaluated";
      const reason = selectionReason({
        desktopAvailable,
        boxAvailable,
        toolsAvailable
      });
      decision = Object.freeze({
        selected: reason === "selected",
        gateEnabled: true,
        desktopAvailable,
        boxAvailable,
        toolsAvailable,
        reason,
        selectedAtMs,
        runStartedAtMs
      });
      return decision.selected;
    },
    reset: () => {
      decision = void 0;
      runStartedAtMs = now();
    }
  };
}

