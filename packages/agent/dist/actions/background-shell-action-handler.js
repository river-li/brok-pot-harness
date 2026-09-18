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
