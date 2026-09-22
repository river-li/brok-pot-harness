/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/context/dist/otel.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function getTracer(name17 = "context-tracer") {
  return trace.getTracer(name17);
}
function withSpan(ctx, options2) {
  const tracer = getTracer();
  const parentSpan = ctx.get(SPAN_KEY2);
  if (ctx.get(SUPPRESS_CHILD_SPANS_KEY) && parentSpan) {
    return ctx;
  }
  const spanName = ctx.name || "anonymous-context";
  let span;
  if (parentSpan) {
    const parentCtx = trace.setSpan(context.active(), parentSpan);
    span = tracer.startSpan(spanName, options2, parentCtx);
  } else {
    span = tracer.startSpan(spanName, options2);
  }
  const inherited = ctx.get(INHERITABLE_SPAN_ATTRIBUTES_KEY);
  for (const key in inherited) {
    span.setAttribute(key, inherited[key]);
  }
  const startMs = Date.now();
  let ctxWith = ctx.with(SPAN_KEY2, span);
  if (!parentSpan) {
    ctxWith = ctxWith.with(ROOT_SPAN_KEY, span).with(ROOT_SPAN_START_MS_KEY, startMs);
  }
  return ctxWith;
}
function getSpan2(ctx) {
  return ctx.get(SPAN_KEY2);
}
function withSuppressedChildSpans(ctx) {
  return ctx.with(SUPPRESS_CHILD_SPANS_KEY, true);
}
function withInheritableAttribute(ctx, key, value) {
  const existing = ctx.get(INHERITABLE_SPAN_ATTRIBUTES_KEY);
  const span = getSpan2(ctx);
  if (span) {
    span.setAttribute(key, value);
  }
  return ctx.with(INHERITABLE_SPAN_ATTRIBUTES_KEY, Object.assign(Object.assign({}, existing), { [key]: value }));
}
function getSpanContextData(ctx) {
  var _a20;
  try {
    const span = getSpan2(ctx);
    if (!span) {
      return void 0;
    }
    const sc = span.spanContext();
    const isSuppressed = ctx.get(SUPPRESS_CHILD_SPANS_KEY);
    return {
      traceId: sc.traceId,
      spanId: sc.spanId,
      traceFlags: isSuppressed ? 0 : sc.traceFlags,
      traceState: (_a20 = sc.traceState) === null || _a20 === void 0 ? void 0 : _a20.toString()
    };
  } catch (_b2) {
    return void 0;
  }
}
function reportEvent(ctx, name17) {
  var _a20;
  try {
    const tracer = getTracer();
    const parentSpan = getSpan2(ctx);
    if (!parentSpan) {
      return;
    }
    const parentCtx = trace.setSpan(context.active(), parentSpan);
    const eventSpan = tracer.startSpan(name17, void 0, parentCtx);
    const inherited = ctx.get(INHERITABLE_SPAN_ATTRIBUTES_KEY);
    for (const key in inherited) {
      eventSpan.setAttribute(key, inherited[key]);
    }
    const now = Date.now();
    const rootStart = ctx.get(ROOT_SPAN_START_MS_KEY);
    const delta = typeof rootStart === "number" ? now - rootStart : 0;
    const attrKey = `event.${name17}`;
    const rootSpan = (_a20 = ctx.get(ROOT_SPAN_KEY)) !== null && _a20 !== void 0 ? _a20 : parentSpan;
    rootSpan.setAttribute(attrKey, delta);
    eventSpan.setAttribute(attrKey, delta);
    eventSpan.end();
  } catch (_b2) {
  }
}
function createContextFromRemoteSpanContext(spanContext, name17, existingContext) {
  const span = trace.wrapSpanContext({
    traceId: spanContext.traceId,
    spanId: spanContext.spanId,
    traceFlags: spanContext.traceFlags,
    isRemote: true
  });
  const parentCtx = existingContext !== null && existingContext !== void 0 ? existingContext : createContext();
  const ctx = name17 ? parentCtx.withName(name17) : parentCtx;
  return ctx.with(SPAN_KEY2, span);
}
function createSpan(ctx, options2) {
  const parentSpan = getSpan2(ctx);
  const isSuppressed = ctx.get(SUPPRESS_CHILD_SPANS_KEY) && parentSpan;
  const ctxWithSpan = withSpan(ctx, options2);
  const span = getSpan2(ctxWithSpan);
  return new DisposableSpan(ctxWithSpan, span, !isSuppressed);
}
function recordCompletedSpanIfParented(ctx, options2, endTime) {
  if (!getSpan2(ctx) || ctx.get(SUPPRESS_CHILD_SPANS_KEY)) {
    return void 0;
  }
  const ctxWithSpan = withSpan(ctx, options2);
  const span = getSpan2(ctxWithSpan);
  span.end(endTime);
  return span;
}
var SPAN_KEY2, ROOT_SPAN_KEY, ROOT_SPAN_START_MS_KEY, SUPPRESS_CHILD_SPANS_KEY, INHERITABLE_SPAN_ATTRIBUTES_KEY, DisposableSpan;
var init_otel = __esm({
  "../packages/context/dist/otel.js"() {
    "use strict";
    init_esm();
    init_core();
    SPAN_KEY2 = createKey(/* @__PURE__ */ Symbol("otel.span"), void 0);
    ROOT_SPAN_KEY = createKey(/* @__PURE__ */ Symbol("otel.root_span"), void 0);
    ROOT_SPAN_START_MS_KEY = createKey(/* @__PURE__ */ Symbol("otel.root_start_ms"), void 0);
    SUPPRESS_CHILD_SPANS_KEY = createKey(/* @__PURE__ */ Symbol("otel.suppress_child_spans"), false);
    INHERITABLE_SPAN_ATTRIBUTES_KEY = createKey(/* @__PURE__ */ Symbol("otel.inheritable_span_attributes"), {});
    DisposableSpan = class {
      constructor(ctx, span, shouldEnd = true) {
        this.ctx = ctx;
        this.span = span;
        this.shouldEnd = shouldEnd;
      }
      [Symbol.dispose]() {
        if (this.shouldEnd) {
          this.span.end();
        }
      }
    };
  }
});

