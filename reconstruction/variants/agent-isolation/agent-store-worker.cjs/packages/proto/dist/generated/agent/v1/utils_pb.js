/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/utils_pb.js
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage3 = "agent.v1.";
var __protoMessage33 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage3;
  }
};
var Range = class _Range extends __protoMessage33 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _Range().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _Range().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _Range().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_Range, a, b);
  }
  static $() {
    return ["Range|1 start #0|2 end #0", Position];
  }
};
var Position = class _Position extends __protoMessage33 {
  constructor(data) {
    super();
    this.line = 0;
    this.column = 0;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _Position().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _Position().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _Position().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_Position, a, b);
  }
  static $() {
    return ["Position|1 line 13|2 column 13"];
  }
};
var OutputLocation = class _OutputLocation extends __protoMessage33 {
  constructor(data) {
    super();
    this.filePath = "";
    this.sizeBytes = protoInt64.zero;
    this.lineCount = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _OutputLocation().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _OutputLocation().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _OutputLocation().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_OutputLocation, a, b);
  }
  static $() {
    return ["OutputLocation|1 file_path 9|2 size_bytes 3|3 line_count 3"];
  }
};
var SmartModeApproval = class _SmartModeApproval extends __protoMessage33 {
  constructor(data) {
    super();
    this.requestId = "";
    this.reason = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SmartModeApproval().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SmartModeApproval().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SmartModeApproval().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SmartModeApproval, a, b);
  }
  static $() {
    return ["SmartModeApproval|1 request_id 9|2 reason 9"];
  }
};

