/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/canvas/tools.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_agent_pb();
init_cloud_canvas_tool_pb();
init_dist3();
init_zod();
var WRITE_CANVAS_TOOL_NAME = "WriteCanvas";
var READ_CANVAS_TOOL_NAME = "ReadCanvas";
function errorMessage4(error42) {
  return error42 instanceof Error ? error42.message : String(error42);
}
var writeCanvasParametersSchema = external_exports.object({
  contents: external_exports.string().describe("The full source of the canvas \u2014 one self-contained React `.canvas.tsx` module. Overwrites the whole canvas; send the complete file, not a patch."),
  canvas_id: external_exports.string().optional().describe("Omit to create a new canvas. Pass the id of an existing canvas in this run's store to overwrite it in place."),
  title: external_exports.string().optional().describe("Human-readable title. Provide it when creating a new canvas. Omit to keep an existing canvas's title.")
});
var readCanvasParametersSchema = external_exports.object({
  canvas_id: external_exports.string().optional().describe("The id of a canvas in this run's store to read. When both `canvas_id` and `url` are provided they must name the same canvas id; the url's storeId is used for the read."),
  url: external_exports.string().optional().describe("A canonical https://cursor.com/canvas/<storeId>/<canvasId> canvas url. Use this to read a canvas in another store or from a share link. A malformed url is ignored when `canvas_id` is present; if both resolve they must name the same canvas id and this url's storeId is used for the read.")
});
function wrapWriteToolCall(toolCall) {
  return new ToolCall({
    tool: { case: "writeCanvasToolCall", value: toolCall }
  });
}
function wrapReadToolCall(toolCall) {
  return new ToolCall({
    tool: { case: "readCanvasToolCall", value: toolCall }
  });
}
function toToolDiagnostic(diagnostic) {
  return new CloudCanvasToolDiagnostic({
    message: diagnostic.message,
    ...diagnostic.code !== void 0 ? { code: diagnostic.code } : {},
    ...diagnostic.severity !== void 0 ? { severity: diagnostic.severity } : {},
    ...diagnostic.range !== void 0 ? {
      range: new CloudCanvasToolDiagnosticRange({
        start: new CloudCanvasToolDiagnosticPosition({
          line: diagnostic.range.start.line,
          character: diagnostic.range.start.character
        }),
        end: new CloudCanvasToolDiagnosticPosition({
          line: diagnostic.range.end.line,
          character: diagnostic.range.end.character
        })
      })
    } : {}
  });
}
function mapWriteFailReason(reason) {
  switch (reason) {
    case "typecheck_failed":
      return WriteCanvasFailReason.TYPECHECK_FAILED;
    case "compile_failed":
      return WriteCanvasFailReason.COMPILE_FAILED;
    case "too_large":
      return WriteCanvasFailReason.TOO_LARGE;
    case "unavailable":
      return WriteCanvasFailReason.UNAVAILABLE;
    case "not_found":
      return WriteCanvasFailReason.NOT_FOUND;
    case "refused":
      return WriteCanvasFailReason.REFUSED;
    default: {
      const _exhaustive = reason;
      return WriteCanvasFailReason.UNAVAILABLE;
    }
  }
}
function toWriteResult(result) {
  if (result.ok) {
    return new WriteCanvasResult({
      result: {
        case: "success",
        value: new WriteCanvasSuccess({
          canvasId: result.canvasId,
          ...result.title !== void 0 ? { title: result.title } : {},
          url: result.url
        })
      }
    });
  }
  return new WriteCanvasResult({
    result: {
      case: "failure",
      value: new WriteCanvasFailure({
        reason: mapWriteFailReason(result.reason),
        diagnostics: (result.diagnostics ?? []).map(toToolDiagnostic),
        ...result.detail !== void 0 ? { detail: result.detail } : {}
      })
    }
  });
}
function writeFailureResult(reason, detail) {
  return new WriteCanvasResult({
    result: {
      case: "failure",
      value: new WriteCanvasFailure({
        reason,
        ...detail !== void 0 ? { detail } : {}
      })
    }
  });
}
function mapReadFailReason(reason) {
  switch (reason) {
    case "not_found":
      return ReadCanvasFailReason.NOT_FOUND;
    case "unavailable":
      return ReadCanvasFailReason.UNAVAILABLE;
    case "refused":
      return ReadCanvasFailReason.REFUSED;
    default: {
      const _exhaustive = reason;
      return ReadCanvasFailReason.UNAVAILABLE;
    }
  }
}
function toReadResult(result) {
  if (result.ok) {
    return new ReadCanvasResult({
      result: {
        case: "success",
        value: new ReadCanvasSuccess({
          canvasId: result.canvasId,
          ...result.title !== void 0 ? { title: result.title } : {},
          url: result.url,
          source: result.source
        })
      }
    });
  }
  return new ReadCanvasResult({
    result: {
      case: "failure",
      value: new ReadCanvasFailure({
        reason: mapReadFailReason(result.reason),
        ...result.detail !== void 0 ? { detail: result.detail } : {}
      })
    }
  });
}
function readFailureResult(reason, detail) {
  return new ReadCanvasResult({
    result: {
      case: "failure",
      value: new ReadCanvasFailure({
        reason,
        ...detail !== void 0 ? { detail } : {}
      })
    }
  });
}
function describeWriteFailReason(reason) {
  switch (reason) {
    case WriteCanvasFailReason.TYPECHECK_FAILED:
      return "the canvas source did not type-check";
    case WriteCanvasFailReason.COMPILE_FAILED:
      return "the canvas source did not compile";
    case WriteCanvasFailReason.TOO_LARGE:
      return "the canvas source is too large";
    case WriteCanvasFailReason.NOT_FOUND:
      return "no canvas with that id exists in this run's store";
    case WriteCanvasFailReason.REFUSED:
      return "the store owner or privacy settings refused the write";
    case WriteCanvasFailReason.UNAVAILABLE:
    case WriteCanvasFailReason.UNSPECIFIED:
      return "the canvas service was unavailable";
    default: {
      const _exhaustive = reason;
      return "the canvas service was unavailable";
    }
  }
}
function describeReadFailReason(reason) {
  switch (reason) {
    case ReadCanvasFailReason.NOT_FOUND:
      return "no canvas was found for that reference";
    case ReadCanvasFailReason.REFUSED:
      return "access to that canvas was refused";
    case ReadCanvasFailReason.INVALID_REFERENCE:
      return "the canvas reference was invalid";
    case ReadCanvasFailReason.UNAVAILABLE:
    case ReadCanvasFailReason.UNSPECIFIED:
      return "the canvas service was unavailable";
    default: {
      const _exhaustive = reason;
      return "the canvas service was unavailable";
    }
  }
}
function renderWriteResult(result) {
  const value = result.result;
  if (value.case === "success") {
    const success2 = value.value;
    const title = success2.title !== void 0 && success2.title.length > 0 ? success2.title : "Untitled canvas";
    return [
      `Canvas saved: "${title}".`,
      `URL: ${success2.url}`,
      `Reference it to the user as a markdown link: [${title}](${success2.url}).`
    ].join("\n");
  }
  if (value.case === "failure") {
    const failure2 = value.value;
    if (isWriteArgValidationDetail(failure2.detail)) {
      return [
        `Canvas was not saved: ${failure2.detail}`,
        "No url was produced; do not present a canvas link to the user."
      ].join("\n");
    }
    const lines2 = [`Canvas was not saved: ${describeWriteFailReason(failure2.reason)}.`];
    if (failure2.detail !== void 0 && failure2.detail.length > 0) {
      lines2.push(failure2.detail);
    }
    for (const diagnostic of failure2.diagnostics) {
      const start = diagnostic.range?.start;
      const where = start !== void 0 ? ` (line ${start.line + 1}, col ${start.character + 1})` : "";
      lines2.push(`- ${diagnostic.message}${where}`);
    }
    lines2.push("No url was produced; do not present a canvas link to the user.");
    return lines2.join("\n");
  }
  return "Canvas was not saved: the canvas service was unavailable.";
}
function renderReadResult(result) {
  const value = result.result;
  if (value.case === "success") {
    const success2 = value.value;
    const title = success2.title !== void 0 && success2.title.length > 0 ? success2.title : "Untitled canvas";
    return [`Canvas "${title}" (${success2.url}):`, "", success2.source].join("\n");
  }
  if (value.case === "failure") {
    const failure2 = value.value;
    if (failure2.reason === ReadCanvasFailReason.INVALID_REFERENCE && failure2.detail !== void 0 && failure2.detail.length > 0) {
      return `Could not read canvas: ${failure2.detail}`;
    }
    const detail = failure2.detail !== void 0 && failure2.detail.length > 0 ? ` ${failure2.detail}` : "";
    return `Could not read canvas: ${describeReadFailReason(failure2.reason)}.${detail}`;
  }
  return "Could not read canvas: the canvas service was unavailable.";
}
var INVALID_CANVAS_URL_DETAIL = "The url is not a canonical https://cursor.com/canvas/<storeId>/<canvasId> canvas link.";
var MISSING_CANVAS_REFERENCE_DETAIL = "Provide a canvas_id or a canonical canvas url.";
var DISAGREEING_CANVAS_REFERENCE_DETAIL = "canvas_id and url refer to different canvases; they must resolve to the same canvas.";
function optionalNonEmpty(value) {
  if (value === void 0) {
    return void 0;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : void 0;
}
function resolveReadArgs(parsedArgs) {
  const canvasId = optionalNonEmpty(parsedArgs.canvas_id);
  const url2 = optionalNonEmpty(parsedArgs.url);
  if (url2 === void 0) {
    if (canvasId === void 0) {
      return { ok: false, detail: MISSING_CANVAS_REFERENCE_DETAIL };
    }
    return { ok: true, canvasId };
  }
  const link = parseCloudCanvasWebLink(url2);
  if (link === void 0) {
    if (canvasId !== void 0) {
      return { ok: true, canvasId };
    }
    return { ok: false, detail: INVALID_CANVAS_URL_DETAIL };
  }
  if (canvasId !== void 0) {
    if (canvasId.toLowerCase() !== link.canvasId) {
      return { ok: false, detail: DISAGREEING_CANVAS_REFERENCE_DETAIL };
    }
    return { ok: true, canvasId, storeId: link.storeId };
  }
  return {
    ok: true,
    canvasId: link.canvasId,
    storeId: link.storeId
  };
}
function isWriteArgValidationDetail(detail) {
  return detail !== void 0 && detail.startsWith("Invalid arguments:");
}
function serializeWriteToolError(error42) {
  if (error42 instanceof ToolCallArgParseError) {
    const detail = isWriteArgValidationDetail(error42.message) ? error42.message : `Invalid arguments:
${error42.message}`;
    return writeFailureResult(WriteCanvasFailReason.REFUSED, detail);
  }
  return writeFailureResult(WriteCanvasFailReason.UNAVAILABLE, errorMessage4(error42));
}
function buildWriteCanvasTool(port) {
  const render2 = async (_ctx, result, _props) => createStringResult(renderWriteResult(result));
  return createZodAgentTool("WRITE_CANVAS", {
    name: WRITE_CANVAS_TOOL_NAME,
    descriptionGenerator: () => "Create or update a Cursor canvas \u2014 a self-contained React `.canvas.tsx` app persisted in this run's store. Provide `title` to create a new canvas, or `canvas_id` to overwrite an existing one; `contents` is always the full source. On success returns the canvas url to share with the user as a markdown link. On failure returns the reason and any type-check diagnostics, and no url.",
    parameters: writeCanvasParametersSchema,
    execute: withSafeParsedArgs(writeCanvasParametersSchema, async (ctx, interactionHandler, parsedArgs, meta) => {
      const argsProto = new WriteCanvasArgs({
        contents: parsedArgs.contents,
        ...parsedArgs.canvas_id !== void 0 ? { canvasId: parsedArgs.canvas_id } : {},
        ...parsedArgs.title !== void 0 ? { title: parsedArgs.title } : {}
      });
      return await interactionHandler.executeToolCall(ctx, wrapWriteToolCall(new WriteCanvasToolCall({ args: argsProto })), meta.toolCallId, async () => {
        try {
          const result = await port.write({
            source: parsedArgs.contents,
            ...parsedArgs.canvas_id !== void 0 ? { canvasId: parsedArgs.canvas_id } : {},
            ...parsedArgs.title !== void 0 ? { title: parsedArgs.title } : {}
          });
          return toWriteResult(result);
        } catch (error42) {
          if (error42 instanceof DeferredInteractionResponseError) {
            throw error42;
          }
          return writeFailureResult(WriteCanvasFailReason.UNAVAILABLE, errorMessage4(error42));
        }
      }, (result) => wrapWriteToolCall(new WriteCanvasToolCall({ args: argsProto, result })));
    }, wrapWriteToolCall(new WriteCanvasToolCall()), { emitInitialPartialToolCall: false }),
    render: render2,
    serializeError: (error42) => wrapWriteToolCall(new WriteCanvasToolCall({
      result: serializeWriteToolError(error42)
    }))
  });
}
function buildReadCanvasTool(port) {
  const render2 = async (_ctx, result, _props) => createStringResult(renderReadResult(result));
  return createZodAgentTool("READ_CANVAS", {
    name: READ_CANVAS_TOOL_NAME,
    descriptionGenerator: () => "Read the source of a Cursor canvas. Pass `canvas_id` for a canvas in this run's store, or a canonical https://cursor.com/canvas/<storeId>/<canvasId> `url` to read another store's canvas or a shared canvas. If both are provided they must name the same canvas id and the url's storeId is used for the read; a malformed url is ignored when `canvas_id` is present.",
    parameters: readCanvasParametersSchema,
    execute: withSafeParsedArgs(readCanvasParametersSchema, async (ctx, interactionHandler, parsedArgs, meta) => {
      const argsProto = new ReadCanvasArgs({
        ...parsedArgs.canvas_id !== void 0 ? { canvasId: parsedArgs.canvas_id } : {},
        ...parsedArgs.url !== void 0 ? { url: parsedArgs.url } : {}
      });
      return await interactionHandler.executeToolCall(ctx, wrapReadToolCall(new ReadCanvasToolCall({ args: argsProto })), meta.toolCallId, async () => {
        const readArgs = resolveReadArgs(parsedArgs);
        if (!readArgs.ok) {
          return readFailureResult(ReadCanvasFailReason.INVALID_REFERENCE, readArgs.detail);
        }
        try {
          const readResult = await port.read({
            canvasId: readArgs.canvasId,
            ...readArgs.storeId !== void 0 ? { storeId: readArgs.storeId } : {}
          });
          return toReadResult(readResult);
        } catch (error42) {
          if (error42 instanceof DeferredInteractionResponseError) {
            throw error42;
          }
          return readFailureResult(ReadCanvasFailReason.UNAVAILABLE, errorMessage4(error42));
        }
      }, (result) => wrapReadToolCall(new ReadCanvasToolCall({ args: argsProto, result })));
    }, wrapReadToolCall(new ReadCanvasToolCall()), { emitInitialPartialToolCall: false }),
    render: render2,
    serializeError: (error42) => wrapReadToolCall(new ReadCanvasToolCall({
      result: readFailureResult(ReadCanvasFailReason.UNAVAILABLE, errorMessage4(error42))
    }))
  });
}
function createCloudCanvasTools({ port }) {
  return [buildWriteCanvasTool(port), buildReadCanvasTool(port)];
}

