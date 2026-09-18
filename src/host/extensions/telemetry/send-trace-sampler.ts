var import_sdk_trace_node2 = __toESM(require_src6(), 1);
function createSendTraceSampler() {
  return new import_sdk_trace_node2.ParentBasedSampler({ root: new import_sdk_trace_node2.AlwaysOffSampler() });
}
