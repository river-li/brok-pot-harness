/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/aiserver/v1/fastpreviews_pb.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_esm13();
init_utils_pb2();
init_compact();
var __protoPackage128 = "aiserver.v1.";
var __protoMessage3126 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage128;
  }
};
var StreamAiPreviewsIntent = class _StreamAiPreviewsIntent extends __protoMessage3126 {
  constructor(data) {
    super();
    this.mainSymbolsToAnalyzeFromGoToDef = [];
    this.relatedSymbols = [];
    this.mainSymbolsToAnalyzeFromImplementations = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamAiPreviewsIntent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamAiPreviewsIntent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamAiPreviewsIntent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamAiPreviewsIntent, a, b2);
  }
  static $() {
    return ["StreamAiPreviewsIntent|1 main_symbols_to_analyze_from_go_to_def #0*|4 main_symbol_hover_details #1|3 related_symbols #0*|6 main_symbols_to_analyze_from_implementations #0*", DocumentSymbolWithText, HoverDetails];
  }
};
var StreamAiPreviewsRequest = class _StreamAiPreviewsRequest extends __protoMessage3126 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamAiPreviewsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamAiPreviewsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamAiPreviewsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamAiPreviewsRequest, a, b2);
  }
  static $() {
    return ["StreamAiPreviewsRequest|1 current_file #0|2 intent #1|14 model_details #2|15 is_detailed 8?", CurrentFileInfo, StreamAiPreviewsIntent, ModelDetails];
  }
};
var StreamAiPreviewsResponse = class _StreamAiPreviewsResponse extends __protoMessage3126 {
  constructor(data) {
    super();
    this.text = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _StreamAiPreviewsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _StreamAiPreviewsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _StreamAiPreviewsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_StreamAiPreviewsResponse, a, b2);
  }
  static $() {
    return ["StreamAiPreviewsResponse|1 text 9"];
  }
};

