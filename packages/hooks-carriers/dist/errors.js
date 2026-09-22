/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/hooks-carriers/dist/errors.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var HookAdditionalContextTooLargeError = class extends Error {
  constructor(params) {
    super(`Hook additional_context for ${params.hookEventName} is ${params.actualLength} chars (max ${params.maxLength}).`);
    this.name = "HookAdditionalContextTooLargeError";
    this.hookEventName = params.hookEventName;
    this.actualLength = params.actualLength;
    this.maxLength = params.maxLength;
  }
};

