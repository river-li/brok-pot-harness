/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/hooks-exec/dist/hook-error-handling.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __awaiter43 = function(thisArg, _arguments, P2, generator) {
  function adopt(value) {
    return value instanceof P2 ? value : new P2(function(resolve14) {
      resolve14(value);
    });
  }
  return new (P2 || (P2 = Promise))(function(resolve14, reject2) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject2(e);
      }
    }
    function rejected3(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject2(e);
      }
    }
    function step(result) {
      result.done ? resolve14(result.value) : adopt(result.value).then(fulfilled, rejected3);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var HookDeniedError = class extends Error {
  constructor(reason) {
    super(`Hook denied: ${reason}`);
    this.failureType = "permission_denied";
    this.name = "HookDeniedError";
    this.reason = reason;
  }
};
var FailClosedError = class extends Error {
  constructor(reason, cause) {
    super(`Hook failed (fail-closed): ${reason}`);
    this.failureType = "error";
    this.name = "FailClosedError";
    this.reason = reason;
    this.cause = cause;
  }
};
function withFailClosed(fn, actionDescription) {
  return __awaiter43(this, void 0, void 0, function* () {
    try {
      return yield fn();
    } catch (error3) {
      const errorMessage4 = error3 instanceof Error ? error3.message : String(error3);
      const reason = createHookFailClosedMessage(actionDescription, errorMessage4);
      throw new FailClosedError(reason, error3);
    }
  });
}
var HOOK_SETTINGS_HINT = "To view or modify configured hooks, go to Cursor Settings > Hooks.";
var HOOK_DENIAL_AGENT_NOTE = "Agent note: Do not suggest workarounds to the blocked tool.";
function appendAgentDenialNote(message) {
  if (message.includes(HOOK_DENIAL_AGENT_NOTE)) {
    return message;
  }
  return `${message}

${HOOK_DENIAL_AGENT_NOTE}`;
}
function createHookDenialMessage(actionDescription, userMessage) {
  const baseMessage = userMessage ? `${actionDescription} was blocked by a hook: ${userMessage}` : `${actionDescription} was blocked by a hook.`;
  return appendAgentDenialNote(`${baseMessage}

${HOOK_SETTINGS_HINT}`);
}
function createHookFailClosedMessage(actionDescription, errorMessage4) {
  const action = actionDescription !== null && actionDescription !== void 0 ? actionDescription : "Action";
  const errorDetail = errorMessage4 ? `: ${errorMessage4}` : ".";
  const baseMessage = `${action} was blocked because a configured hook failed to execute${errorDetail}

This is a safety measure (fail-closed) - when hooks cannot be evaluated, the action is blocked to prevent potentially unsafe operations.`;
  return `${baseMessage}

${HOOK_SETTINGS_HINT}`;
}

