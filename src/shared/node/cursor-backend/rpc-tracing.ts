function resolveTraceDecision() {
  if (configured === void 0) return void 0;
  try {
    if (activeTraceWindow !== void 0) {
      const tracer2 = configured.getTracer(RPC_ROOT_SAMPLER);
      if (tracer2 === void 0) return void 0;
      return { tracer: tracer2, parentContext: activeTraceWindow.parentContext };
    }
    const policy = configured.getPolicy?.() ?? { enabled: true, sampleRatio: 1 };
    if (!policy.enabled || Math.random() >= policy.sampleRatio) return void 0;
    const tracer = configured.getTracer(RPC_ROOT_SAMPLER);
    if (tracer === void 0) return void 0;
    return { tracer, parentContext: void 0 };
  } catch {
    return void 0;
  }
}
function pinRequestId(header) {
  const pinned = header.get("x-request-id");
  if (pinned != null && pinned !== "") return pinned;
  const minted = globalThis.crypto.randomUUID();
  header.set("x-request-id", minted);
  return minted;
}
function spanTraceparent(span) {
  const spanContext = span.spanContext();
  if (!trace.isSpanContextValid(spanContext)) return void 0;
  const flags = (spanContext.traceFlags & 1) === 1 ? "01" : "00";
  return `00-${spanContext.traceId}-${spanContext.spanId}-${flags}`;
}
function injectTraceparent(header, span) {
  const traceparent = spanTraceparent(span);
  if (traceparent === void 0) return;
  header.set("traceparent", traceparent);
}
function createSandRpcTracingInterceptor() {
  return (next) => async (req) => {
    if (UNTRACED_SERVICE_TYPE_NAMES.has(req.service.typeName)) {
      return await next(req);
    }
    const decision = resolveTraceDecision();
    if (decision === void 0) {
      return await next(req);
    }
    const requestId2 = pinRequestId(req.header);
    const span = decision.tracer.startSpan(
      `${req.service.typeName}/${req.method.name}`,
      {
        kind: SpanKind2.CLIENT,
        attributes: {
          "rpc.system": "connectrpc",
          "rpc.service": req.service.typeName,
          "rpc.method": req.method.name,
          "sand.rpc.request_streaming": req.stream,
          "sand.request_id": requestId2,
          ...configured?.sessionId !== void 0 ? { "sand.session_id": configured.sessionId } : {}
        }
      },
      decision.parentContext
    );
    injectTraceparent(req.header, span);
    try {
      const response = await next(req);
      span.setAttribute(
        "sand.rpc.bounded_at",
        response.stream ? "response-stream-start" : "response-complete"
      );
      span.end();
      return response;
    } catch (error42) {
      const label = (() => {
        if (error42 instanceof ConnectError) return Code[error42.code];
        if (error42 instanceof Error) return error42.name;
        return typeof error42;
      })();
      if (error42 instanceof ConnectError) {
        span.setAttribute("rpc.connect_rpc.error_code", label);
      }
      span.setStatus({ code: SpanStatusCode.ERROR, message: label });
      span.end();
      throw error42;
    }
  };
}
var import_sdk_trace_node, UNTRACED_SERVICE_TYPE_NAMES, RPC_ROOT_SAMPLER, SAND_RPC_TRACE_WINDOW_DURATION_MS, traceWindowExpiry, configured, activeTraceWindow;
var init_rpc_tracing = __esm({
  "src/shared/node/cursor-backend/rpc-tracing.ts"() {
    "use strict";
    init_scheduling();
    init_esm2();
    init_esm4();
    import_sdk_trace_node = __toESM(require_src6(), 1);
    UNTRACED_SERVICE_TYPE_NAMES = /* @__PURE__ */ new Set(["aiserver.v1.AnalyticsService"]);
    RPC_ROOT_SAMPLER = new import_sdk_trace_node.AlwaysOnSampler();
    SAND_RPC_TRACE_WINDOW_DURATION_MS = 2 * 60 * 1e3;
    traceWindowExpiry = createExpiryPolicy({
      name: "sand-rpc-trace-window",
      ttlMs: SAND_RPC_TRACE_WINDOW_DURATION_MS
    });
  }
});
