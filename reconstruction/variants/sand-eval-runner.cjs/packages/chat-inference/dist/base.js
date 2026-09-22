/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/chat-inference/dist/base.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
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
  appendMessages(messages) {
    this.builder.appendMessages(messages);
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
  appendMessages(messages) {
    this.innerExecutor.appendMessages(messages);
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

