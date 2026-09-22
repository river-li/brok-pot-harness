/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/subagents_pb.js
 * Bundle: sand-host/agent-isolation/transcript-mirror-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage = "agent.v1.";
var __protoMessage3 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage;
  }
};
var SubagentExecutionEnvironment = /* @__PURE__ */ enumType(proto3, __protoPackage, "SubagentExecutionEnvironment", [[0, "UNSPECIFIED"], [1, "LOCAL"], [2, "CLOUD"]], 1);
var SubagentBackgroundReason = /* @__PURE__ */ enumType(proto3, __protoPackage, "SubagentBackgroundReason", [[0, "UNSPECIFIED"], [1, "AGENT_REQUEST"], [2, "USER_REQUEST"], [3, "QUEUED_FOLLOW_UP"]], 1);
var BackgroundTaskCompletionReason = /* @__PURE__ */ enumType(proto3, __protoPackage, "BackgroundTaskCompletionReason", [[0, "UNSPECIFIED"], [1, "TASK_FINISHED"], [2, "TASK_PROGRESS"], [3, "WORKER_REPARENTED"], [4, "WORKER_MESSAGE"], [5, "WORKER_NEEDS_ATTENTION"]], 1);
var TaskMode = /* @__PURE__ */ enumType(proto3, __protoPackage, "TaskMode", [[0, "UNSPECIFIED"], [1, "AGENT"], [2, "PLAN"]], 1);
var SubagentType = class _SubagentType extends __protoMessage3 {
  constructor(data) {
    super();
    this.type = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SubagentType().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SubagentType().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SubagentType().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SubagentType, a, b);
  }
  static $() {
    return ["SubagentType|1 unspecified #0 type|2 computer_use #1 type|3 custom #2 type|4 explore #3 type|5 media_review #4 type|6 bash #5 type|7 browser_use #6 type|8 shell #7 type|9 vm_setup_helper #8 type|10 debug #9 type|11 cursor_guide #10 type|12 watch_video #11 type", SubagentTypeUnspecified, SubagentTypeComputerUse, SubagentTypeCustom, SubagentTypeExplore, SubagentTypeMediaReview, SubagentTypeBash, SubagentTypeBrowserUse, SubagentTypeShell, SubagentTypeVmSetupHelper, SubagentTypeDebug, SubagentTypeCursorGuide, SubagentTypeWatchVideo];
  }
};
var SubagentTypeUnspecified = class _SubagentTypeUnspecified extends __protoMessage3 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SubagentTypeUnspecified().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SubagentTypeUnspecified().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SubagentTypeUnspecified().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SubagentTypeUnspecified, a, b);
  }
  static $() {
    return ["SubagentTypeUnspecified"];
  }
};
var SubagentTypeComputerUse = class _SubagentTypeComputerUse extends __protoMessage3 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SubagentTypeComputerUse().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SubagentTypeComputerUse().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SubagentTypeComputerUse().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SubagentTypeComputerUse, a, b);
  }
  static $() {
    return ["SubagentTypeComputerUse"];
  }
};
var SubagentTypeExplore = class _SubagentTypeExplore extends __protoMessage3 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SubagentTypeExplore().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SubagentTypeExplore().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SubagentTypeExplore().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SubagentTypeExplore, a, b);
  }
  static $() {
    return ["SubagentTypeExplore"];
  }
};
var SubagentTypeMediaReview = class _SubagentTypeMediaReview extends __protoMessage3 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SubagentTypeMediaReview().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SubagentTypeMediaReview().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SubagentTypeMediaReview().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SubagentTypeMediaReview, a, b);
  }
  static $() {
    return ["SubagentTypeMediaReview"];
  }
};
var SubagentTypeBash = class _SubagentTypeBash extends __protoMessage3 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SubagentTypeBash().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SubagentTypeBash().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SubagentTypeBash().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SubagentTypeBash, a, b);
  }
  static $() {
    return ["SubagentTypeBash"];
  }
};
var SubagentTypeShell = class _SubagentTypeShell extends __protoMessage3 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SubagentTypeShell().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SubagentTypeShell().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SubagentTypeShell().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SubagentTypeShell, a, b);
  }
  static $() {
    return ["SubagentTypeShell"];
  }
};
var SubagentTypeBrowserUse = class _SubagentTypeBrowserUse extends __protoMessage3 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SubagentTypeBrowserUse().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SubagentTypeBrowserUse().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SubagentTypeBrowserUse().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SubagentTypeBrowserUse, a, b);
  }
  static $() {
    return ["SubagentTypeBrowserUse"];
  }
};
var SubagentTypeVmSetupHelper = class _SubagentTypeVmSetupHelper extends __protoMessage3 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SubagentTypeVmSetupHelper().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SubagentTypeVmSetupHelper().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SubagentTypeVmSetupHelper().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SubagentTypeVmSetupHelper, a, b);
  }
  static $() {
    return ["SubagentTypeVmSetupHelper"];
  }
};
var SubagentTypeDebug = class _SubagentTypeDebug extends __protoMessage3 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SubagentTypeDebug().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SubagentTypeDebug().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SubagentTypeDebug().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SubagentTypeDebug, a, b);
  }
  static $() {
    return ["SubagentTypeDebug"];
  }
};
var SubagentTypeCursorGuide = class _SubagentTypeCursorGuide extends __protoMessage3 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SubagentTypeCursorGuide().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SubagentTypeCursorGuide().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SubagentTypeCursorGuide().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SubagentTypeCursorGuide, a, b);
  }
  static $() {
    return ["SubagentTypeCursorGuide"];
  }
};
var SubagentTypeWatchVideo = class _SubagentTypeWatchVideo extends __protoMessage3 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SubagentTypeWatchVideo().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SubagentTypeWatchVideo().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SubagentTypeWatchVideo().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SubagentTypeWatchVideo, a, b);
  }
  static $() {
    return ["SubagentTypeWatchVideo"];
  }
};
var SubagentTypeCustom = class _SubagentTypeCustom extends __protoMessage3 {
  constructor(data) {
    super();
    this.name = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _SubagentTypeCustom().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _SubagentTypeCustom().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _SubagentTypeCustom().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_SubagentTypeCustom, a, b);
  }
  static $() {
    return ["SubagentTypeCustom|1 name 9"];
  }
};

