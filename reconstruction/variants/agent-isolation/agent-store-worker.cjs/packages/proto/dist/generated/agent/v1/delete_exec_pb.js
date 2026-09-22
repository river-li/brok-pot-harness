/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/delete_exec_pb.js
 * Bundle: sand-host/agent-isolation/agent-store-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage7 = "agent.v1.";
var __protoMessage37 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage7;
  }
};
var DeleteArgs = class _DeleteArgs extends __protoMessage37 {
  constructor(data) {
    super();
    this.path = "";
    this.toolCallId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _DeleteArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _DeleteArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _DeleteArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_DeleteArgs, a, b);
  }
  static $() {
    return ["DeleteArgs|1 path 9|2 tool_call_id 9"];
  }
};
var DeleteResult = class _DeleteResult extends __protoMessage37 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _DeleteResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _DeleteResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _DeleteResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_DeleteResult, a, b);
  }
  static $() {
    return ["DeleteResult|1 success #0 result|2 file_not_found #1 result|3 not_file #2 result|4 permission_denied #3 result|5 file_busy #4 result|6 rejected #5 result|7 error #6 result", DeleteSuccess, DeleteFileNotFound, DeleteNotFile, DeletePermissionDenied, DeleteFileBusy, DeleteRejected, DeleteError];
  }
};
var DeleteSuccess = class _DeleteSuccess extends __protoMessage37 {
  constructor(data) {
    super();
    this.path = "";
    this.deletedFile = "";
    this.fileSize = protoInt64.zero;
    this.prevContent = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _DeleteSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _DeleteSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _DeleteSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_DeleteSuccess, a, b);
  }
  static $() {
    return ["DeleteSuccess|1 path 9|2 deleted_file 9|3 file_size 3|4 prev_content 9"];
  }
};
var DeleteFileNotFound = class _DeleteFileNotFound extends __protoMessage37 {
  constructor(data) {
    super();
    this.path = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _DeleteFileNotFound().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _DeleteFileNotFound().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _DeleteFileNotFound().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_DeleteFileNotFound, a, b);
  }
  static $() {
    return ["DeleteFileNotFound|1 path 9"];
  }
};
var DeleteNotFile = class _DeleteNotFile extends __protoMessage37 {
  constructor(data) {
    super();
    this.path = "";
    this.actualType = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _DeleteNotFile().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _DeleteNotFile().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _DeleteNotFile().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_DeleteNotFile, a, b);
  }
  static $() {
    return ["DeleteNotFile|1 path 9|2 actual_type 9"];
  }
};
var DeletePermissionDenied = class _DeletePermissionDenied extends __protoMessage37 {
  constructor(data) {
    super();
    this.path = "";
    this.clientVisibleError = "";
    this.isReadonly = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _DeletePermissionDenied().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _DeletePermissionDenied().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _DeletePermissionDenied().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_DeletePermissionDenied, a, b);
  }
  static $() {
    return ["DeletePermissionDenied|1 path 9|2 client_visible_error 9|3 is_readonly 8"];
  }
};
var DeleteFileBusy = class _DeleteFileBusy extends __protoMessage37 {
  constructor(data) {
    super();
    this.path = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _DeleteFileBusy().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _DeleteFileBusy().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _DeleteFileBusy().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_DeleteFileBusy, a, b);
  }
  static $() {
    return ["DeleteFileBusy|1 path 9"];
  }
};
var DeleteRejected = class _DeleteRejected extends __protoMessage37 {
  constructor(data) {
    super();
    this.path = "";
    this.reason = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _DeleteRejected().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _DeleteRejected().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _DeleteRejected().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_DeleteRejected, a, b);
  }
  static $() {
    return ["DeleteRejected|1 path 9|2 reason 9"];
  }
};
var DeleteError = class _DeleteError extends __protoMessage37 {
  constructor(data) {
    super();
    this.path = "";
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _DeleteError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _DeleteError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _DeleteError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_DeleteError, a, b);
  }
  static $() {
    return ["DeleteError|1 path 9|2 error 9"];
  }
};

