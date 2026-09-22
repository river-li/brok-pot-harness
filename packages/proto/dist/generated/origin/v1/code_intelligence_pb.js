/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/origin/v1/code_intelligence_pb.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_esm();
init_compact();
var __protoPackage162 = "origin.v1.";
var __protoMessage3154 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage162;
  }
};
var CodeIntelligenceProvenance = /* @__PURE__ */ enumType(proto3, __protoPackage162, "CodeIntelligenceProvenance", [[0, "UNSPECIFIED"], [1, "EXACT_SCIP"], [2, "HYBRID"], [3, "SEARCH"]], 1);
var CodeIntelligenceIndex = class _CodeIntelligenceIndex extends __protoMessage3154 {
  constructor(data) {
    super();
    this.indexedCommitSha = "";
    this.provenance = CodeIntelligenceProvenance.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CodeIntelligenceIndex().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CodeIntelligenceIndex().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CodeIntelligenceIndex().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CodeIntelligenceIndex, a, b2);
  }
  static $() {
    return ["CodeIntelligenceIndex|1 indexed_commit_sha 9|2 provenance #0", CodeIntelligenceProvenance];
  }
};
var CodeIntelligencePosition = class _CodeIntelligencePosition extends __protoMessage3154 {
  constructor(data) {
    super();
    this.line = 0;
    this.utf16Column = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CodeIntelligencePosition().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CodeIntelligencePosition().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CodeIntelligencePosition().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CodeIntelligencePosition, a, b2);
  }
  static $() {
    return ["CodeIntelligencePosition|1 line 13|2 utf16_column 13"];
  }
};
var CodeIntelligenceRange = class _CodeIntelligenceRange extends __protoMessage3154 {
  constructor(data) {
    super();
    this.startLine = 0;
    this.startUtf16Column = 0;
    this.endLine = 0;
    this.endUtf16Column = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CodeIntelligenceRange().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CodeIntelligenceRange().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CodeIntelligenceRange().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CodeIntelligenceRange, a, b2);
  }
  static $() {
    return ["CodeIntelligenceRange|1 start_line 13|2 start_utf16_column 13|3 end_line 13|4 end_utf16_column 13"];
  }
};
var CodeIntelligenceLocation = class _CodeIntelligenceLocation extends __protoMessage3154 {
  constructor(data) {
    super();
    this.path = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CodeIntelligenceLocation().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CodeIntelligenceLocation().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CodeIntelligenceLocation().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CodeIntelligenceLocation, a, b2);
  }
  static $() {
    return ["CodeIntelligenceLocation|1 path 9|2 range #0", CodeIntelligenceRange];
  }
};
var ResolvedCodeIntelligenceSymbol = class _ResolvedCodeIntelligenceSymbol extends __protoMessage3154 {
  constructor(data) {
    super();
    this.opaqueId = "";
    this.definitions = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ResolvedCodeIntelligenceSymbol().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ResolvedCodeIntelligenceSymbol().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ResolvedCodeIntelligenceSymbol().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ResolvedCodeIntelligenceSymbol, a, b2);
  }
  static $() {
    return ["ResolvedCodeIntelligenceSymbol|1 opaque_id 9|2 occurrence_range #0|3 definition #1?|4 signature 9?|5 documentation 9?|6 definitions #1*|7 kind 9?", CodeIntelligenceRange, CodeIntelligenceLocation];
  }
};
var ResolveCodeIntelligenceSymbolAtPositionRequest = class _ResolveCodeIntelligenceSymbolAtPositionRequest extends __protoMessage3154 {
  constructor(data) {
    super();
    this.commitSha = "";
    this.path = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ResolveCodeIntelligenceSymbolAtPositionRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ResolveCodeIntelligenceSymbolAtPositionRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ResolveCodeIntelligenceSymbolAtPositionRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ResolveCodeIntelligenceSymbolAtPositionRequest, a, b2);
  }
  static $() {
    return ["ResolveCodeIntelligenceSymbolAtPositionRequest|1 repo #0|2 commit_sha 9|3 path 9|4 position #1", ClientRepoIdentifier, CodeIntelligencePosition];
  }
};
var ResolveCodeIntelligenceSymbolAtPositionResponse = class _ResolveCodeIntelligenceSymbolAtPositionResponse extends __protoMessage3154 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ResolveCodeIntelligenceSymbolAtPositionResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ResolveCodeIntelligenceSymbolAtPositionResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ResolveCodeIntelligenceSymbolAtPositionResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ResolveCodeIntelligenceSymbolAtPositionResponse, a, b2);
  }
  static $() {
    return ["ResolveCodeIntelligenceSymbolAtPositionResponse|1 index #0|2 symbol #1?", CodeIntelligenceIndex, ResolvedCodeIntelligenceSymbol];
  }
};
var FindCodeIntelligenceReferencesAtPositionRequest = class _FindCodeIntelligenceReferencesAtPositionRequest extends __protoMessage3154 {
  constructor(data) {
    super();
    this.commitSha = "";
    this.path = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _FindCodeIntelligenceReferencesAtPositionRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _FindCodeIntelligenceReferencesAtPositionRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _FindCodeIntelligenceReferencesAtPositionRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_FindCodeIntelligenceReferencesAtPositionRequest, a, b2);
  }
  static $() {
    return ["FindCodeIntelligenceReferencesAtPositionRequest|1 repo #0|2 commit_sha 9|3 path 9|4 position #1", ClientRepoIdentifier, CodeIntelligencePosition];
  }
};
var FindCodeIntelligenceReferencesAtPositionHeader = class _FindCodeIntelligenceReferencesAtPositionHeader extends __protoMessage3154 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _FindCodeIntelligenceReferencesAtPositionHeader().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _FindCodeIntelligenceReferencesAtPositionHeader().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _FindCodeIntelligenceReferencesAtPositionHeader().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_FindCodeIntelligenceReferencesAtPositionHeader, a, b2);
  }
  static $() {
    return ["FindCodeIntelligenceReferencesAtPositionHeader|1 index #0|2 symbol #1?", CodeIntelligenceIndex, ResolvedCodeIntelligenceSymbol];
  }
};
var FindCodeIntelligenceReferencesAtPositionResult = class _FindCodeIntelligenceReferencesAtPositionResult extends __protoMessage3154 {
  constructor(data) {
    super();
    this.isDefinition = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _FindCodeIntelligenceReferencesAtPositionResult().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _FindCodeIntelligenceReferencesAtPositionResult().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _FindCodeIntelligenceReferencesAtPositionResult().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_FindCodeIntelligenceReferencesAtPositionResult, a, b2);
  }
  static $() {
    return ["FindCodeIntelligenceReferencesAtPositionResult|1 location #0|2 is_definition 8", CodeIntelligenceLocation];
  }
};
var FindCodeIntelligenceReferencesAtPositionTrailer = class _FindCodeIntelligenceReferencesAtPositionTrailer extends __protoMessage3154 {
  constructor(data) {
    super();
    this.totalCount = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _FindCodeIntelligenceReferencesAtPositionTrailer().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _FindCodeIntelligenceReferencesAtPositionTrailer().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _FindCodeIntelligenceReferencesAtPositionTrailer().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_FindCodeIntelligenceReferencesAtPositionTrailer, a, b2);
  }
  static $() {
    return ["FindCodeIntelligenceReferencesAtPositionTrailer|1 total_count 13"];
  }
};
var FindCodeIntelligenceReferencesAtPositionResponse = class _FindCodeIntelligenceReferencesAtPositionResponse extends __protoMessage3154 {
  constructor(data) {
    super();
    this.chunk = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _FindCodeIntelligenceReferencesAtPositionResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _FindCodeIntelligenceReferencesAtPositionResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _FindCodeIntelligenceReferencesAtPositionResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_FindCodeIntelligenceReferencesAtPositionResponse, a, b2);
  }
  static $() {
    return ["FindCodeIntelligenceReferencesAtPositionResponse|1 header #0 chunk|2 result #1 chunk|3 trailer #2 chunk", FindCodeIntelligenceReferencesAtPositionHeader, FindCodeIntelligenceReferencesAtPositionResult, FindCodeIntelligenceReferencesAtPositionTrailer];
  }
};

