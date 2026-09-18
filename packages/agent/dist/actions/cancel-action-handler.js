var CancelActionHandler = class {
  constructor(config2, resourceAccessor, interactionListener, summarizationHandler, conversationActionReceiver) {
    this.config = config2;
    this.resourceAccessor = resourceAccessor;
    this.interactionListener = interactionListener;
    this.summarizationHandler = summarizationHandler;
    this.conversationActionReceiver = conversationActionReceiver;
  }
  async handle(_ctx, _action, _rootPromptExecutor, _stateHandler, _mcpTools, _onStateUpdate) {
    throw new Error("Cancel Conversation action should never be routed directly to runStream!");
  }
};
