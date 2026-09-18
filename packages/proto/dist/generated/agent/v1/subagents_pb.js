var __protoPackage12, __protoMessage39, CustomSubagentPermissionMode, SubagentExecutionEnvironment, SubagentBackgroundReason, BackgroundTaskCompletionReason, TaskMode, SubagentType, SubagentTypeUnspecified, SubagentTypeComputerUse, SubagentTypeExplore, SubagentTypeMediaReview, SubagentTypeBash, SubagentTypeShell, SubagentTypeBrowserUse, SubagentTypeVmSetupHelper, SubagentTypeDebug, SubagentTypeCursorGuide, SubagentTypeWatchVideo, SubagentTypeCustom, CustomSubagent;
var init_subagents_pb = __esm({
  "../packages/proto/dist/generated/agent/v1/subagents_pb.js"() {
    "use strict";
    init_esm();
    init_compact();
    __protoPackage12 = "agent.v1.";
    __protoMessage39 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage12;
      }
    };
    CustomSubagentPermissionMode = /* @__PURE__ */ enumType(proto3, __protoPackage12, "CustomSubagentPermissionMode", [[0, "UNSPECIFIED"], [1, "DEFAULT"], [2, "READONLY"], [3, "AGENT_ONLY"]], 1);
    SubagentExecutionEnvironment = /* @__PURE__ */ enumType(proto3, __protoPackage12, "SubagentExecutionEnvironment", [[0, "UNSPECIFIED"], [1, "LOCAL"], [2, "CLOUD"]], 1);
    SubagentBackgroundReason = /* @__PURE__ */ enumType(proto3, __protoPackage12, "SubagentBackgroundReason", [[0, "UNSPECIFIED"], [1, "AGENT_REQUEST"], [2, "USER_REQUEST"], [3, "QUEUED_FOLLOW_UP"]], 1);
    BackgroundTaskCompletionReason = /* @__PURE__ */ enumType(proto3, __protoPackage12, "BackgroundTaskCompletionReason", [[0, "UNSPECIFIED"], [1, "TASK_FINISHED"], [2, "TASK_PROGRESS"], [3, "WORKER_REPARENTED"], [4, "WORKER_MESSAGE"], [5, "WORKER_NEEDS_ATTENTION"]], 1);
    TaskMode = /* @__PURE__ */ enumType(proto3, __protoPackage12, "TaskMode", [[0, "UNSPECIFIED"], [1, "AGENT"], [2, "PLAN"]], 1);
    SubagentType = class _SubagentType extends __protoMessage39 {
      constructor(data) {
        super();
        this.type = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SubagentType().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SubagentType().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SubagentType().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SubagentType, a, b2);
      }
      static $() {
        return ["SubagentType|1 unspecified #0 type|2 computer_use #1 type|3 custom #2 type|4 explore #3 type|5 media_review #4 type|6 bash #5 type|7 browser_use #6 type|8 shell #7 type|9 vm_setup_helper #8 type|10 debug #9 type|11 cursor_guide #10 type|12 watch_video #11 type", SubagentTypeUnspecified, SubagentTypeComputerUse, SubagentTypeCustom, SubagentTypeExplore, SubagentTypeMediaReview, SubagentTypeBash, SubagentTypeBrowserUse, SubagentTypeShell, SubagentTypeVmSetupHelper, SubagentTypeDebug, SubagentTypeCursorGuide, SubagentTypeWatchVideo];
      }
    };
    SubagentTypeUnspecified = class _SubagentTypeUnspecified extends __protoMessage39 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SubagentTypeUnspecified().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SubagentTypeUnspecified().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SubagentTypeUnspecified().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SubagentTypeUnspecified, a, b2);
      }
      static $() {
        return ["SubagentTypeUnspecified"];
      }
    };
    SubagentTypeComputerUse = class _SubagentTypeComputerUse extends __protoMessage39 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SubagentTypeComputerUse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SubagentTypeComputerUse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SubagentTypeComputerUse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SubagentTypeComputerUse, a, b2);
      }
      static $() {
        return ["SubagentTypeComputerUse"];
      }
    };
    SubagentTypeExplore = class _SubagentTypeExplore extends __protoMessage39 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SubagentTypeExplore().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SubagentTypeExplore().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SubagentTypeExplore().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SubagentTypeExplore, a, b2);
      }
      static $() {
        return ["SubagentTypeExplore"];
      }
    };
    SubagentTypeMediaReview = class _SubagentTypeMediaReview extends __protoMessage39 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SubagentTypeMediaReview().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SubagentTypeMediaReview().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SubagentTypeMediaReview().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SubagentTypeMediaReview, a, b2);
      }
      static $() {
        return ["SubagentTypeMediaReview"];
      }
    };
    SubagentTypeBash = class _SubagentTypeBash extends __protoMessage39 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SubagentTypeBash().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SubagentTypeBash().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SubagentTypeBash().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SubagentTypeBash, a, b2);
      }
      static $() {
        return ["SubagentTypeBash"];
      }
    };
    SubagentTypeShell = class _SubagentTypeShell extends __protoMessage39 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SubagentTypeShell().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SubagentTypeShell().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SubagentTypeShell().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SubagentTypeShell, a, b2);
      }
      static $() {
        return ["SubagentTypeShell"];
      }
    };
    SubagentTypeBrowserUse = class _SubagentTypeBrowserUse extends __protoMessage39 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SubagentTypeBrowserUse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SubagentTypeBrowserUse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SubagentTypeBrowserUse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SubagentTypeBrowserUse, a, b2);
      }
      static $() {
        return ["SubagentTypeBrowserUse"];
      }
    };
    SubagentTypeVmSetupHelper = class _SubagentTypeVmSetupHelper extends __protoMessage39 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SubagentTypeVmSetupHelper().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SubagentTypeVmSetupHelper().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SubagentTypeVmSetupHelper().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SubagentTypeVmSetupHelper, a, b2);
      }
      static $() {
        return ["SubagentTypeVmSetupHelper"];
      }
    };
    SubagentTypeDebug = class _SubagentTypeDebug extends __protoMessage39 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SubagentTypeDebug().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SubagentTypeDebug().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SubagentTypeDebug().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SubagentTypeDebug, a, b2);
      }
      static $() {
        return ["SubagentTypeDebug"];
      }
    };
    SubagentTypeCursorGuide = class _SubagentTypeCursorGuide extends __protoMessage39 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SubagentTypeCursorGuide().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SubagentTypeCursorGuide().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SubagentTypeCursorGuide().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SubagentTypeCursorGuide, a, b2);
      }
      static $() {
        return ["SubagentTypeCursorGuide"];
      }
    };
    SubagentTypeWatchVideo = class _SubagentTypeWatchVideo extends __protoMessage39 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SubagentTypeWatchVideo().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SubagentTypeWatchVideo().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SubagentTypeWatchVideo().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SubagentTypeWatchVideo, a, b2);
      }
      static $() {
        return ["SubagentTypeWatchVideo"];
      }
    };
    SubagentTypeCustom = class _SubagentTypeCustom extends __protoMessage39 {
      constructor(data) {
        super();
        this.name = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SubagentTypeCustom().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SubagentTypeCustom().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SubagentTypeCustom().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SubagentTypeCustom, a, b2);
      }
      static $() {
        return ["SubagentTypeCustom|1 name 9"];
      }
    };
    CustomSubagent = class _CustomSubagent extends __protoMessage39 {
      constructor(data) {
        super();
        this.fullPath = "";
        this.name = "";
        this.description = "";
        this.tools = [];
        this.model = "";
        this.prompt = "";
        this.permissionMode = CustomSubagentPermissionMode.UNSPECIFIED;
        this.isBackground = false;
        this.forceDefaultModel = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CustomSubagent().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CustomSubagent().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CustomSubagent().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CustomSubagent, a, b2);
      }
      static $() {
        return ["CustomSubagent|1 full_path 9|2 name 9|3 description 9|4 tools 9*|5 model 9|6 prompt 9|7 permission_mode #0|8 is_background 8|9 plugin 9?|10 marketplace 9?|11 plugin_id 9?|12 marketplace_id 9?|13 force_default_model 8|14 source 9?", CustomSubagentPermissionMode];
      }
    };
  }
});
