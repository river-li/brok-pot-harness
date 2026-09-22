/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/send-trace-host.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_dist4();
init_errors();

// @recovered-fragment 2/2
function beginSendTrace(traceparent) {
  return adoptRemoteParent(traceparent, "sand.send");
}
function adoptRemoteParent(traceparent, spanName) {
  const parsed2 = parseTraceparent(traceparent);
  if (parsed2 === void 0) return void 0;
  try {
    const ctx = createContextFromSpanContext(
      {
        traceId: parsed2.traceId,
        spanId: parsed2.spanId,
        traceFlags: parsed2.traceFlags
      },
      spanName,
      createContext()
    );
    const span = getSpan2(ctx);
    if (span === void 0) return void 0;
    return new DisposableSpan(ctx, span);
  } catch {
    return void 0;
  }
}
function beginGatewayCommandTrace(options2) {
  return adoptRemoteParent(options2.traceparent, `sand.gateway.${options2.method}`);
}
var SAND_TURN_ROOT_SPAN_NAME = "sand.turn.run";
var turnTraceHostBundleVersion;
function setTurnTraceHostBundleVersion(hostBundleVersion) {
  const normalized = hostBundleVersion?.trim();
  turnTraceHostBundleVersion = normalized != null && normalized.length > 0 ? normalized : void 0;
}
function resolveTurnTraceSampleRatio(raw = process.env.SAND_TURN_TRACE_SAMPLE_RATIO) {
  if (raw == null || raw.length === 0) return 1;
  const parsed2 = Number.parseFloat(raw);
  return Number.isFinite(parsed2) && parsed2 >= 0 && parsed2 <= 1 ? parsed2 : 1;
}
function resolveTurnTraceType(options2) {
  if (options2.automationWake != null) return "automation";
  if (options2.requestSource != null && options2.requestSource !== "turn") {
    return options2.requestSource;
  }
  return options2.hidden === true ? "hidden" : "user";
}
function beginTurnTrace(options2) {
  try {
    let base = options2.parentCtx;
    if (base === void 0 || getSpan2(base) === void 0) {
      const ratio = options2.sampleRatio ?? resolveTurnTraceSampleRatio();
      if (!shouldSampleSend(ratio)) return void 0;
      const minted = mintTraceparent(true);
      const parsed2 = parseTraceparent(minted?.traceparent);
      if (parsed2 === void 0) return void 0;
      base = createContextFromRemoteSpanContext(
        {
          traceId: parsed2.traceId,
          spanId: parsed2.spanId,
          traceFlags: parsed2.traceFlags
        },
        void 0,
        createContext()
      );
    }
    let ctx = withSpan(
      base.withName(SAND_TURN_ROOT_SPAN_NAME),
      options2.startTime !== void 0 ? { startTime: options2.startTime } : void 0
    );
    const span = getSpan2(ctx);
    if (span === void 0) return void 0;
    ctx = withInheritableAttribute(ctx, "sand.conversation_id", options2.conversationId);
    ctx = withInheritableAttribute(ctx, "sand.turn_type", options2.turnType);
    if (turnTraceHostBundleVersion !== void 0) {
      span.setAttribute("sand.host_bundle_version", turnTraceHostBundleVersion);
    }
    for (const [key, value] of Object.entries(options2.attributes ?? {})) {
      span.setAttribute(key, value);
    }
    return new DisposableSpan(ctx, span);
  } catch {
    return void 0;
  }
}
function resolveTurnTraceOutcome(result) {
  if (result.pausedForUpgrade === true) return "quiesced_for_upgrade";
  if (result.aborted) return "aborted";
  if (result.awaitingUserSelection === true) return "awaiting_user";
  return "success";
}
function setTurnTraceAttributes(trace2, attributes) {
  if (trace2 === void 0) return;
  try {
    for (const [key, value] of Object.entries(attributes)) {
      trace2.span.setAttribute(key, value);
    }
  } catch (error42) {
    process.stderr.write(`sand.turn.trace_attribute_failed error_class=${errorLogTag(error42)}
`);
  }
}
function markTurnTraceError(trace2, error42) {
  if (trace2 === void 0) return;
  try {
    trace2.span.recordException(error42 instanceof Error ? error42 : new Error(String(error42)));
    trace2.span.setStatus({ code: 2 });
    trace2.span.setAttribute("sand.outcome", "error");
  } catch (markError) {
    process.stderr.write(
      `sand.turn.trace_error_mark_failed error_class=${errorLogTag(markError)}
`
    );
  }
}
async function traceSendPhase(ctx, name17, fn) {
  if (ctx === void 0 || getSpan2(ctx) === void 0) {
    return await fn(ctx ?? createContext());
  }
  let childCtx;
  try {
    childCtx = withSpan(ctx.withName(name17));
  } catch {
    return await fn(ctx);
  }
  const span = getSpan2(childCtx);
  if (span === void 0) {
    return await fn(ctx);
  }
  try {
    return await fn(childCtx);
  } catch (error42) {
    try {
      span.recordException(error42 instanceof Error ? error42 : new Error(String(error42)));
      span.setStatus({ code: 2 });
    } catch (recordError) {
      process.stderr.write(
        `sand.turn.trace_phase_error_record_failed error_class=${errorLogTag(recordError)}
`
      );
    }
    throw error42;
  } finally {
    try {
      span.end();
    } catch (endError) {
      process.stderr.write(
        `sand.turn.trace_phase_span_end_failed error_class=${errorLogTag(endError)}
`
      );
    }
  }
}

