var BasePromptBuilder = class {
  constructor(initialMessages) {
    this.messages = [];
    if (initialMessages) {
      if (Array.isArray(initialMessages)) {
        this.messages = [...initialMessages];
      } else {
        this.messages = [initialMessages];
      }
    }
  }
  appendMessages(newMessages) {
    const messagesToAdd = Array.isArray(newMessages) ? newMessages : [newMessages];
    this.messages.push(...messagesToAdd);
    return this;
  }
  getState() {
    return [...this.messages];
  }
  getMessages() {
    return [...this.messages];
  }
  clearMessages() {
    this.messages = [];
  }
};
var BasePromptExecutor = class {
  constructor(builder) {
    this.builder = builder;
  }
  appendMessages(messages2) {
    this.builder.appendMessages(messages2);
    return this;
  }
  getState() {
    return this.builder.getState();
  }
  getMessages() {
    return this.builder.getMessages();
  }
  clearMessages() {
    this.builder.clearMessages();
  }
};
var BaseMiddleware = class {
  constructor(innerExecutor) {
    this.innerExecutor = innerExecutor;
  }
  appendMessages(messages2) {
    this.innerExecutor.appendMessages(messages2);
    return this;
  }
  getState() {
    return this.innerExecutor.getState();
  }
  getMessages() {
    return this.innerExecutor.getMessages();
  }
  clearMessages() {
    this.innerExecutor.clearMessages();
  }
  stream(ctx, invocationId, tools, options2) {
    return this.innerExecutor.stream(ctx, invocationId, tools, options2);
  }
};
