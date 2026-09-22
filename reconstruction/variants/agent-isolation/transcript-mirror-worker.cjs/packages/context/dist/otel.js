/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/context/dist/otel.js
 * Bundle: sand-host/agent-isolation/transcript-mirror-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var SPAN_KEY2 = createKey(/* @__PURE__ */ Symbol("otel.span"), void 0);
var ROOT_SPAN_KEY = createKey(/* @__PURE__ */ Symbol("otel.root_span"), void 0);
var ROOT_SPAN_START_MS_KEY = createKey(/* @__PURE__ */ Symbol("otel.root_start_ms"), void 0);
var SUPPRESS_CHILD_SPANS_KEY = createKey(/* @__PURE__ */ Symbol("otel.suppress_child_spans"), false);
var INHERITABLE_SPAN_ATTRIBUTES_KEY = createKey(/* @__PURE__ */ Symbol("otel.inheritable_span_attributes"), {});
function getTracer(name = "context-tracer") {
  return trace.getTracer(name);
}
function withSpan(ctx, options) {
  const tracer = getTracer();
  const parentSpan = ctx.get(SPAN_KEY2);
  if (ctx.get(SUPPRESS_CHILD_SPANS_KEY) && parentSpan) {
    return ctx;
  }
  const spanName = ctx.name || "anonymous-context";
  let span;
  if (parentSpan) {
    const parentCtx = trace.setSpan(context.active(), parentSpan);
    span = tracer.startSpan(spanName, options, parentCtx);
  } else {
    span = tracer.startSpan(spanName, options);
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
var DisposableSpan = class {
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
function createSpan(ctx, options) {
  const parentSpan = getSpan2(ctx);
  const isSuppressed = ctx.get(SUPPRESS_CHILD_SPANS_KEY) && parentSpan;
  const ctxWithSpan = withSpan(ctx, options);
  const span = getSpan2(ctxWithSpan);
  return new DisposableSpan(ctxWithSpan, span, !isSuppressed);
}

