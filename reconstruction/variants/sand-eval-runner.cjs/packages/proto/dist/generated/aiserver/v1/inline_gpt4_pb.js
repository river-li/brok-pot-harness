/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/aiserver/v1/inline_gpt4_pb.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_esm13();
init_utils_pb2();
init_repository_pb();
init_compact();
var __protoPackage127 = "aiserver.v1.";
var __protoMessage3125 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage127;
  }
};
var StreamInlineLongCompletionRequest = class _StreamInlineLongCompletionRequest extends __protoMessage3125 {
  constructor(data) {
    super();
    this.repositories = [];
    this.contextBlocks = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamInlineLongCompletionRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamInlineLongCompletionRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamInlineLongCompletionRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamInlineLongCompletionRequest, a, b2);
  }
  static $() {
    return ["StreamInlineLongCompletionRequest|1 current_file #0|6 repositories #1*|7 context_blocks #2*|13 explicit_context #3|14 model_details #4|15 linter_errors #5", CurrentFileInfo, RepositoryInfo, StreamInlineLongCompletionRequest_ContextBlock, ExplicitContext, ModelDetails, LinterErrors];
  }
};
var StreamInlineLongCompletionRequest_ContextBlock = class _StreamInlineLongCompletionRequest_ContextBlock extends __protoMessage3125 {
  constructor(data) {
    super();
    this.contextType = StreamInlineLongCompletionRequest_ContextBlock_ContextType.UNSPECIFIED;
    this.blocks = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamInlineLongCompletionRequest_ContextBlock().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamInlineLongCompletionRequest_ContextBlock().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamInlineLongCompletionRequest_ContextBlock().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamInlineLongCompletionRequest_ContextBlock, a, b2);
  }
  static $() {
    return ["StreamInlineLongCompletionRequest.ContextBlock|1 context_type #0|2 blocks #1*", StreamInlineLongCompletionRequest_ContextBlock_ContextType, CodeBlock];
  }
};
var StreamInlineLongCompletionRequest_ContextBlock_ContextType = /* @__PURE__ */ enumType2(proto3, __protoPackage127, "StreamInlineLongCompletionRequest.ContextBlock.ContextType", [[0, "UNSPECIFIED"], [1, "RECENT_LOCATIONS"]], 1);

