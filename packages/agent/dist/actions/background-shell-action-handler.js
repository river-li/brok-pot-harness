/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/actions/background-shell-action-handler.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var NoOpSideChannelActionHandler = class {
  async handle(ctx, _action, _rootPromptExecutor, stateHandler, _mcpTools, _onStateUpdate) {
    return stateHandler.computeNewStructure(ctx);
  }
  async handleSingleStep(ctx, _action, _rootPromptExecutor, stateHandler, _mcpTools, _onStateUpdate) {
    return {
      state: await stateHandler.computeNewStructure(ctx),
      hasToolCall: false
    };
  }
};
var BackgroundShellActionHandler = class extends NoOpSideChannelActionHandler {
};

