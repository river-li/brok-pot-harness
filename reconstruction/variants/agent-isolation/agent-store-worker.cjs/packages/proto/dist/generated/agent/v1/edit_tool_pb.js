/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/edit_tool_pb.js
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage15 = "agent.v1.";
var __protoMessage315 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage15;
  }
};
var EditArgs = class _EditArgs extends __protoMessage315 {
  constructor(data) {
    super();
    this.path = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _EditArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _EditArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _EditArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_EditArgs, a, b);
  }
  static $() {
    return ["EditArgs|1 path 9|6 stream_content 9?"];
  }
};
var EditResult = class _EditResult extends __protoMessage315 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _EditResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _EditResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _EditResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_EditResult, a, b);
  }
  static $() {
    return ["EditResult|1 success #0 result|2 file_not_found #1 result|3 read_permission_denied #2 result|4 write_permission_denied #3 result|6 rejected #4 result|7 error #5 result", EditSuccess, EditFileNotFound, EditReadPermissionDenied, EditWritePermissionDenied, EditRejected, EditError];
  }
};
var EditSuccess = class _EditSuccess extends __protoMessage315 {
  constructor(data) {
    super();
    this.path = "";
    this.afterFullFileContent = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _EditSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _EditSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _EditSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_EditSuccess, a, b);
  }
  static $() {
    return ["EditSuccess|1 path 9|3 lines_added 5?|4 lines_removed 5?|5 diff_string 9?|6 before_full_file_content 9?|7 after_full_file_content 9|8 message 9?"];
  }
};
var EditFileNotFound = class _EditFileNotFound extends __protoMessage315 {
  constructor(data) {
    super();
    this.path = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _EditFileNotFound().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _EditFileNotFound().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _EditFileNotFound().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_EditFileNotFound, a, b);
  }
  static $() {
    return ["EditFileNotFound|1 path 9"];
  }
};
var EditReadPermissionDenied = class _EditReadPermissionDenied extends __protoMessage315 {
  constructor(data) {
    super();
    this.path = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _EditReadPermissionDenied().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _EditReadPermissionDenied().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _EditReadPermissionDenied().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_EditReadPermissionDenied, a, b);
  }
  static $() {
    return ["EditReadPermissionDenied|1 path 9"];
  }
};
var EditWritePermissionDenied = class _EditWritePermissionDenied extends __protoMessage315 {
  constructor(data) {
    super();
    this.path = "";
    this.error = "";
    this.isReadonly = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _EditWritePermissionDenied().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _EditWritePermissionDenied().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _EditWritePermissionDenied().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_EditWritePermissionDenied, a, b);
  }
  static $() {
    return ["EditWritePermissionDenied|1 path 9|2 error 9|3 is_readonly 8"];
  }
};
var EditRejected = class _EditRejected extends __protoMessage315 {
  constructor(data) {
    super();
    this.path = "";
    this.reason = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _EditRejected().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _EditRejected().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _EditRejected().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_EditRejected, a, b);
  }
  static $() {
    return ["EditRejected|1 path 9|2 reason 9"];
  }
};
var EditError = class _EditError extends __protoMessage315 {
  constructor(data) {
    super();
    this.path = "";
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _EditError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _EditError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _EditError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_EditError, a, b);
  }
  static $() {
    return ["EditError|1 path 9|2 error 9|5 model_visible_error 9?"];
  }
};
var EditToolCall = class _EditToolCall extends __protoMessage315 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _EditToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _EditToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _EditToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_EditToolCall, a, b);
  }
  static $() {
    return ["EditToolCall|1 args #0|2 result #1", EditArgs, EditResult];
  }
};

