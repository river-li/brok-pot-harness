/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/telemetry/send-trace-sampler.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_sdk_trace_node2 = __toESM(require_src6(), 1);
function createSendTraceSampler() {
  return new import_sdk_trace_node2.ParentBasedSampler({ root: new import_sdk_trace_node2.AlwaysOffSampler() });
}

