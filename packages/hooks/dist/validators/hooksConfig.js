/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/hooks/dist/validators/hooksConfig.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var validateCommonHookProperties = (value, errors) => {
  var _a19;
  if (value.matcher !== void 0) {
    if (!isString2(value.matcher)) {
      errors.push("Hook script matcher must be a string if provided");
    } else if (value.matcher !== "" && value.matcher !== "*") {
      try {
        new RegExp(value.matcher);
      } catch (e) {
        errors.push(`Hook script matcher "${value.matcher}" is not a valid regex: ${(_a19 = e === null || e === void 0 ? void 0 : e.message) !== null && _a19 !== void 0 ? _a19 : String(e)}`);
      }
    }
  }
  if (value.timeout !== void 0) {
    if (typeof value.timeout !== "number") {
      errors.push("Hook script timeout must be a number (seconds)");
    } else if (value.timeout <= 0) {
      errors.push("Hook script timeout must be a positive number");
    } else if (value.timeout > 3600) {
      console.warn(`[hooks] Hook timeout of ${value.timeout}s is very long (>1 hour)`);
    }
  }
  if (value.loop_limit !== void 0) {
    const limit = value.loop_limit;
    if (limit !== null) {
      if (typeof limit !== "number") {
        errors.push("Hook script loop_limit must be a positive integer or null");
      } else if (!Number.isInteger(limit)) {
        errors.push("Hook script loop_limit must be an integer");
      } else if (limit <= 0) {
        errors.push("Hook script loop_limit must be a positive integer (use null for no limit)");
      }
    }
  }
  if (value.failClosed !== void 0) {
    if (typeof value.failClosed !== "boolean") {
      errors.push("Hook script failClosed must be a boolean");
    }
  }
};
var validateCommandHookScript = (value, errors) => {
  if (!isString2(value.command)) {
    errors.push("Hook script command must be a string");
  }
};
var validatePromptHookScript = (value, errors) => {
  if (!isString2(value.prompt)) {
    errors.push("Prompt hook must have a 'prompt' property (string)");
  } else if (value.prompt.trim() === "") {
    errors.push("Prompt hook 'prompt' property cannot be empty");
  }
  if (value.model !== void 0) {
    if (!isString2(value.model)) {
      errors.push("Prompt hook 'model' must be a string if provided");
    } else if (value.model.trim() === "") {
      errors.push("Prompt hook 'model' cannot be an empty string");
    }
  }
};
var validateHookScript = (value) => {
  const errors = [];
  if (!isObject2(value)) {
    errors.push(`Hook script must be an object with either a 'command' property (command hook) or 'type: "prompt"' with a 'prompt' property (prompt hook)`);
    return createValidationResult(false, errors);
  }
  const hookType = value.type;
  if (hookType === "prompt") {
    validatePromptHookScript(value, errors);
  } else if (hookType === "command" || hookType === void 0) {
    validateCommandHookScript(value, errors);
  } else {
    errors.push(`Invalid hook type: "${hookType}". Must be "command", "prompt", or omitted (defaults to "command")`);
  }
  validateCommonHookProperties(value, errors);
  return createValidationResult(errors.length === 0, errors);
};
var validateHookScriptArray = (value, hookName) => {
  const errors = [];
  if (!Array.isArray(value)) {
    errors.push(`${hookName} must be an array of hook scripts`);
    return createValidationResult(false, errors);
  }
  for (let i = 0; i < value.length; i++) {
    const scriptValidation = validateHookScript(value[i]);
    if (!scriptValidation.isValid) {
      errors.push(`${hookName}[${i}]: ${scriptValidation.errors.join(", ")}`);
    }
  }
  return createValidationResult(errors.length === 0, errors);
};
var validateHooksConfig = (value) => {
  const errors = [];
  if (!isObject2(value)) {
    errors.push("Hooks config must be an object");
    return createValidationResult(false, errors);
  }
  if (typeof value.version !== "number") {
    errors.push("Config version must be a number");
  } else if (!Number.isInteger(value.version) || value.version < 1) {
    errors.push("Config version must be a positive integer");
  }
  if (!isObject2(value.hooks)) {
    errors.push("Config hooks must be an object");
    return createValidationResult(false, errors);
  }
  if (value.stop_hook_loop_limit !== void 0) {
    console.warn("[hooks] DEPRECATION WARNING: 'stop_hook_loop_limit' is deprecated. Use 'loop_limit' on individual hook scripts instead. The configured value is being ignored.");
  }
  const validHookTypes = Object.values(HookStep);
  const hooks = value.hooks;
  for (const [hookName, hookValue] of Object.entries(hooks)) {
    if (!validHookTypes.includes(hookName)) {
      errors.push(`Unknown hook type: ${hookName}. Valid types are: ${validHookTypes.join(", ")}`);
      continue;
    }
    if (hookValue !== void 0) {
      const arrayValidation = validateHookScriptArray(hookValue, hookName);
      if (!arrayValidation.isValid) {
        errors.push(...arrayValidation.errors);
      }
    }
  }
  return createValidationResult(errors.length === 0, errors);
};

