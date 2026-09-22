/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/context/dist/logger.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function shouldUseColors(useColors) {
  var _a20;
  var _b2;
  if (typeof useColors === "boolean") {
    return useColors;
  }
  if (typeof process === "undefined") {
    return false;
  }
  const env = (_b2 = process.env) !== null && _b2 !== void 0 ? _b2 : {};
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
  return Boolean((_a20 = process.stdout) === null || _a20 === void 0 ? void 0 : _a20.isTTY);
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
function resolveRenderOptions(options2) {
  var _a20, _b2, _c2, _d, _e2, _f, _g;
  return {
    indent: " ".repeat((_a20 = options2.indent) !== null && _a20 !== void 0 ? _a20 : DEFAULT_INDENT),
    maxDepth: (_b2 = options2.maxDepth) !== null && _b2 !== void 0 ? _b2 : DEFAULT_MAX_DEPTH,
    maxEntries: (_c2 = options2.maxEntries) !== null && _c2 !== void 0 ? _c2 : DEFAULT_MAX_ENTRIES,
    maxArrayLength: (_d = options2.maxArrayLength) !== null && _d !== void 0 ? _d : DEFAULT_MAX_ARRAY_LENGTH,
    maxStringLength: (_e2 = options2.maxStringLength) !== null && _e2 !== void 0 ? _e2 : DEFAULT_MAX_STRING_LENGTH,
    includeTimestamp: (_f = options2.includeTimestamp) !== null && _f !== void 0 ? _f : true,
    includeContextPath: (_g = options2.includeContextPath) !== null && _g !== void 0 ? _g : true,
    inlineSerializer: options2.inlineSerializer
  };
}
function formatTimestamp(timestamp2) {
  return timestamp2.toISOString().slice(11, 23);
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
function applyInlineSerializer(value, options2, path30, depth) {
  if (!options2.inlineSerializer) {
    return value;
  }
  try {
    const serialized = options2.inlineSerializer(value, { path: path30, depth });
    return serialized === void 0 ? value : serialized;
  } catch (_a20) {
    return value;
  }
}
function formatInlineValue(value, options2, colors, depth, seen, path30) {
  var _a20;
  var _b2;
  const serialized = applyInlineSerializer(value, options2, path30, depth);
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
    const truncated = truncateString(value, options2.maxStringLength);
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
    const name17 = value.name ? ` ${value.name}` : "";
    return colors.dim(`[Function${name17}]`);
  }
  if (value instanceof Date) {
    const iso = Number.isNaN(value.getTime()) ? "Invalid Date" : value.toISOString();
    return colors.green(iso);
  }
  if (value instanceof RegExp) {
    return colors.cyan(value.toString());
  }
  if (isErrorLike(value)) {
    return formatErrorSummary(value, options2, colors, depth, seen, path30);
  }
  if (Array.isArray(value)) {
    return formatInlineArray(value, options2, colors, depth, seen, path30);
  }
  if (typeof ArrayBuffer !== "undefined" && value instanceof ArrayBuffer) {
    return colors.dim(`ArrayBuffer(${value.byteLength})`);
  }
  if (typeof ArrayBuffer !== "undefined" && typeof ArrayBuffer.isView === "function" && ArrayBuffer.isView(value)) {
    const typedArray = value;
    const label = (_b2 = (_a20 = typedArray.constructor) === null || _a20 === void 0 ? void 0 : _a20.name) !== null && _b2 !== void 0 ? _b2 : "TypedArray";
    return colors.dim(`${label}(${typedArray.byteLength})`);
  }
  if (value instanceof Map) {
    return formatInlineMap(value, options2, colors, depth, seen, path30);
  }
  if (value instanceof Set) {
    return formatInlineArray(Array.from(value.values()), options2, colors, depth, seen, path30);
  }
  return formatInlineObject(value, options2, colors, depth, seen, path30);
}
function formatErrorSummary(error3, options2, colors, depth, seen, path30) {
  const errorObj = error3;
  if (seen.has(errorObj)) {
    return colors.dim("[Circular]");
  }
  seen.add(errorObj);
  const name17 = typeof error3.name === "string" ? error3.name : "Error";
  const message = typeof error3.message === "string" ? error3.message : "";
  const summary = message ? `${name17}: ${message}` : name17;
  let result = colors.red(summary);
  if ("cause" in error3 && error3.cause !== void 0) {
    const causeValue = formatInlineValue(error3.cause, options2, colors, depth + 1, seen, path30.concat("cause"));
    result = `${result} ${colors.dim("cause=")}${causeValue}`;
  }
  seen.delete(errorObj);
  return result;
}
function formatInlineArray(value, options2, colors, depth, seen, path30) {
  if (depth >= options2.maxDepth) {
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
  const limit = Math.min(value.length, options2.maxArrayLength);
  const items = value.slice(0, limit).map((entry, index) => formatInlineValue(entry, options2, colors, depth + 1, seen, path30.concat(index)));
  if (value.length > limit) {
    items.push(colors.dim(`... ${value.length - limit} more`));
  }
  const separator = colors.dim(", ");
  const result = `${colors.dim("[")}${items.join(separator)}${colors.dim("]")}`;
  seen.delete(value);
  return result;
}
function formatInlineMap(value, options2, colors, depth, seen, path30) {
  if (depth >= options2.maxDepth) {
    return colors.dim(`Map(${value.size})`);
  }
  if (seen.has(value)) {
    return colors.dim("[Circular]");
  }
  seen.add(value);
  const entries = Array.from(value.entries());
  const limit = Math.min(entries.length, options2.maxEntries);
  const items = entries.slice(0, limit).map(([key, entryValue]) => {
    const keyValue = formatInlineValue(key, options2, colors, depth + 1, seen, path30.concat("<key>"));
    const renderedValue = formatInlineValue(entryValue, options2, colors, depth + 1, seen, path30.concat(String(key)));
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
function formatInlineObject(value, options2, colors, depth, seen, path30) {
  var _a20;
  var _b2;
  if (depth >= options2.maxDepth) {
    const label = (_b2 = (_a20 = value === null || value === void 0 ? void 0 : value.constructor) === null || _a20 === void 0 ? void 0 : _a20.name) !== null && _b2 !== void 0 ? _b2 : "Object";
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
  const limit = Math.min(entries.length, options2.maxEntries);
  const items = entries.slice(0, limit).map(([key, entryValue]) => {
    const renderedValue = formatInlineValue(entryValue, options2, colors, depth + 1, seen, path30.concat(key));
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
function createPrettyTerminalLoggerBackend(options2 = {}) {
  var _a20;
  const renderOptions = resolveRenderOptions(options2);
  const colors = createColorPalette(shouldUseColors(options2.useColors));
  const outputConsole = (_a20 = options2.console) !== null && _a20 !== void 0 ? _a20 : console;
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
        const path30 = entry.context.getPath();
        if (path30.length > 0) {
          parts.push(colors.dim(`ctx=${path30.join("/")}`));
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
function getLoggerBackend(ctx) {
  return ctx.get(loggerKey);
}
function createLogger(name17) {
  function log4(ctx, entry) {
    const timestamp2 = /* @__PURE__ */ new Date();
    const logger108 = getLoggerBackend(ctx);
    logger108.log(ctx, Object.assign(Object.assign({}, entry), { timestamp: timestamp2, logger: name17 }));
  }
  return {
    debug: (ctx, message, metadata) => {
      log4(ctx, { level: "debug", message, context: ctx, metadata });
    },
    info: (ctx, message, metadata) => {
      log4(ctx, { level: "info", message, context: ctx, metadata });
    },
    warn: (ctx, message, metadata) => {
      log4(ctx, { level: "warn", message, context: ctx, metadata });
    },
    error: (ctx, message, error3, metadata) => {
      log4(ctx, { level: "error", message, context: ctx, error: error3, metadata });
    }
  };
}
function createLoggerMiddleware(backend, attributes) {
  return {
    log: (ctx, entry) => {
      backend.log(ctx, Object.assign(Object.assign({}, entry), { metadata: Object.assign(Object.assign({}, attributes), entry.metadata) }));
    }
  };
}
function withLogAttributes(ctx, attributes) {
  return ctx.with(loggerKey, createLoggerMiddleware(ctx.get(loggerKey), Object.assign({}, attributes)));
}
var DEFAULT_INDENT, DEFAULT_MAX_DEPTH, DEFAULT_MAX_ENTRIES, DEFAULT_MAX_ARRAY_LENGTH, DEFAULT_MAX_STRING_LENGTH, defaultLoggerBackendImpl, defaultLoggerBackend, loggerKey;
var init_logger = __esm({
  "../packages/context/dist/logger.js"() {
    "use strict";
    init_dist();
    DEFAULT_INDENT = 2;
    DEFAULT_MAX_DEPTH = 6;
    DEFAULT_MAX_ENTRIES = 50;
    DEFAULT_MAX_ARRAY_LENGTH = 40;
    DEFAULT_MAX_STRING_LENGTH = 200;
    defaultLoggerBackendImpl = createPrettyTerminalLoggerBackend();
    defaultLoggerBackend = {
      log: (ctx, entry) => defaultLoggerBackendImpl.log(ctx, entry)
    };
    loggerKey = createKey(/* @__PURE__ */ Symbol("loggerBackend"), defaultLoggerBackend);
  }
});

