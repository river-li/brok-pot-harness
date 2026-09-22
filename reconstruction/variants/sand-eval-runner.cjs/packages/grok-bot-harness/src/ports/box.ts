/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/ports/box.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_dist();

// @recovered-fragment 2/2
var sandBoxPullProgressKey = createKey(/* @__PURE__ */ Symbol("sand.box.pull-progress"), void 0);
var sandBackgroundWorkRegistryKey = createKey(
  /* @__PURE__ */ Symbol("sand.box.background-work-registry"),
  void 0
);
var SAND_BOX_NOT_READY_MESSAGE = "The computer is still starting up. Try again in a moment.";
var SAND_BOX_NOT_RESPONDING_MESSAGE = `The computer isn't responding. Try again in a moment, or run [Update ${SAND_PRODUCT_DISPLAY_NAME}'s Computer](${buildSandSettingsDeepLinkUrl("update-computer")}).`;
var SAND_BOX_NO_MONITOR_AVAILABLE_MESSAGE = "All screens on the shared computer are in use. Try again in a moment.";
var SAND_BOX_HIBERNATED_MESSAGE = "The computer is asleep and this step did not wake it. Use a box tool (Shell, Read, Ls) to wake it, then try again.";
var SandBoxNotReadyError = class extends Error {
  errorKind;
  constructor(errorKind, message, options2) {
    super(message, options2);
    this.name = "SandBoxNotReadyError";
    this.errorKind = errorKind;
  }
};
var SandBoxDaemonUnreachableError = class extends Error {
  outcome;
  constructor(outcome, message, options2) {
    super(message, options2);
    this.name = "SandBoxDaemonUnreachableError";
    this.outcome = outcome;
  }
};
function isSandBoxHibernatedError(error3) {
  return error3 instanceof SandBoxDaemonUnreachableError && error3.outcome === "hibernated";
}
var SandBoxNoMonitorAvailableError = class extends Error {
  constructor(message = "No private desktop monitor is available on the shared box.") {
    super(message);
    this.name = "SandBoxNoMonitorAvailableError";
  }
};
function boxNotReadyReasonForError(error3) {
  if (error3 instanceof SandBoxNoMonitorAvailableError) {
    return {
      errorKind: "box_no_monitor_available",
      message: SAND_BOX_NO_MONITOR_AVAILABLE_MESSAGE
    };
  }
  if (isSandBoxHibernatedError(error3)) {
    return { errorKind: "box_hibernated", message: SAND_BOX_HIBERNATED_MESSAGE };
  }
  if (error3 instanceof SandBoxDaemonUnreachableError && (error3.outcome === "timeout" || error3.outcome === "crash")) {
    return {
      errorKind: "box_not_responding",
      message: SAND_BOX_NOT_RESPONDING_MESSAGE
    };
  }
  return { errorKind: "box_starting", message: SAND_BOX_NOT_READY_MESSAGE };
}
var noMonitorComputerUseExecutor = {
  async execute() {
    throw new SandBoxNoMonitorAvailableError();
  }
};
function isNoMonitorComputerUseExecutor(executor) {
  return executor === noMonitorComputerUseExecutor;
}
var SAND_BOX_PRIMARY_WINDOW_INDEX = 1;
var SAND_BOX_FIRST_FORK_WINDOW_INDEX = SAND_BOX_PRIMARY_WINDOW_INDEX + 1;
var BoxMcpUnsupportedError = class extends Error {
  constructor() {
    super("This box does not support running MCP servers.");
    this.name = "BoxMcpUnsupportedError";
  }
};

