var SEND_TRACE_SAMPLE_RATIO = 1;
var HEX_TRACE_ID = /^[0-9a-f]{32}$/;
var HEX_SPAN_ID = /^[0-9a-f]{16}$/;
var HEX_FLAGS = /^[0-9a-f]{2}$/;
var ZERO_TRACE_ID = "0".repeat(32);
var ZERO_SPAN_ID = "0".repeat(16);
function randomHex(byteLength) {
  const bytes = new Uint8Array(byteLength);
  globalThis.crypto.getRandomValues(bytes);
  let out = "";
  for (const byte of bytes) {
    out += byte.toString(16).padStart(2, "0");
  }
  return out;
}
function shouldSampleSend(ratio = SEND_TRACE_SAMPLE_RATIO) {
  if (!(ratio > 0)) return false;
  if (ratio >= 1) return true;
  return Math.random() < ratio;
}
function mintTraceparent(sampled = true) {
  try {
    const traceId = randomHex(16);
    const spanId = randomHex(8);
    const flags = sampled ? "01" : "00";
    return { traceparent: `00-${traceId}-${spanId}-${flags}`, traceId, spanId };
  } catch {
    return void 0;
  }
}
function parseTraceparent(traceparent) {
  if (typeof traceparent !== "string") return void 0;
  const parts = traceparent.trim().split("-");
  if (parts.length !== 4) return void 0;
  const [version3 = "", traceId = "", spanId = "", flags = ""] = parts;
  if (version3 !== "00") return void 0;
  if (!HEX_TRACE_ID.test(traceId) || traceId === ZERO_TRACE_ID) return void 0;
  if (!HEX_SPAN_ID.test(spanId) || spanId === ZERO_SPAN_ID) return void 0;
  if (!HEX_FLAGS.test(flags)) return void 0;
  const traceFlags = Number.parseInt(flags, 16);
  if (Number.isNaN(traceFlags)) return void 0;
  return { traceId, spanId, traceFlags };
}
