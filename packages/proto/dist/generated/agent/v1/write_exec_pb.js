/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/write_exec_pb.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage101, __protoMessage397, WriteArgs, WriteResult, WriteSuccess, WritePermissionDenied, WriteNoSpace, WriteError, WriteRejected;
var init_write_exec_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/write_exec_pb.js"() {
    "use strict";
    init_esm();
    init_compact();
    __protoPackage101 = "agent.v1.";
    __protoMessage397 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage101;
      }
    };
    WriteArgs = class _WriteArgs extends __protoMessage397 {
      constructor(data) {
        super();
        this.path = "";
        this.fileText = "";
        this.toolCallId = "";
        this.returnFileContentAfterWrite = false;
        this.fileBytes = new Uint8Array(0);
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _WriteArgs().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _WriteArgs().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _WriteArgs().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_WriteArgs, a, b2);
      }
      static $() {
        return ["WriteArgs|1 path 9|2 file_text 9|3 tool_call_id 9|4 return_file_content_after_write 8|5 file_bytes 12|6 encoding_hint 9?"];
      }
    };
    WriteResult = class _WriteResult extends __protoMessage397 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _WriteResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _WriteResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _WriteResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_WriteResult, a, b2);
      }
      static $() {
        return ["WriteResult|1 success #0 result|3 permission_denied #1 result|4 no_space #2 result|5 error #3 result|6 rejected #4 result", WriteSuccess, WritePermissionDenied, WriteNoSpace, WriteError, WriteRejected];
      }
    };
    WriteSuccess = class _WriteSuccess extends __protoMessage397 {
      constructor(data) {
        super();
        this.path = "";
        this.linesCreated = 0;
        this.fileSize = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _WriteSuccess().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _WriteSuccess().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _WriteSuccess().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_WriteSuccess, a, b2);
      }
      static $() {
        return ["WriteSuccess|1 path 9|2 lines_created 5|3 file_size 5|4 file_content_after_write 9?"];
      }
    };
    WritePermissionDenied = class _WritePermissionDenied extends __protoMessage397 {
      constructor(data) {
        super();
        this.path = "";
        this.directory = "";
        this.operation = "";
        this.error = "";
        this.isReadonly = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _WritePermissionDenied().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _WritePermissionDenied().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _WritePermissionDenied().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_WritePermissionDenied, a, b2);
      }
      static $() {
        return ["WritePermissionDenied|1 path 9|2 directory 9|3 operation 9|4 error 9|5 is_readonly 8"];
      }
    };
    WriteNoSpace = class _WriteNoSpace extends __protoMessage397 {
      constructor(data) {
        super();
        this.path = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _WriteNoSpace().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _WriteNoSpace().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _WriteNoSpace().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_WriteNoSpace, a, b2);
      }
      static $() {
        return ["WriteNoSpace|1 path 9"];
      }
    };
    WriteError = class _WriteError extends __protoMessage397 {
      constructor(data) {
        super();
        this.path = "";
        this.error = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _WriteError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _WriteError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _WriteError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_WriteError, a, b2);
      }
      static $() {
        return ["WriteError|1 path 9|2 error 9"];
      }
    };
    WriteRejected = class _WriteRejected extends __protoMessage397 {
      constructor(data) {
        super();
        this.path = "";
        this.reason = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _WriteRejected().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _WriteRejected().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _WriteRejected().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_WriteRejected, a, b2);
      }
      static $() {
        return ["WriteRejected|1 path 9|2 reason 9"];
      }
    };
  }
});

