/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/context/dist/logger.js
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var DEFAULT_INDENT = 2;
var DEFAULT_MAX_DEPTH = 6;
var DEFAULT_MAX_ENTRIES = 50;
var DEFAULT_MAX_ARRAY_LENGTH = 40;
var DEFAULT_MAX_STRING_LENGTH = 200;
function shouldUseColors(useColors) {
  var _a;
  var _b;
  if (typeof useColors === "boolean") {
    return useColors;
  }
  if (typeof process === "undefined") {
    return false;
  }
  const env = (_b = process.env) !== null && _b !== void 0 ? _b : {};
  if ("NO_COLOR" in env) {
    return false;
  }
  if (env.TERM === "dumb") {
    return false;
  }
  const forceColor = env.FORCE_COLOR;
  if (forceColor === "1" || forceColor === "true") {
    return true;
  }
  if (forceColor === "0") {
    return false;
  }
  return Boolean((_a = process.stdout) === null || _a === void 0 ? void 0 : _a.isTTY);
}
function createColorPalette(enabled) {
  const reset = "\x1B[0m";
  const withCodes = (codes) => (value) => enabled ? `\x1B[${codes.join(";")}m${value}${reset}` : value;
  const dim = withCodes([2]);
  const gray = withCodes([90]);
  const red = withCodes([31]);
  const green = withCodes([32]);
  const yellow = withCodes([33]);
  const blue = withCodes([34]);
  const magenta = withCodes([35]);
  const cyan = withCodes([36]);
  const bold = withCodes([1]);
  const boldRed = withCodes([1, 31]);
  return {
    dim,
    gray,
    red,
    green,
    yellow,
    blue,
    magenta,
    cyan,
    bold,
    level: (level, value) => {
      switch (level) {
        case "debug":
          return magenta(value);
        case "info":
          return blue(value);
        case "warn":
          return yellow(value);
        case "error":
          return boldRed(value);
        default: {
          const _exhaustiveCheck = level;
          return _exhaustiveCheck;
        }
      }
    }
  };
}
function resolveRenderOptions(options) {
  var _a, _b, _c, _d, _e, _f, _g;
  return {
    indent: " ".repeat((_a = options.indent) !== null && _a !== void 0 ? _a : DEFAULT_INDENT),
    maxDepth: (_b = options.maxDepth) !== null && _b !== void 0 ? _b : DEFAULT_MAX_DEPTH,
    maxEntries: (_c = options.maxEntries) !== null && _c !== void 0 ? _c : DEFAULT_MAX_ENTRIES,
    maxArrayLength: (_d = options.maxArrayLength) !== null && _d !== void 0 ? _d : DEFAULT_MAX_ARRAY_LENGTH,
    maxStringLength: (_e = options.maxStringLength) !== null && _e !== void 0 ? _e : DEFAULT_MAX_STRING_LENGTH,
    includeTimestamp: (_f = options.includeTimestamp) !== null && _f !== void 0 ? _f : true,
    includeContextPath: (_g = options.includeContextPath) !== null && _g !== void 0 ? _g : true,
    inlineSerializer: options.inlineSerializer
  };
}
function formatTimestamp(timestamp) {
  return timestamp.toISOString().slice(11, 23);
}
function isContext(value) {
  return typeof value === "object" && value !== null && "getPath" in value && typeof value.getPath === "function";
}
function isErrorLike(value) {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  return "message" in value || "stack" in value || "name" in value || "cause" in value;
}
function isInlineSummary(value) {
  return typeof value === "object" && value !== null && value.kind === "summary" && typeof value.summary === "string";
}
function truncateString(value, maxLength) {
  if (value.length <= maxLength) {
    return value;
  }
  return `${value.slice(0, maxLength)}...`;
}
function applyInlineSerializer(value, options, path, depth) {
  if (!options.inlineSerializer) {
    return value;
  }
  try {
    const serialized = options.inlineSerializer(value, { path, depth });
    return serialized === void 0 ? value : serialized;
  } catch (_a) {
    return value;
  }
}
function formatInlineValue(value, options, colors, depth, seen, path) {
  var _a;
  var _b;
  const serialized = applyInlineSerializer(value, options, path, depth);
  if (isInlineSummary(serialized)) {
    return colors.dim(`<${serialized.summary}>`);
  }
  value = serialized;
  if (value === null) {
    return colors.gray("null");
  }
  if (value === void 0) {
    return colors.gray("undefined");
  }
  if (typeof value === "string") {
    const truncated = truncateString(value, options.maxStringLength);
    return colors.green(JSON.stringify(truncated));
  }
  if (typeof value === "number") {
    return colors.yellow(String(value));
  }
  if (typeof value === "boolean") {
    return colors.magenta(String(value));
  }
  if (typeof value === "bigint") {
    return colors.yellow(`${value}n`);
  }
  if (typeof value === "symbol") {
    return colors.cyan(value.toString());
  }
  if (typeof value === "function") {
    const name = value.name ? ` ${value.name}` : "";
    return colors.dim(`[Function${name}]`);
  }
  if (value instanceof Date) {
    const iso = Number.isNaN(value.getTime()) ? "Invalid Date" : value.toISOString();
    return colors.green(iso);
  }
  if (value instanceof RegExp) {
    return colors.cyan(value.toString());
  }
  if (isErrorLike(value)) {
    return formatErrorSummary(value, options, colors, depth, seen, path);
  }
  if (Array.isArray(value)) {
    return formatInlineArray(value, options, colors, depth, seen, path);
  }
  if (typeof ArrayBuffer !== "undefined" && value instanceof ArrayBuffer) {
    return colors.dim(`ArrayBuffer(${value.byteLength})`);
  }
  if (typeof ArrayBuffer !== "undefined" && typeof ArrayBuffer.isView === "function" && ArrayBuffer.isView(value)) {
    const typedArray = value;
    const label = (_b = (_a = typedArray.constructor) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : "TypedArray";
    return colors.dim(`${label}(${typedArray.byteLength})`);
  }
  if (value instanceof Map) {
    return formatInlineMap(value, options, colors, depth, seen, path);
  }
  if (value instanceof Set) {
    return formatInlineArray(Array.from(value.values()), options, colors, depth, seen, path);
  }
  return formatInlineObject(value, options, colors, depth, seen, path);
}
function formatErrorSummary(error, options, colors, depth, seen, path) {
  const errorObj = error;
  if (seen.has(errorObj)) {
    return colors.dim("[Circular]");
  }
  seen.add(errorObj);
  const name = typeof error.name === "string" ? error.name : "Error";
  const message = typeof error.message === "string" ? error.message : "";
  const summary = message ? `${name}: ${message}` : name;
  let result = colors.red(summary);
  if ("cause" in error && error.cause !== void 0) {
    const causeValue = formatInlineValue(error.cause, options, colors, depth + 1, seen, path.concat("cause"));
    result = `${result} ${colors.dim("cause=")}${causeValue}`;
  }
  seen.delete(errorObj);
  return result;
}
function formatInlineArray(value, options, colors, depth, seen, path) {
  if (depth >= options.maxDepth) {
    return colors.dim(`[Array(${value.length})]`);
  }
  if (seen.has(value)) {
    return colors.dim("[Circular]");
  }
  seen.add(value);
  if (value.length === 0) {
    const empty = colors.dim("[]");
    seen.delete(value);
    return empty;
  }
  const limit = Math.min(value.length, options.maxArrayLength);
  const items = value.slice(0, limit).map((entry, index) => formatInlineValue(entry, options, colors, depth + 1, seen, path.concat(index)));
  if (value.length > limit) {
    items.push(colors.dim(`... ${value.length - limit} more`));
  }
  const separator = colors.dim(", ");
  const result = `${colors.dim("[")}${items.join(separator)}${colors.dim("]")}`;
  seen.delete(value);
  return result;
}
function formatInlineMap(value, options, colors, depth, seen, path) {
  if (depth >= options.maxDepth) {
    return colors.dim(`Map(${value.size})`);
  }
  if (seen.has(value)) {
    return colors.dim("[Circular]");
  }
  seen.add(value);
  const entries = Array.from(value.entries());
  const limit = Math.min(entries.length, options.maxEntries);
  const items = entries.slice(0, limit).map(([key, entryValue]) => {
    const keyValue = formatInlineValue(key, options, colors, depth + 1, seen, path.concat("<key>"));
    const renderedValue = formatInlineValue(entryValue, options, colors, depth + 1, seen, path.concat(String(key)));
    return `${keyValue} ${colors.dim("=>")} ${renderedValue}`;
  });
  if (entries.length > limit) {
    items.push(colors.dim(`... ${entries.length - limit} more`));
  }
  const separator = colors.dim(", ");
  const result = `${colors.dim("Map{")}${items.join(separator)}${colors.dim("}")}`;
  seen.delete(value);
  return result;
}
function formatInlineObject(value, options, colors, depth, seen, path) {
  var _a;
  var _b;
  if (depth >= options.maxDepth) {
    const label = (_b = (_a = value === null || value === void 0 ? void 0 : value.constructor) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : "Object";
    return colors.dim(`[${label}]`);
  }
  if (seen.has(value)) {
    return colors.dim("[Circular]");
  }
  seen.add(value);
  const entries = Object.entries(value);
  if (entries.length === 0) {
    const empty = colors.dim("{}");
    seen.delete(value);
    return empty;
  }
  const limit = Math.min(entries.length, options.maxEntries);
  const items = entries.slice(0, limit).map(([key, entryValue]) => {
    const renderedValue = formatInlineValue(entryValue, options, colors, depth + 1, seen, path.concat(key));
    return `${colors.cyan(key)}: ${renderedValue}`;
  });
  if (entries.length > limit) {
    items.push(colors.dim(`... ${entries.length - limit} more`));
  }
  const separator = colors.dim(", ");
  const result = `${colors.dim("{")}${items.join(separator)}${colors.dim("}")}`;
  seen.delete(value);
  return result;
}
function createPrettyTerminalLoggerBackend(options = {}) {
  var _a;
  const renderOptions = resolveRenderOptions(options);
  const colors = createColorPalette(shouldUseColors(options.useColors));
  const outputConsole = (_a = options.console) !== null && _a !== void 0 ? _a : console;
  return {
    log: (_ctx, entry) => {
      const parts = [];
      if (renderOptions.includeTimestamp) {
        parts.push(colors.dim(formatTimestamp(entry.timestamp)));
      }
      const levelLabel = entry.level.toUpperCase().padEnd(5);
      parts.push(colors.level(entry.level, levelLabel));
      const message = entry.level === "error" ? colors.bold(entry.message) : entry.message;
      parts.push(message);
      if (renderOptions.includeContextPath && isContext(entry.context)) {
        const path = entry.context.getPath();
        if (path.length > 0) {
          parts.push(colors.dim(`ctx=${path.join("/")}`));
        }
      }
      const seen = /* @__PURE__ */ new WeakSet();
      if (!isContext(entry.context) && entry.context && Object.keys(entry.context).length > 0) {
        const contextValue = formatInlineValue(entry.context, renderOptions, colors, 0, seen, [
          "context"
        ]);
        parts.push(`${colors.dim("context=")}${contextValue}`);
      }
      if (entry.metadata && Object.keys(entry.metadata).length > 0) {
        const metaValue = formatInlineValue(entry.metadata, renderOptions, colors, 0, seen, [
          "metadata"
        ]);
        parts.push(`${colors.dim("meta=")}${metaValue}`);
      }
      const outputLines = [parts.join(" ")];
      if (entry.error !== void 0) {
        const errorValue = isErrorLike(entry.error) ? formatErrorSummary(entry.error, renderOptions, colors, 0, seen, ["error"]) : formatInlineValue(entry.error, renderOptions, colors, 0, seen, ["error"]);
        outputLines[0] = `${outputLines[0]} ${colors.dim("error=")}${errorValue}`;
        if (isErrorLike(entry.error) && typeof entry.error.stack === "string") {
          const stackLines = entry.error.stack.split("\n").slice(1);
          for (const line of stackLines) {
            const trimmed = line.trim();
            if (trimmed) {
              outputLines.push(`${renderOptions.indent}${colors.dim(trimmed)}`);
            }
          }
        }
      }
      const output = outputLines.join("\n");
      switch (entry.level) {
        case "debug":
        case "info":
          outputConsole.log(output);
          break;
        case "warn":
          outputConsole.warn(output);
          break;
        case "error":
          outputConsole.error(output);
          break;
        default: {
          const _exhaustiveCheck = entry.level;
          throw new Error(`Unhandled log level: ${_exhaustiveCheck}`);
        }
      }
    }
  };
}
var defaultLoggerBackendImpl = createPrettyTerminalLoggerBackend();
var defaultLoggerBackend = {
  log: (ctx, entry) => defaultLoggerBackendImpl.log(ctx, entry)
};
var loggerKey = createKey(/* @__PURE__ */ Symbol("loggerBackend"), defaultLoggerBackend);
function getLoggerBackend(ctx) {
  return ctx.get(loggerKey);
}
function createLogger(name) {
  function log(ctx, entry) {
    const timestamp = /* @__PURE__ */ new Date();
    const logger7 = getLoggerBackend(ctx);
    logger7.log(ctx, Object.assign(Object.assign({}, entry), { timestamp, logger: name }));
  }
  return {
    debug: (ctx, message, metadata) => {
      log(ctx, { level: "debug", message, context: ctx, metadata });
    },
    info: (ctx, message, metadata) => {
      log(ctx, { level: "info", message, context: ctx, metadata });
    },
    warn: (ctx, message, metadata) => {
      log(ctx, { level: "warn", message, context: ctx, metadata });
    },
    error: (ctx, message, error, metadata) => {
      log(ctx, { level: "error", message, context: ctx, error, metadata });
    }
  };
}

