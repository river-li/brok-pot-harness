/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/record_screen_exec_pb.js
 * Bundle: sand-host/agent-isolation/transcript-mirror-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage34 = "agent.v1.";
var __protoMessage333 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage34;
  }
};
var RecordingMode = /* @__PURE__ */ enumType(proto3, __protoPackage34, "RecordingMode", [[0, "UNSPECIFIED"], [1, "START_RECORDING"], [2, "SAVE_RECORDING"], [3, "DISCARD_RECORDING"]], 1);
var RequestedFilePathRejectedReason = /* @__PURE__ */ enumType(proto3, __protoPackage34, "RequestedFilePathRejectedReason", [[0, "UNSPECIFIED"], [1, "SLASHES_NOT_ALLOWED"]], 1);
var RecordScreenArgs = class _RecordScreenArgs extends __protoMessage333 {
  constructor(data) {
    super();
    this.mode = RecordingMode.UNSPECIFIED;
    this.toolCallId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _RecordScreenArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _RecordScreenArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _RecordScreenArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_RecordScreenArgs, a, b);
  }
  static $() {
    return ["RecordScreenArgs|1 mode #0|2 tool_call_id 9|3 save_as_filename 9?", RecordingMode];
  }
};
var RecordScreenResult = class _RecordScreenResult extends __protoMessage333 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _RecordScreenResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _RecordScreenResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _RecordScreenResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_RecordScreenResult, a, b);
  }
  static $() {
    return ["RecordScreenResult|1 start_success #0 result|2 save_success #1 result|3 discard_success #2 result|4 failure #3 result", RecordScreenStartSuccess, RecordScreenSaveSuccess, RecordScreenDiscardSuccess, RecordScreenFailure];
  }
};
var RecordScreenStartSuccess = class _RecordScreenStartSuccess extends __protoMessage333 {
  constructor(data) {
    super();
    this.wasPriorRecordingCancelled = false;
    this.wasSaveAsFilenameIgnored = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _RecordScreenStartSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _RecordScreenStartSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _RecordScreenStartSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_RecordScreenStartSuccess, a, b);
  }
  static $() {
    return ["RecordScreenStartSuccess|1 was_prior_recording_cancelled 8|2 was_save_as_filename_ignored 8"];
  }
};
var RecordScreenSaveSuccess = class _RecordScreenSaveSuccess extends __protoMessage333 {
  constructor(data) {
    super();
    this.path = "";
    this.recordingDurationMs = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _RecordScreenSaveSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _RecordScreenSaveSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _RecordScreenSaveSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_RecordScreenSaveSuccess, a, b);
  }
  static $() {
    return ["RecordScreenSaveSuccess|1 path 9|2 recording_duration_ms 3|3 requested_file_path_rejected_reason #0?", RequestedFilePathRejectedReason];
  }
};
var RecordScreenDiscardSuccess = class _RecordScreenDiscardSuccess extends __protoMessage333 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _RecordScreenDiscardSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _RecordScreenDiscardSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _RecordScreenDiscardSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_RecordScreenDiscardSuccess, a, b);
  }
  static $() {
    return ["RecordScreenDiscardSuccess"];
  }
};
var RecordScreenFailure = class _RecordScreenFailure extends __protoMessage333 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _RecordScreenFailure().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _RecordScreenFailure().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _RecordScreenFailure().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_RecordScreenFailure, a, b);
  }
  static $() {
    return ["RecordScreenFailure|1 error 9"];
  }
};

