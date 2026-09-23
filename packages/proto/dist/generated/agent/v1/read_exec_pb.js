var __protoPackage103, __protoMessage398, ReadArgs, ReadResult, ReadSuccess, ReadError, ReadRejected, ReadFileNotFound, ReadPermissionDenied, ReadInvalidFile;
var init_read_exec_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/read_exec_pb.js"() {
    "use strict";
    init_esm();
    init_compact();
    __protoPackage103 = "agent.v1.";
    __protoMessage398 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage103;
      }
    };
    ReadArgs = class _ReadArgs extends __protoMessage398 {
      constructor(data) {
        super();
        this.path = "";
        this.toolCallId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReadArgs().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReadArgs().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReadArgs().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReadArgs, a, b2);
      }
      static $() {
        return ["ReadArgs|1 path 9|2 tool_call_id 9|4 offset 5?|5 limit 13?|6 encoding_hint 9?"];
      }
    };
    ReadResult = class _ReadResult extends __protoMessage398 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReadResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReadResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReadResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReadResult, a, b2);
      }
      static $() {
        return ["ReadResult|1 success #0 result|2 error #1 result|3 rejected #2 result|4 file_not_found #3 result|5 permission_denied #4 result|6 invalid_file #5 result", ReadSuccess, ReadError, ReadRejected, ReadFileNotFound, ReadPermissionDenied, ReadInvalidFile];
      }
    };
    ReadSuccess = class _ReadSuccess extends __protoMessage398 {
      constructor(data) {
        super();
        this.path = "";
        this.output = { case: void 0 };
        this.totalLines = 0;
        this.fileSize = protoInt64.zero;
        this.truncated = false;
        this.rangeApplied = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReadSuccess().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReadSuccess().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReadSuccess().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReadSuccess, a, b2);
      }
      static $() {
        return ["ReadSuccess|1 path 9|2 content 9 output|5 data 12 output|3 total_lines 5|4 file_size 3|6 truncated 8|7 output_blob_id 12?|8 range_applied 8"];
      }
    };
    ReadError = class _ReadError extends __protoMessage398 {
      constructor(data) {
        super();
        this.path = "";
        this.error = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReadError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReadError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReadError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReadError, a, b2);
      }
      static $() {
        return ["ReadError|1 path 9|2 error 9"];
      }
    };
    ReadRejected = class _ReadRejected extends __protoMessage398 {
      constructor(data) {
        super();
        this.path = "";
        this.reason = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReadRejected().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReadRejected().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReadRejected().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReadRejected, a, b2);
      }
      static $() {
        return ["ReadRejected|1 path 9|2 reason 9"];
      }
    };
    ReadFileNotFound = class _ReadFileNotFound extends __protoMessage398 {
      constructor(data) {
        super();
        this.path = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReadFileNotFound().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReadFileNotFound().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReadFileNotFound().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReadFileNotFound, a, b2);
      }
      static $() {
        return ["ReadFileNotFound|1 path 9"];
      }
    };
    ReadPermissionDenied = class _ReadPermissionDenied extends __protoMessage398 {
      constructor(data) {
        super();
        this.path = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReadPermissionDenied().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReadPermissionDenied().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReadPermissionDenied().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReadPermissionDenied, a, b2);
      }
      static $() {
        return ["ReadPermissionDenied|1 path 9"];
      }
    };
    ReadInvalidFile = class _ReadInvalidFile extends __protoMessage398 {
      constructor(data) {
        super();
        this.path = "";
        this.reason = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ReadInvalidFile().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ReadInvalidFile().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ReadInvalidFile().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ReadInvalidFile, a, b2);
      }
      static $() {
        return ["ReadInvalidFile|1 path 9|2 reason 9"];
      }
    };
  }
});
