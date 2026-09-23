function createNonThrowingLogger(logger110) {
  return {
    error: (message, error42) => {
      try {
        logger110.error(message, error42);
      } catch (_a19) {
      }
    },
    warn: (message, error42) => {
      try {
        logger110.warn(message, error42);
      } catch (_a19) {
      }
    },
    info: (message, error42) => {
      try {
        logger110.info(message, error42);
      } catch (_a19) {
      }
    },
    debug: (message, error42) => {
      try {
        logger110.debug(message, error42);
      } catch (_a19) {
      }
    }
  };
}
function scopeLogger(logger110, component) {
  const prefix = `[${component}]`;
  return {
    error: (message, error42) => logger110.error(`${prefix} ${message}`, error42),
    warn: (message, error42) => logger110.warn(`${prefix} ${message}`, error42),
    info: (message, error42) => logger110.info(`${prefix} ${message}`, error42),
    debug: (message, error42) => logger110.debug(`${prefix} ${message}`, error42)
  };
}
function formatLogMessage(message, error42) {
  if (error42 === void 0) {
    return message;
  }
  return `${message}
${formatErrorValue(error42, /* @__PURE__ */ new Set(), 0, true)}`;
}
var MAX_ERROR_CAUSE_DEPTH = 8;
var MAX_AGGREGATE_ERROR_COUNT = 8;
var CIRCULAR_ERROR_CAUSE = "[Circular error cause]";
var TRUNCATED_ERROR_CAUSE = "[Error cause chain truncated]";
var TRUNCATED_AGGREGATE_ERRORS = "[Additional errors truncated]";
var NON_ERROR_OBJECT = "[Non-Error object thrown]";
var NON_ERROR_FUNCTION = "[Non-Error function thrown]";
function isPropertyBag(value) {
  return typeof value === "object" && value !== null;
}
function readProperty(value, key) {
  try {
    return value[key];
  } catch (_a19) {
    return void 0;
  }
}
function formatErrorValue(value, seen, depth, includeAggregateErrors) {
  if (typeof value === "function") {
    return NON_ERROR_FUNCTION;
  }
  if (!isPropertyBag(value)) {
    return String(value);
  }
  if (seen.has(value)) {
    return CIRCULAR_ERROR_CAUSE;
  }
  if (depth >= MAX_ERROR_CAUSE_DEPTH) {
    return TRUNCATED_ERROR_CAUSE;
  }
  seen.add(value);
  const stack = readProperty(value, "stack");
  const name17 = readProperty(value, "name");
  const message = readProperty(value, "message");
  const nonEmptyStack = typeof stack === "string" && stack.trim().length > 0 ? stack : void 0;
  const nonEmptyName = typeof name17 === "string" && name17.trim().length > 0 ? name17 : void 0;
  const nonEmptyMessage = typeof message === "string" && message.trim().length > 0 ? message : void 0;
  let description9;
  if (nonEmptyStack !== void 0) {
    description9 = nonEmptyStack;
  } else if (nonEmptyName !== void 0 && nonEmptyMessage !== void 0) {
    description9 = `${nonEmptyName}: ${nonEmptyMessage}`;
  } else if (nonEmptyMessage !== void 0) {
    description9 = nonEmptyMessage;
  } else if (nonEmptyName !== void 0) {
    description9 = nonEmptyName;
  } else if (typeof stack === "string" || typeof name17 === "string" || typeof message === "string") {
    description9 = "Error";
  } else {
    seen.delete(value);
    return NON_ERROR_OBJECT;
  }
  const parts = [description9];
  const errors = readProperty(value, "errors");
  if (includeAggregateErrors && Array.isArray(errors)) {
    const formattedErrors = errors.slice(0, MAX_AGGREGATE_ERROR_COUNT).map((error42, index) => `  ${index + 1}. ${formatErrorValue(error42, seen, depth + 1, false).replaceAll("\n", "\n     ")}`);
    if (errors.length > MAX_AGGREGATE_ERROR_COUNT) {
      formattedErrors.push(`  ${TRUNCATED_AGGREGATE_ERRORS}`);
    }
    if (formattedErrors.length > 0) {
      parts.push(`Contained errors:
${formattedErrors.join("\n")}`);
    }
  }
  const cause = readProperty(value, "cause");
  if (cause !== void 0) {
    parts.push(`Caused by: ${formatErrorValue(cause, seen, depth + 1, false)}`);
  }
  const formatted = parts.join("\n");
  seen.delete(value);
  return formatted;
}
