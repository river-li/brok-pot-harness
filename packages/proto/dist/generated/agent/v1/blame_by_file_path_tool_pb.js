var __protoPackage62, __protoMessage358, BlameByFilePathArgs, BlameByFilePathSuccess, BlameByFilePathError, BlameByFilePathResult, BlameByFilePathToolCall;
var init_blame_by_file_path_tool_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/blame_by_file_path_tool_pb.js"() {
    "use strict";
    init_esm();
    init_compact();
    __protoPackage62 = "agent.v1.";
    __protoMessage358 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage62;
      }
    };
    BlameByFilePathArgs = class _BlameByFilePathArgs extends __protoMessage358 {
      constructor(data) {
        super();
        this.filePath = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _BlameByFilePathArgs().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _BlameByFilePathArgs().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _BlameByFilePathArgs().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_BlameByFilePathArgs, a, b2);
      }
      static $() {
        return ["BlameByFilePathArgs|1 file_path 9|2 start_line 5?|3 end_line 5?"];
      }
    };
    BlameByFilePathSuccess = class _BlameByFilePathSuccess extends __protoMessage358 {
      constructor(data) {
        super();
        this.content = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _BlameByFilePathSuccess().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _BlameByFilePathSuccess().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _BlameByFilePathSuccess().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_BlameByFilePathSuccess, a, b2);
      }
      static $() {
        return ["BlameByFilePathSuccess|1 content 9"];
      }
    };
    BlameByFilePathError = class _BlameByFilePathError extends __protoMessage358 {
      constructor(data) {
        super();
        this.errorMessage = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _BlameByFilePathError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _BlameByFilePathError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _BlameByFilePathError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_BlameByFilePathError, a, b2);
      }
      static $() {
        return ["BlameByFilePathError|1 error_message 9"];
      }
    };
    BlameByFilePathResult = class _BlameByFilePathResult extends __protoMessage358 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _BlameByFilePathResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _BlameByFilePathResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _BlameByFilePathResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_BlameByFilePathResult, a, b2);
      }
      static $() {
        return ["BlameByFilePathResult|1 success #0 result|2 error #1 result", BlameByFilePathSuccess, BlameByFilePathError];
      }
    };
    BlameByFilePathToolCall = class _BlameByFilePathToolCall extends __protoMessage358 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _BlameByFilePathToolCall().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _BlameByFilePathToolCall().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _BlameByFilePathToolCall().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_BlameByFilePathToolCall, a, b2);
      }
      static $() {
        return ["BlameByFilePathToolCall|1 args #0|2 result #1", BlameByFilePathArgs, BlameByFilePathResult];
      }
    };
  }
});
