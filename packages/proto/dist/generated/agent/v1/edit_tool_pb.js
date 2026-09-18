var __protoPackage26, __protoMessage323, EditArgs, EditResult, EditSuccess, EditFileNotFound, EditReadPermissionDenied, EditWritePermissionDenied, EditRejected, EditError, EditToolCall, EditToolCallDelta;
var init_edit_tool_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/edit_tool_pb.js"() {
    "use strict";
    init_esm();
    init_compact();
    __protoPackage26 = "agent.v1.";
    __protoMessage323 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage26;
      }
    };
    EditArgs = class _EditArgs extends __protoMessage323 {
      constructor(data) {
        super();
        this.path = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _EditArgs().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _EditArgs().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _EditArgs().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_EditArgs, a, b2);
      }
      static $() {
        return ["EditArgs|1 path 9|6 stream_content 9?"];
      }
    };
    EditResult = class _EditResult extends __protoMessage323 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _EditResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _EditResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _EditResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_EditResult, a, b2);
      }
      static $() {
        return ["EditResult|1 success #0 result|2 file_not_found #1 result|3 read_permission_denied #2 result|4 write_permission_denied #3 result|6 rejected #4 result|7 error #5 result", EditSuccess, EditFileNotFound, EditReadPermissionDenied, EditWritePermissionDenied, EditRejected, EditError];
      }
    };
    EditSuccess = class _EditSuccess extends __protoMessage323 {
      constructor(data) {
        super();
        this.path = "";
        this.afterFullFileContent = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _EditSuccess().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _EditSuccess().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _EditSuccess().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_EditSuccess, a, b2);
      }
      static $() {
        return ["EditSuccess|1 path 9|3 lines_added 5?|4 lines_removed 5?|5 diff_string 9?|6 before_full_file_content 9?|7 after_full_file_content 9|8 message 9?"];
      }
    };
    EditFileNotFound = class _EditFileNotFound extends __protoMessage323 {
      constructor(data) {
        super();
        this.path = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _EditFileNotFound().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _EditFileNotFound().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _EditFileNotFound().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_EditFileNotFound, a, b2);
      }
      static $() {
        return ["EditFileNotFound|1 path 9"];
      }
    };
    EditReadPermissionDenied = class _EditReadPermissionDenied extends __protoMessage323 {
      constructor(data) {
        super();
        this.path = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _EditReadPermissionDenied().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _EditReadPermissionDenied().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _EditReadPermissionDenied().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_EditReadPermissionDenied, a, b2);
      }
      static $() {
        return ["EditReadPermissionDenied|1 path 9"];
      }
    };
    EditWritePermissionDenied = class _EditWritePermissionDenied extends __protoMessage323 {
      constructor(data) {
        super();
        this.path = "";
        this.error = "";
        this.isReadonly = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _EditWritePermissionDenied().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _EditWritePermissionDenied().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _EditWritePermissionDenied().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_EditWritePermissionDenied, a, b2);
      }
      static $() {
        return ["EditWritePermissionDenied|1 path 9|2 error 9|3 is_readonly 8"];
      }
    };
    EditRejected = class _EditRejected extends __protoMessage323 {
      constructor(data) {
        super();
        this.path = "";
        this.reason = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _EditRejected().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _EditRejected().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _EditRejected().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_EditRejected, a, b2);
      }
      static $() {
        return ["EditRejected|1 path 9|2 reason 9"];
      }
    };
    EditError = class _EditError extends __protoMessage323 {
      constructor(data) {
        super();
        this.path = "";
        this.error = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _EditError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _EditError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _EditError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_EditError, a, b2);
      }
      static $() {
        return ["EditError|1 path 9|2 error 9|5 model_visible_error 9?"];
      }
    };
    EditToolCall = class _EditToolCall extends __protoMessage323 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _EditToolCall().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _EditToolCall().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _EditToolCall().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_EditToolCall, a, b2);
      }
      static $() {
        return ["EditToolCall|1 args #0|2 result #1", EditArgs, EditResult];
      }
    };
    EditToolCallDelta = class _EditToolCallDelta extends __protoMessage323 {
      constructor(data) {
        super();
        this.streamContentDelta = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _EditToolCallDelta().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _EditToolCallDelta().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _EditToolCallDelta().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_EditToolCallDelta, a, b2);
      }
      static $() {
        return ["EditToolCallDelta|1 stream_content_delta 9"];
      }
    };
  }
});
