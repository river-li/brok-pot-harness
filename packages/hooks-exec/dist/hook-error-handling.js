var __awaiter34 = function(thisArg, _arguments, P2, generator) {
  function adopt(value) {
    return value instanceof P2 ? value : new P2(function(resolve29) {
      resolve29(value);
    });
  }
  return new (P2 || (P2 = Promise))(function(resolve29, reject2) {
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
      result.done ? resolve29(result.value) : adopt(result.value).then(fulfilled, rejected3);
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
  return __awaiter34(this, void 0, void 0, function* () {
    try {
      return yield fn();
    } catch (error41) {
      const errorMessage6 = error41 instanceof Error ? error41.message : String(error41);
      const reason = createHookFailClosedMessage(actionDescription, errorMessage6);
      throw new FailClosedError(reason, error41);
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
function createHookDenialMessage(actionDescription, userMessage2) {
  const baseMessage = userMessage2 ? `${actionDescription} was blocked by a hook: ${userMessage2}` : `${actionDescription} was blocked by a hook.`;
  return appendAgentDenialNote(`${baseMessage}

${HOOK_SETTINGS_HINT}`);
}
function createHookFailClosedMessage(actionDescription, errorMessage6) {
  const action = actionDescription !== null && actionDescription !== void 0 ? actionDescription : "Action";
  const errorDetail = errorMessage6 ? `: ${errorMessage6}` : ".";
  const baseMessage = `${action} was blocked because a configured hook failed to execute${errorDetail}

This is a safety measure (fail-closed) - when hooks cannot be evaluated, the action is blocked to prevent potentially unsafe operations.`;
  return `${baseMessage}

${HOOK_SETTINGS_HINT}`;
}
