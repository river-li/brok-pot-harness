var SubscriptionNotificationActionHandler = class {
  constructor(userMessageActionHandler) {
    this.userMessageActionHandler = userMessageActionHandler;
  }
  getUserMessageActionHandler() {
    return this.userMessageActionHandler;
  }
  async handle(ctx, action, rootPromptExecutor, stateHandler, mcpTools, onStateUpdate) {
    return await this.userMessageActionHandler.handle(ctx, adaptSubscriptionNotificationAction(action), rootPromptExecutor, stateHandler, mcpTools, onStateUpdate, delegateOptions(action));
  }
  async handleSingleStep(ctx, action, rootPromptExecutor, stateHandler, mcpTools, onStateUpdate) {
    return await this.userMessageActionHandler.handleSingleStep(ctx, adaptSubscriptionNotificationAction(action), rootPromptExecutor, stateHandler, mcpTools, onStateUpdate, delegateOptions(action));
  }
  async handleModelStep(ctx, action, rootPromptExecutor, stateHandler, mcpTools, onStateUpdate) {
    return await this.userMessageActionHandler.handleModelStep(ctx, adaptSubscriptionNotificationAction(action), rootPromptExecutor, stateHandler, mcpTools, onStateUpdate, delegateOptions(action));
  }
};
function delegateOptions(action) {
  return {
    forcePrependedUserMessages: true,
    maxPrependedUserMessages: action.notifications.length
  };
}
function adaptSubscriptionNotificationAction(action) {
  for (const notification of action.notifications) {
    ensureUserMessageTiming(notification);
  }
  const userMessage2 = action.notifications.at(-1);
  if (userMessage2 === void 0) {
    throw new Error("Subscription notification action requires at least one notification");
  }
  return createRedactedUserMessageAction(action._privacyMode, {
    userMessage: userMessage2,
    prependUserMessages: action.notifications.slice(0, -1),
    requestContext: action.requestContext,
    sendToInteractionListener: action.sendToInteractionListener
  });
}
