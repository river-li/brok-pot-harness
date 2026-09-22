/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/core/edit/canvas-post-edit-diagnostics.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
var import_node_path86 = require("node:path");

// @recovered-fragment 2/2
init_canvas_diagnostics_exec_pb();
init_diagnostics_exec_pb();
var TIMEOUT = /* @__PURE__ */ Symbol("canvasPostEditDiagnosticsTimeout");
var SINGLE_LINE_SANITIZER = /[\s\u0000-\u001F\u007F]+/g;
async function runCanvasPostEditDiagnostics(ctx, executor, filePath, timeoutMs, toolCallId) {
  let timeoutId;
  const timeoutPromise = new Promise((resolve29) => {
    timeoutId = setTimeout(() => resolve29(TIMEOUT), timeoutMs);
  });
  try {
    const raced = await Promise.race([
      executor.execute(ctx, new CanvasDiagnosticsArgs({ path: filePath, toolCallId })),
      timeoutPromise
    ]);
    if (raced === TIMEOUT) {
      return "Canvas validation timed out; if this save targeted a canvas, re-save the file to confirm its status and path.";
    }
    let tsText;
    if (raced.result.case === "success") {
      const { path: path31, diagnostics } = raced.result.value;
      const filtered = diagnostics.filter((d) => d.severity === DiagnosticSeverity.ERROR || d.severity === DiagnosticSeverity.WARNING);
      tsText = filtered.length === 0 ? "Canvas TypeScript check: no errors." : formatCanvasDiagnostics(path31, filtered);
    }
    const saveText = formatCanvasSaveFooter(raced, filePath);
    if (tsText === void 0) {
      return saveText;
    }
    if (saveText === void 0) {
      return tsText;
    }
    return `${tsText}

${saveText}`;
  } catch {
    return void 0;
  } finally {
    if (timeoutId !== void 0)
      clearTimeout(timeoutId);
  }
}
function formatCanvasSaveFooter(result, filePath) {
  const state = singleLine(result.saveState, 100);
  if (state === void 0) {
    return void 0;
  }
  const title = singleLine(result.title, 200);
  const detail = singleLine(result.saveDetail, 500);
  switch (state) {
    case "pending": {
      const lines2 = [
        "Canvas save accepted: validation passed; the canvas publishes asynchronously."
      ];
      if (title !== void 0) {
        lines2.push(`Canvas title: ${title}`);
      }
      const parsedCanvasId = parseCloudCanvasId(result.canvasId ?? "");
      if (parsedCanvasId.ok) {
        lines2.push(`Canvas path: ${storeCanvasSourcePath(filePath, parsedCanvasId.value)}`);
      }
      if (detail !== void 0) {
        lines2.push(`Canvas note: ${detail}`);
      }
      return lines2.join("\n");
    }
    case "invalid_path":
      return detail === void 0 ? "Canvas not saved: this is not a valid canvas save path; nothing was published." : `Canvas not saved: ${detail}`;
    case "unavailable":
      return detail === void 0 ? "Canvas not saved: the user agent store is unavailable; nothing was published." : `Canvas not saved: ${detail}`;
    case "too_large":
      return detail === void 0 ? "Canvas not saved: the canvas source exceeds the size limit; nothing was published." : `Canvas not saved: ${detail}`;
    case "typecheck_failed":
      return detail === void 0 ? "Canvas not saved: the type check failed; nothing was published." : `Canvas not saved: ${detail}`;
    case "compile_failed":
      return detail === void 0 ? "Canvas not saved: the canvas failed to compile; nothing was published." : `Canvas not saved: ${detail}`;
    default:
      return `Canvas save state: ${state}.${detail === void 0 ? "" : ` ${detail}`}`;
  }
}
function storeCanvasSourcePath(savedFilePath, canvasId) {
  const resolved = import_node_path86.posix.resolve(savedFilePath);
  for (const canvasesRoot of CANVAS_STORE_PERSIST_ROOTS) {
    if (resolved === formatStoreCanvasSourcePath(canvasesRoot, canvasId)) {
      return resolved;
    }
  }
  return formatUserStoreCanvasSourcePath(canvasId);
}
function singleLine(value, maxLength) {
  const sanitized = value?.replace(SINGLE_LINE_SANITIZER, " ").trim();
  if (sanitized === void 0 || sanitized.length === 0) {
    return void 0;
  }
  return sanitized.length > maxLength ? `${sanitized.slice(0, maxLength)}\u2026` : sanitized;
}
function formatCanvasDiagnostics(path31, diagnostics) {
  const lines2 = [
    `Canvas TypeScript check: ${diagnostics.length} issue${diagnostics.length > 1 ? "s" : ""} in ${path31}:`
  ];
  for (const d of diagnostics) {
    const severity = d.severity === DiagnosticSeverity.WARNING ? "WARNING" : "ERROR";
    const line = d.range?.start?.line ?? 0;
    const column = d.range?.start?.column ?? 0;
    const source = d.source ? ` (${d.source})` : "";
    lines2.push(`  [${severity}] L${line}:${column} - ${d.message}${source}`);
  }
  return lines2.join("\n");
}

