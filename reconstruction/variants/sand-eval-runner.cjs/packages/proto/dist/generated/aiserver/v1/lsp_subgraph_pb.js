/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/aiserver/v1/lsp_subgraph_pb.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_esm13();
init_compact();
var __protoPackage115 = "aiserver.v1.";
var __protoMessage3114 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage115;
  }
};
var LspSubgraphPosition = class _LspSubgraphPosition extends __protoMessage3114 {
  constructor(data) {
    super();
    this.line = 0;
    this.character = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _LspSubgraphPosition().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _LspSubgraphPosition().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _LspSubgraphPosition().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_LspSubgraphPosition, a, b2);
  }
  static $() {
    return ["LspSubgraphPosition|1 line 5|2 character 5"];
  }
};
var LspSubgraphRange = class _LspSubgraphRange extends __protoMessage3114 {
  constructor(data) {
    super();
    this.startLine = 0;
    this.startCharacter = 0;
    this.endLine = 0;
    this.endCharacter = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _LspSubgraphRange().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _LspSubgraphRange().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _LspSubgraphRange().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_LspSubgraphRange, a, b2);
  }
  static $() {
    return ["LspSubgraphRange|1 start_line 5|2 start_character 5|3 end_line 5|4 end_character 5"];
  }
};
var LspSubgraphContextItem = class _LspSubgraphContextItem extends __protoMessage3114 {
  constructor(data) {
    super();
    this.type = "";
    this.content = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _LspSubgraphContextItem().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _LspSubgraphContextItem().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _LspSubgraphContextItem().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_LspSubgraphContextItem, a, b2);
  }
  static $() {
    return ["LspSubgraphContextItem|1 uri 9?|2 type 9|3 content 9|4 range #0?", LspSubgraphRange];
  }
};
var LspSubgraphFullContext = class _LspSubgraphFullContext extends __protoMessage3114 {
  constructor(data) {
    super();
    this.uri = "";
    this.symbolName = "";
    this.positions = [];
    this.contextItems = [];
    this.score = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _LspSubgraphFullContext().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _LspSubgraphFullContext().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _LspSubgraphFullContext().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_LspSubgraphFullContext, a, b2);
  }
  static $() {
    return ["LspSubgraphFullContext|1 uri 9|2 symbol_name 9|3 positions #0*|4 context_items #1*|5 score 2", LspSubgraphPosition, LspSubgraphContextItem];
  }
};

