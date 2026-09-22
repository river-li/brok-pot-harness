/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/generate_image_tool_pb.js
 * Bundle: sand-host/agent-isolation/transcript-mirror-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage33 = "agent.v1.";
var __protoMessage332 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage33;
  }
};
var GenerateImageArgs = class _GenerateImageArgs extends __protoMessage332 {
  constructor(data) {
    super();
    this.description = "";
    this.referenceImagePaths = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GenerateImageArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GenerateImageArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GenerateImageArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GenerateImageArgs, a, b);
  }
  static $() {
    return ["GenerateImageArgs|1 description 9|2 file_path 9?|5 reference_image_paths 9*|6 aspect_ratio 9?"];
  }
};
var GenerateImageResult = class _GenerateImageResult extends __protoMessage332 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GenerateImageResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GenerateImageResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GenerateImageResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GenerateImageResult, a, b);
  }
  static $() {
    return ["GenerateImageResult|1 success #0 result|2 error #1 result", GenerateImageSuccess, GenerateImageError];
  }
};
var GenerateImageSuccess = class _GenerateImageSuccess extends __protoMessage332 {
  constructor(data) {
    super();
    this.filePath = "";
    this.imageData = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GenerateImageSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GenerateImageSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GenerateImageSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GenerateImageSuccess, a, b);
  }
  static $() {
    return ["GenerateImageSuccess|1 file_path 9|2 image_data 9"];
  }
};
var GenerateImageError = class _GenerateImageError extends __protoMessage332 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GenerateImageError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GenerateImageError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GenerateImageError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GenerateImageError, a, b);
  }
  static $() {
    return ["GenerateImageError|1 error 9"];
  }
};
var GenerateImageToolCall = class _GenerateImageToolCall extends __protoMessage332 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _GenerateImageToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _GenerateImageToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _GenerateImageToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_GenerateImageToolCall, a, b);
  }
  static $() {
    return ["GenerateImageToolCall|1 args #0|2 result #1", GenerateImageArgs, GenerateImageResult];
  }
};

