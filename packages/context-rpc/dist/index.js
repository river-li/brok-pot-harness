/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/context-rpc/dist/index.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_dist4();
init_esm2();
init_esm4();
var __awaiter72 = function(thisArg, _arguments, P2, generator) {
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
var callerContextKey = createContextKey(void 0, {
  description: "anysphere.callerContext"
});
function isAsyncIterable2(value) {
  return value !== null && typeof value === "object" && Symbol.asyncIterator in value;
}
function isPromiseLike2(value) {
  return value !== null && typeof value === "object" && "then" in value && typeof value.then === "function";
}
function wrapAsyncIterableWithSpan(iterable, span, cleanupSignalListener) {
  return {
    [Symbol.asyncIterator]() {
      const iterator = iterable[Symbol.asyncIterator]();
      let finished = false;
      const finish = (error42) => {
        if (finished)
          return;
        finished = true;
        if (error42) {
          span === null || span === void 0 ? void 0 : span.recordException(error42 instanceof Error ? error42 : new Error(String(error42)));
          span === null || span === void 0 ? void 0 : span.setStatus({
            code: SpanStatusCode.ERROR,
            message: error42 instanceof Error ? error42.message : "Stream failed"
          });
        } else {
          span === null || span === void 0 ? void 0 : span.setStatus({ code: SpanStatusCode.OK });
        }
        span === null || span === void 0 ? void 0 : span.end();
        cleanupSignalListener === null || cleanupSignalListener === void 0 ? void 0 : cleanupSignalListener();
      };
      return {
        next() {
          return __awaiter72(this, void 0, void 0, function* () {
            try {
              const result = yield iterator.next();
              if (result.done) {
                finish();
              }
              return result;
            } catch (error42) {
              finish(error42);
              throw error42;
            }
          });
        },
        return(value) {
          return __awaiter72(this, void 0, void 0, function* () {
            finish();
            if (iterator.return) {
              return iterator.return(value);
            }
            return { done: true, value: void 0 };
          });
        },
        throw(error42) {
          return __awaiter72(this, void 0, void 0, function* () {
            finish(error42);
            if (iterator.throw) {
              return iterator.throw(error42);
            }
            throw error42;
          });
        }
      };
    }
  };
}
function extractTraceHeaders(ctx) {
  var _a19;
  var _b2;
  const headers = new Headers();
  try {
    const span = getSpan2(ctx);
    const spanContext = (_a19 = span === null || span === void 0 ? void 0 : span.spanContext) === null || _a19 === void 0 ? void 0 : _a19.call(span);
    if ((spanContext === null || spanContext === void 0 ? void 0 : spanContext.traceId) && spanContext.spanId) {
      const traceFlags = (_b2 = spanContext.traceFlags) !== null && _b2 !== void 0 ? _b2 : 0;
      const headerValue = `00-${spanContext.traceId}-${spanContext.spanId}-${traceFlags.toString(16).padStart(2, "0")}`;
      headers.set("traceparent", headerValue);
      headers.set("backend-traceparent", headerValue);
      if (spanContext.traceState) {
        const traceState = typeof spanContext.traceState.serialize === "function" ? spanContext.traceState.serialize() : String(spanContext.traceState);
        headers.set("tracestate", traceState);
      }
    }
  } catch (_c2) {
  }
  return headers;
}
function mergeHeaders(...sources) {
  const merged = new Headers();
  for (const src of sources) {
    if (!src)
      continue;
    if (src instanceof Headers) {
      src.forEach((v2, k2) => {
        merged.set(k2, v2);
      });
    } else {
      Object.entries(src).forEach(([k2, v2]) => {
        merged.set(k2, v2);
      });
    }
  }
  return merged;
}
function addContextPropagation(client, options2) {
  const { injectTraceHeaders = true, extractHeaders } = options2;
  return new Proxy(client, {
    get(target, prop) {
      const original = target[prop];
      if (typeof original !== "function")
        return original;
      return (ctx, input, callOptions = {}) => {
        var _a19;
        const spanCtx = withSpan(ctx.withName(`rpc.${String(prop)}`), {
          kind: SpanKind2.CLIENT,
          attributes: {
            "rpc.method": String(prop),
            "rpc.system": "connect"
          }
        });
        const span = getSpan2(spanCtx);
        let cleanupSignalListener;
        try {
          let contextHeaders;
          if (injectTraceHeaders) {
            contextHeaders = extractTraceHeaders(spanCtx);
          }
          if (extractHeaders) {
            const extra = extractHeaders(spanCtx);
            if (extra)
              contextHeaders = mergeHeaders(contextHeaders, extra);
          }
          const finalHeaders = mergeHeaders(callOptions.headers, contextHeaders);
          const { signal, cleanup } = options2.enableAbortSignal === true ? mergeContextSignal(spanCtx.signal, callOptions.signal) : { signal: callOptions.signal, cleanup: void 0 };
          cleanupSignalListener = cleanup;
          const contextValues = ((_a19 = callOptions.contextValues) !== null && _a19 !== void 0 ? _a19 : createContextValues()).set(callerContextKey, spanCtx);
          const enhancedOptions = Object.assign(Object.assign({}, callOptions), {
            headers: finalHeaders,
            signal,
            contextValues
          });
          const result = original.call(target, input, enhancedOptions);
          if (isAsyncIterable2(result)) {
            return wrapAsyncIterableWithSpan(result, span, cleanupSignalListener);
          }
          if (isPromiseLike2(result)) {
            return result.then((res) => {
              if (isAsyncIterable2(res)) {
                return wrapAsyncIterableWithSpan(res, span, cleanupSignalListener);
              }
              span === null || span === void 0 ? void 0 : span.setStatus({ code: SpanStatusCode.OK });
              span === null || span === void 0 ? void 0 : span.end();
              cleanupSignalListener === null || cleanupSignalListener === void 0 ? void 0 : cleanupSignalListener();
              return res;
            }).catch((error42) => {
              span === null || span === void 0 ? void 0 : span.recordException(error42 instanceof Error ? error42 : new Error(String(error42)));
              span === null || span === void 0 ? void 0 : span.setStatus({
                code: SpanStatusCode.ERROR,
                message: error42 instanceof Error ? error42.message : "RPC call failed"
              });
              span === null || span === void 0 ? void 0 : span.end();
              cleanupSignalListener === null || cleanupSignalListener === void 0 ? void 0 : cleanupSignalListener();
              throw error42;
            });
          } else {
            span === null || span === void 0 ? void 0 : span.setStatus({ code: SpanStatusCode.OK });
            span === null || span === void 0 ? void 0 : span.end();
            cleanupSignalListener === null || cleanupSignalListener === void 0 ? void 0 : cleanupSignalListener();
            return result;
          }
        } catch (error42) {
          span === null || span === void 0 ? void 0 : span.recordException(error42 instanceof Error ? error42 : new Error(String(error42)));
          span === null || span === void 0 ? void 0 : span.setStatus({
            code: SpanStatusCode.ERROR,
            message: error42 instanceof Error ? error42.message : "RPC call failed"
          });
          span === null || span === void 0 ? void 0 : span.end();
          cleanupSignalListener === null || cleanupSignalListener === void 0 ? void 0 : cleanupSignalListener();
          throw error42;
        }
      };
    }
  });
}
function mergeContextSignal(ctxSignal, providedSignal) {
  if (providedSignal === void 0 || providedSignal === ctxSignal) {
    return {
      signal: ctxSignal
    };
  }
  const controller = new AbortController();
  const abortFromContext = () => {
    controller.abort(ctxSignal.reason);
  };
  const abortFromProvided = () => {
    controller.abort(providedSignal.reason);
  };
  ctxSignal.addEventListener("abort", abortFromContext, { once: true });
  providedSignal.addEventListener("abort", abortFromProvided, { once: true });
  if (ctxSignal.aborted) {
    abortFromContext();
  } else if (providedSignal.aborted) {
    abortFromProvided();
  }
  const cleanup = () => {
    ctxSignal.removeEventListener("abort", abortFromContext);
    providedSignal.removeEventListener("abort", abortFromProvided);
  };
  return {
    signal: controller.signal,
    cleanup
  };
}
function createContextPropagatingClient(service, transport, options2 = {}) {
  const base = createClient(service, transport);
  return addContextPropagation(base, options2);
}

