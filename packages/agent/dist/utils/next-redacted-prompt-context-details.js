/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/utils/next-redacted-prompt-context-details.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_dist4();

// @recovered-fragment 2/2
var __addDisposableResource22 = function(env, value, async) {
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
var __disposeResources22 = /* @__PURE__ */ (function(SuppressedError2) {
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
function nextRedactedPromptContextDetails(ctx, config2, stateHandler, params) {
  const env_1 = { stack: [], error: void 0, hasError: false };
  try {
    const spanCtxt = __addDisposableResource22(env_1, createSpan(ctx.withName("nextRedactedPromptContextDetails")), false);
    const tracedCtx = spanCtxt.ctx;
    const previousRedacted = stateHandler.tokenDetails.breakdown;
    const previousUsageTree = stateHandler.tokenDetails.promptContextUsageTree;
    const promptContextUsageTreeEnabled = config2.featureFlags?.promptContextUsageTree === true;
    spanCtxt.span.setAttribute("promptContextUsageTreeEnabled", promptContextUsageTreeEnabled);
    const previousSnapshot = previousRedacted ? fromRedactedPromptTokenBreakdownSnapshot(previousRedacted, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED) : void 0;
    const breakdownSnapshot = buildPromptTokenBreakdownSnapshot(tracedCtx, {
      ...params,
      previousSnapshot
    });
    const privacyMode = stateHandler.getPrivacyMode();
    return {
      breakdown: toRedactedPromptTokenBreakdownSnapshot(breakdownSnapshot, privacyMode),
      promptContextUsageTree: promptContextUsageTreeEnabled ? toRedactedPromptContextUsageTree(buildPromptContextUsageTree({
        messages: params.messages,
        tools: params.tools,
        descriptionProps: params.descriptionProps,
        breakdown: breakdownSnapshot
      }), privacyMode) : previousUsageTree
    };
  } catch (e_1) {
    env_1.error = e_1;
    env_1.hasError = true;
  } finally {
    __disposeResources22(env_1);
  }
}

