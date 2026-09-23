var __protoPackage19, __protoMessage315, DeleteArgs, DeleteResult, DeleteSuccess, DeleteFileNotFound, DeleteNotFile, DeletePermissionDenied, DeleteFileBusy, DeleteRejected, DeleteError;
var init_delete_exec_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/delete_exec_pb.js"() {
    "use strict";
    init_esm();
    init_compact();
    __protoPackage19 = "agent.v1.";
    __protoMessage315 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage19;
      }
    };
    DeleteArgs = class _DeleteArgs extends __protoMessage315 {
      constructor(data) {
        super();
        this.path = "";
        this.toolCallId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DeleteArgs().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DeleteArgs().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DeleteArgs().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DeleteArgs, a, b2);
      }
      static $() {
        return ["DeleteArgs|1 path 9|2 tool_call_id 9"];
      }
    };
    DeleteResult = class _DeleteResult extends __protoMessage315 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DeleteResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DeleteResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DeleteResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DeleteResult, a, b2);
      }
      static $() {
        return ["DeleteResult|1 success #0 result|2 file_not_found #1 result|3 not_file #2 result|4 permission_denied #3 result|5 file_busy #4 result|6 rejected #5 result|7 error #6 result", DeleteSuccess, DeleteFileNotFound, DeleteNotFile, DeletePermissionDenied, DeleteFileBusy, DeleteRejected, DeleteError];
      }
    };
    DeleteSuccess = class _DeleteSuccess extends __protoMessage315 {
      constructor(data) {
        super();
        this.path = "";
        this.deletedFile = "";
        this.fileSize = protoInt64.zero;
        this.prevContent = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DeleteSuccess().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DeleteSuccess().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DeleteSuccess().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DeleteSuccess, a, b2);
      }
      static $() {
        return ["DeleteSuccess|1 path 9|2 deleted_file 9|3 file_size 3|4 prev_content 9"];
      }
    };
    DeleteFileNotFound = class _DeleteFileNotFound extends __protoMessage315 {
      constructor(data) {
        super();
        this.path = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DeleteFileNotFound().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DeleteFileNotFound().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DeleteFileNotFound().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DeleteFileNotFound, a, b2);
      }
      static $() {
        return ["DeleteFileNotFound|1 path 9"];
      }
    };
    DeleteNotFile = class _DeleteNotFile extends __protoMessage315 {
      constructor(data) {
        super();
        this.path = "";
        this.actualType = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DeleteNotFile().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DeleteNotFile().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DeleteNotFile().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DeleteNotFile, a, b2);
      }
      static $() {
        return ["DeleteNotFile|1 path 9|2 actual_type 9"];
      }
    };
    DeletePermissionDenied = class _DeletePermissionDenied extends __protoMessage315 {
      constructor(data) {
        super();
        this.path = "";
        this.clientVisibleError = "";
        this.isReadonly = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DeletePermissionDenied().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DeletePermissionDenied().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DeletePermissionDenied().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DeletePermissionDenied, a, b2);
      }
      static $() {
        return ["DeletePermissionDenied|1 path 9|2 client_visible_error 9|3 is_readonly 8"];
      }
    };
    DeleteFileBusy = class _DeleteFileBusy extends __protoMessage315 {
      constructor(data) {
        super();
        this.path = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DeleteFileBusy().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DeleteFileBusy().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DeleteFileBusy().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DeleteFileBusy, a, b2);
      }
      static $() {
        return ["DeleteFileBusy|1 path 9"];
      }
    };
    DeleteRejected = class _DeleteRejected extends __protoMessage315 {
      constructor(data) {
        super();
        this.path = "";
        this.reason = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DeleteRejected().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DeleteRejected().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DeleteRejected().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DeleteRejected, a, b2);
      }
      static $() {
        return ["DeleteRejected|1 path 9|2 reason 9"];
      }
    };
    DeleteError = class _DeleteError extends __protoMessage315 {
      constructor(data) {
        super();
        this.path = "";
        this.error = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DeleteError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DeleteError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DeleteError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DeleteError, a, b2);
      }
      static $() {
        return ["DeleteError|1 path 9|2 error 9"];
      }
    };
  }
});
