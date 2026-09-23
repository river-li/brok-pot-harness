var __protoPackage39, __protoMessage339, RecordingMode, RequestedFilePathRejectedReason, RecordScreenArgs, RecordScreenResult, RecordScreenStartSuccess, RecordScreenSaveSuccess, RecordScreenDiscardSuccess, RecordScreenFailure;
var init_record_screen_exec_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/record_screen_exec_pb.js"() {
    "use strict";
    init_esm13();
    init_compact();
    __protoPackage39 = "agent.v1.";
    __protoMessage339 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage39;
      }
    };
    RecordingMode = /* @__PURE__ */ enumType2(proto3, __protoPackage39, "RecordingMode", [[0, "UNSPECIFIED"], [1, "START_RECORDING"], [2, "SAVE_RECORDING"], [3, "DISCARD_RECORDING"]], 1);
    RequestedFilePathRejectedReason = /* @__PURE__ */ enumType2(proto3, __protoPackage39, "RequestedFilePathRejectedReason", [[0, "UNSPECIFIED"], [1, "SLASHES_NOT_ALLOWED"]], 1);
    RecordScreenArgs = class _RecordScreenArgs extends __protoMessage339 {
      constructor(data) {
        super();
        this.mode = RecordingMode.UNSPECIFIED;
        this.toolCallId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RecordScreenArgs().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RecordScreenArgs().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RecordScreenArgs().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RecordScreenArgs, a, b2);
      }
      static $() {
        return ["RecordScreenArgs|1 mode #0|2 tool_call_id 9|3 save_as_filename 9?", RecordingMode];
      }
    };
    RecordScreenResult = class _RecordScreenResult extends __protoMessage339 {
      constructor(data) {
        super();
        this.result = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RecordScreenResult().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RecordScreenResult().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RecordScreenResult().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RecordScreenResult, a, b2);
      }
      static $() {
        return ["RecordScreenResult|1 start_success #0 result|2 save_success #1 result|3 discard_success #2 result|4 failure #3 result", RecordScreenStartSuccess, RecordScreenSaveSuccess, RecordScreenDiscardSuccess, RecordScreenFailure];
      }
    };
    RecordScreenStartSuccess = class _RecordScreenStartSuccess extends __protoMessage339 {
      constructor(data) {
        super();
        this.wasPriorRecordingCancelled = false;
        this.wasSaveAsFilenameIgnored = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RecordScreenStartSuccess().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RecordScreenStartSuccess().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RecordScreenStartSuccess().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RecordScreenStartSuccess, a, b2);
      }
      static $() {
        return ["RecordScreenStartSuccess|1 was_prior_recording_cancelled 8|2 was_save_as_filename_ignored 8"];
      }
    };
    RecordScreenSaveSuccess = class _RecordScreenSaveSuccess extends __protoMessage339 {
      constructor(data) {
        super();
        this.path = "";
        this.recordingDurationMs = protoInt64.zero;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RecordScreenSaveSuccess().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RecordScreenSaveSuccess().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RecordScreenSaveSuccess().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RecordScreenSaveSuccess, a, b2);
      }
      static $() {
        return ["RecordScreenSaveSuccess|1 path 9|2 recording_duration_ms 3|3 requested_file_path_rejected_reason #0?", RequestedFilePathRejectedReason];
      }
    };
    RecordScreenDiscardSuccess = class _RecordScreenDiscardSuccess extends __protoMessage339 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RecordScreenDiscardSuccess().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RecordScreenDiscardSuccess().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RecordScreenDiscardSuccess().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RecordScreenDiscardSuccess, a, b2);
      }
      static $() {
        return ["RecordScreenDiscardSuccess"];
      }
    };
    RecordScreenFailure = class _RecordScreenFailure extends __protoMessage339 {
      constructor(data) {
        super();
        this.error = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _RecordScreenFailure().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _RecordScreenFailure().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _RecordScreenFailure().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_RecordScreenFailure, a, b2);
      }
      static $() {
        return ["RecordScreenFailure|1 error 9"];
      }
    };
  }
});
