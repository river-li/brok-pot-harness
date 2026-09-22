var __addDisposableResource10 = function(env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
    var dispose, inner;
    if (async) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async) inner = dispose;
    }
    if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
    if (inner) dispose = function() {
      try {
        inner.call(this);
      } catch (e) {
        return Promise.reject(e);
      }
    };
    env.stack.push({ value, dispose, async });
  } else if (async) {
    env.stack.push({ async: true });
  }
  return value;
};
var __disposeResources10 = /* @__PURE__ */ (function(SuppressedError2) {
  return function(env) {
    function fail(e) {
      env.error = env.hasError ? new SuppressedError2(e, env.error, "An error was suppressed during disposal.") : e;
      env.hasError = true;
    }
    var r, s3 = 0;
    function next() {
      while (r = env.stack.pop()) {
        try {
          if (!r.async && s3 === 1) return s3 = 0, env.stack.push(r), Promise.resolve().then(next);
          if (r.dispose) {
            var result = r.dispose.call(r.value);
            if (r.async) return s3 |= 2, Promise.resolve(result).then(next, function(e) {
              fail(e);
              return next();
            });
          } else s3 |= 1;
        } catch (e) {
          fail(e);
        }
      }
      if (s3 === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
      if (env.hasError) throw env.error;
    }
    return next();
  };
})(typeof SuppressedError === "function" ? SuppressedError : function(error42, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error42, e.suppressed = suppressed, e;
});
var logger28 = createLogger("agent/tools/computer-use/anthropic");
function createAnthropicComputerTool(config2) {
  const coordinateConfig = {
    displayWidth: config2.displayWidthPx,
    displayHeight: config2.displayHeightPx
  };
  const computerToolVersion = "computer_20250124";
  const executeAction = async (parentCtx, interactionHandler, args, meta) => {
    const env_1 = { stack: [], error: void 0, hasError: false };
    try {
      const spanCtxt = __addDisposableResource10(env_1, createSpan(parentCtx.withName("computerUseExecute")), false);
      logger28.info(spanCtxt.ctx, "Executing computer action", {
        toolCallId: meta.toolCallId,
        action: args.action
      });
      const protoActions = anthropicAdapter.parseAction(args, coordinateConfig);
      const computerUseArgs = new ComputerUseArgs({
        toolCallId: meta.toolCallId,
        actions: protoActions
      });
      const baseToolCall = new ComputerUseToolCall({
        args: computerUseArgs,
        result: void 0
      });
      const result = await interactionHandler.executeToolCall(spanCtxt.ctx, createToolCallProto(baseToolCall), meta.toolCallId, async (ctx) => {
        const executionStartedAt = Date.now();
        let execResult;
        try {
          const computerUseExecutor = config2.resourceAccessor.get(computerUseExecutorResource);
          if (computerUseExecutor === void 0) {
            throw createComputerUseUnsupportedOnVmError();
          }
          execResult = await boundComputerUseScreenshot(ctx, await computerUseExecutor.execute(ctx, computerUseArgs, {
            execId: generateSeededUuid(meta.toolCallId),
            hookContextCollector: meta.hookContextCollector
          }));
        } catch (error42) {
          trackComputerUseFailure(ctx, {
            provider: "anthropic",
            input: computerUseArgs,
            durationMs: Date.now() - executionStartedAt
          });
          throw error42;
        }
        trackComputerUseExecution(ctx, {
          provider: "anthropic",
          input: computerUseArgs,
          output: execResult,
          durationMs: Date.now() - executionStartedAt
        });
        switch (execResult.result.case) {
          case "success":
            return execResult;
          case "error":
            throw new Error(execResult.result.value.error);
          default:
            throw new Error(`Unexpected result case: ${execResult.result.case}`);
        }
      }, (execResult) => createToolCallProto(new ComputerUseToolCall({
        args: computerUseArgs,
        result: execResult
      })), meta.hookContextCollector);
      return result;
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      __disposeResources10(env_1);
    }
  };
  return {
    // Provider-defined tool fields
    type: "provider-defined",
    id: `anthropic.${computerToolVersion}`,
    args: {
      displayWidthPx: config2.displayWidthPx,
      displayHeightPx: config2.displayHeightPx
    },
    // Tool definition fields
    toolIdentifier: "ANTHROPIC_COMPUTER_USE",
    name: "computer",
    // Minimal description - Claude already knows this tool from training.
    // Only add context-specific info.
    description: "Use a mouse and keyboard to interact with a computer screen. This is an interface to a desktop GUI. After actions, a screenshot will be returned.",
    // Note: convertTupleSchemaToDraft2020_12 outputs Draft 2020-12 schema (with prefixItems field),
    // but ai SDK's jsonSchema() expects JSONSchema7. The double cast reflects this mismatch.
    // Claude's API requires Draft 2020-12, which is what we actually send.
    parameters: jsonSchema(convertTupleSchemaToDraft2020_12(zodToJsonSchema(anthropicComputerInputSchema))),
    execute: withSafeParsedArgs(anthropicComputerInputSchema, executeAction, createToolCallProto(new ComputerUseToolCall())),
    serializeError: serializeComputerUseError,
    render: (ctx, output, props) => renderComputerUseResult(ctx, output, true, props)
  };
}
