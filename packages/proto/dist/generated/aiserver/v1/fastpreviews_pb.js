/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/aiserver/v1/fastpreviews_pb.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage142, __protoMessage3135, StreamAiPreviewsIntent, StreamAiPreviewsRequest, StreamAiPreviewsResponse;
var init_fastpreviews_pb = __esm({
  "../packages/proto/dist/generated/aiserver/v1/fastpreviews_pb.js"() {
    "use strict";
    init_esm();
    init_utils_pb();
    init_compact();
    __protoPackage142 = "aiserver.v1.";
    __protoMessage3135 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage142;
      }
    };
    StreamAiPreviewsIntent = class _StreamAiPreviewsIntent extends __protoMessage3135 {
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
    StreamAiPreviewsRequest = class _StreamAiPreviewsRequest extends __protoMessage3135 {
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
    StreamAiPreviewsResponse = class _StreamAiPreviewsResponse extends __protoMessage3135 {
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
  }
});

