var __protoPackage76, __protoMessage373, PiEditReplacement, PiEditToolCall, PiEditToolArgs, PiEditToolResult, PiEditToolSuccess, PiEditToolError, PiEditToolRejected;
var init_pi_edit_tool_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/pi_edit_tool_pb.js"() {
    "use strict";
    init_esm();
    init_compact();
    __protoPackage76 = "agent.v1.";
    __protoMessage373 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage76;
      }
    };
    PiEditReplacement = class _PiEditReplacement extends __protoMessage373 {
      constructor(data) {
        super();
        this.oldText = "";
        this.newText = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PiEditReplacement().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiEditReplacement().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiEditReplacement().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiEditReplacement, a, b2);
      }
      static $() {
        return ["PiEditReplacement|1 old_text 9|2 new_text 9"];
      }
    };
    PiEditToolCall = class _PiEditToolCall extends __protoMessage373 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PiEditToolCall().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiEditToolCall().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiEditToolCall().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiEditToolCall, a, b2);
      }
      static $() {
        return ["PiEditToolCall|1 args #0|2 result #1", PiEditToolArgs, PiEditToolResult];
      }
    };
    PiEditToolArgs = class _PiEditToolArgs extends __protoMessage373 {
      constructor(data) {
        super();
        this.path = "";
        this.edits = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PiEditToolArgs().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiEditToolArgs().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiEditToolArgs().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiEditToolArgs, a, b2);
      }
      static $() {
        return ["PiEditToolArgs|1 path 9|2 edits #0*", PiEditReplacement];
      }
    };
    PiEditToolResult = class _PiEditToolResult extends __protoMessage373 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PiEditToolResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiEditToolResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiEditToolResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiEditToolResult, a, b2);
      }
      static $() {
        return ["PiEditToolResult|1 success #0 result|2 error #1 result|3 rejected #2 result", PiEditToolSuccess, PiEditToolError, PiEditToolRejected];
      }
    };
    PiEditToolSuccess = class _PiEditToolSuccess extends __protoMessage373 {
      constructor(data) {
        super();
        this.output = "";
        this.diff = "";
        this.patch = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PiEditToolSuccess().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiEditToolSuccess().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiEditToolSuccess().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiEditToolSuccess, a, b2);
      }
      static $() {
        return ["PiEditToolSuccess|1 output 9|2 diff 9|3 patch 9|4 first_changed_line 13?"];
      }
    };
    PiEditToolError = class _PiEditToolError extends __protoMessage373 {
      constructor(data) {
        super();
        this.error = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PiEditToolError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiEditToolError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiEditToolError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiEditToolError, a, b2);
      }
      static $() {
        return ["PiEditToolError|1 error 9"];
      }
    };
    PiEditToolRejected = class _PiEditToolRejected extends __protoMessage373 {
      constructor(data) {
        super();
        this.reason = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PiEditToolRejected().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PiEditToolRejected().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PiEditToolRejected().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PiEditToolRejected, a, b2);
      }
      static $() {
        return ["PiEditToolRejected|1 reason 9"];
      }
    };
  }
});
