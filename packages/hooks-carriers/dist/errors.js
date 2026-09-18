var HookAdditionalContextTooLargeError = class extends Error {
  constructor(params) {
    super(`Hook additional_context for ${params.hookEventName} is ${params.actualLength} chars (max ${params.maxLength}).`);
    this.name = "HookAdditionalContextTooLargeError";
    this.hookEventName = params.hookEventName;
    this.actualLength = params.actualLength;
    this.maxLength = params.maxLength;
  }
};
