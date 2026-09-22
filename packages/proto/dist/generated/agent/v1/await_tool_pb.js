/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/await_tool_pb.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage60, __protoMessage357, AwaitArgs, AwaitTaskComplete, AwaitTaskStillRunning, AwaitError, AwaitSuccess, AwaitResult, AwaitToolCall;
var init_await_tool_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/await_tool_pb.js"() {
    "use strict";
    init_esm();
    init_compact();
    __protoPackage60 = "agent.v1.";
    __protoMessage357 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage60;
      }
    };
    AwaitArgs = class _AwaitArgs extends __protoMessage357 {
      constructor(data) {
        super();
        this.taskId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AwaitArgs().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AwaitArgs().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AwaitArgs().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AwaitArgs, a, b2);
      }
      static $() {
        return ["AwaitArgs|1 task_id 9|2 block_until_ms 13?|3 regex 9?"];
      }
    };
    AwaitTaskComplete = class _AwaitTaskComplete extends __protoMessage357 {
      constructor(data) {
        super();
        this.taskId = "";
        this.runtimeMs = protoInt64.zero;
        this.outputFilePath = "";
        this.outputLength = protoInt64.zero;
        this.regexRequested = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AwaitTaskComplete().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AwaitTaskComplete().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AwaitTaskComplete().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AwaitTaskComplete, a, b2);
      }
      static $() {
        return ["AwaitTaskComplete|1 task_id 9|2 runtime_ms 4|3 output_file_path 9|4 output_length 4|5 regex_requested 8|6 regex_match 9?|7 exit_code 17?|8 wake_reason 9?"];
      }
    };
    AwaitTaskStillRunning = class _AwaitTaskStillRunning extends __protoMessage357 {
      constructor(data) {
        super();
        this.taskId = "";
        this.runtimeMs = protoInt64.zero;
        this.outputFilePath = "";
        this.outputLength = protoInt64.zero;
        this.regexRequested = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AwaitTaskStillRunning().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AwaitTaskStillRunning().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AwaitTaskStillRunning().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AwaitTaskStillRunning, a, b2);
      }
      static $() {
        return ["AwaitTaskStillRunning|1 task_id 9|2 runtime_ms 4|3 output_file_path 9|4 output_length 4|5 regex_requested 8|6 regex_match 9?|7 wake_reason 9?"];
      }
    };
    AwaitError = class _AwaitError extends __protoMessage357 {
      constructor(data) {
        super();
        this.error = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AwaitError().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AwaitError().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AwaitError().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AwaitError, a, b2);
      }
      static $() {
        return ["AwaitError|1 error 9"];
      }
    };
    AwaitSuccess = class _AwaitSuccess extends __protoMessage357 {
      constructor(data) {
        super();
        this.awaitResult = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AwaitSuccess().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AwaitSuccess().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AwaitSuccess().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AwaitSuccess, a, b2);
      }
      static $() {
        return ["AwaitSuccess|1 complete #0 await_result|2 still_running #1 await_result", AwaitTaskComplete, AwaitTaskStillRunning];
      }
    };
    AwaitResult = class _AwaitResult extends __protoMessage357 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AwaitResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AwaitResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AwaitResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AwaitResult, a, b2);
      }
      static $() {
        return ["AwaitResult|1 complete #0 result|2 still_running #1 result|3 error #2 result|4 success #3 result", AwaitTaskComplete, AwaitTaskStillRunning, AwaitError, AwaitSuccess];
      }
    };
    AwaitToolCall = class _AwaitToolCall extends __protoMessage357 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _AwaitToolCall().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _AwaitToolCall().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _AwaitToolCall().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_AwaitToolCall, a, b2);
      }
      static $() {
        return ["AwaitToolCall|1 args #0|2 result #1", AwaitArgs, AwaitResult];
      }
    };
  }
});

