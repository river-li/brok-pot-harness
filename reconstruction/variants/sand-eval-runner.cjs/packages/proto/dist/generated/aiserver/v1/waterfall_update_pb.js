/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/aiserver/v1/waterfall_update_pb.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_esm13();
init_compact();
var __protoPackage137 = "aiserver.v1.";
var __protoMessage3132 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage137;
  }
};
var WaterfallLogLevel = /* @__PURE__ */ enumType2(proto3, __protoPackage137, "WaterfallLogLevel", [[0, "UNSPECIFIED"], [1, "DEBUG"], [2, "INFO"], [3, "WARN"], [4, "ERROR"]], 1);
var WaterfallSpanStatusType = /* @__PURE__ */ enumType2(proto3, __protoPackage137, "WaterfallSpanStatusType", [[0, "UNSPECIFIED"], [1, "MESSAGE"], [2, "WARN"], [3, "ERROR"]], 1);
var WaterfallSpanEndStatus = /* @__PURE__ */ enumType2(proto3, __protoPackage137, "WaterfallSpanEndStatus", [[0, "UNSPECIFIED"], [1, "SUCCESS"], [2, "FAILURE"], [3, "SKIPPED"]], 1);
var WaterfallPhaseType = /* @__PURE__ */ enumType2(proto3, __protoPackage137, "WaterfallPhaseType", [[0, "UNSPECIFIED"], [1, "ENVIRONMENT"], [2, "CREATE_CLOUD_WORKSPACE"], [3, "PROVISION_SANDBOX"], [4, "RESTORE_WORKSPACE_FILES"], [5, "DOCKER_BUILD"], [6, "SETUP_REPOSITORY"], [7, "INSTALL_DEPENDENCIES"], [8, "RUN_WORKSPACE_SETUP"], [9, "START_AGENT_SERVICES"], [10, "INSTALL_EXTENSIONS"], [11, "COMPLETE"], [12, "ACQUIRE_POD"], [13, "HYDRATE"]], 1);
var WaterfallUpdate = class _WaterfallUpdate extends __protoMessage3132 {
  constructor(data) {
    super();
    this.update = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WaterfallUpdate().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WaterfallUpdate().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WaterfallUpdate().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WaterfallUpdate, a, b2);
  }
  static $() {
    return ["WaterfallUpdate|1 timestamp #0|2 span_start #1 update|3 span_end #2 update|4 span_log #3 update|5 span_status_update #4 update|6 span_update #5 update|8 sentinel #6 update", Timestamp, SpanStart, SpanEnd, SpanLog, SpanStatusUpdate, SpanUpdate, SetupWaterfallSentinel];
  }
};
var SetupWaterfallSentinel = class _SetupWaterfallSentinel extends __protoMessage3132 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SetupWaterfallSentinel().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SetupWaterfallSentinel().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SetupWaterfallSentinel().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SetupWaterfallSentinel, a, b2);
  }
  static $() {
    return ["SetupWaterfallSentinel"];
  }
};
var SpanStart = class _SpanStart extends __protoMessage3132 {
  constructor(data) {
    super();
    this.spanId = "";
    this.phaseType = WaterfallPhaseType.UNSPECIFIED;
    this.spanDetails = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SpanStart().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SpanStart().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SpanStart().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SpanStart, a, b2);
  }
  static $() {
    return ["SpanStart|1 span_id 9|2 parent_span_id 9?|5 phase_type #0|6 fallback_phase_label 9?|3 git_repos_setup #1 span_details|4 git_repo_setup #2 span_details", WaterfallPhaseType, GitReposSetupSpanDetails, GitRepoSetupSpanDetails];
  }
};
var SpanUpdate = class _SpanUpdate extends __protoMessage3132 {
  constructor(data) {
    super();
    this.spanId = "";
    this.spanUpdate = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SpanUpdate().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SpanUpdate().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SpanUpdate().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SpanUpdate, a, b2);
  }
  static $() {
    return ["SpanUpdate|1 span_id 9|2 generic_log #0 span_update", GenericLogSpanUpdate];
  }
};
var SpanEnd = class _SpanEnd extends __protoMessage3132 {
  constructor(data) {
    super();
    this.spanId = "";
    this.endStatus = WaterfallSpanEndStatus.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SpanEnd().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SpanEnd().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SpanEnd().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SpanEnd, a, b2);
  }
  static $() {
    return ["SpanEnd|1 span_id 9|2 end_status #0", WaterfallSpanEndStatus];
  }
};
var SpanLog = class _SpanLog extends __protoMessage3132 {
  constructor(data) {
    super();
    this.spanId = "";
    this.message = "";
    this.level = WaterfallLogLevel.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SpanLog().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SpanLog().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SpanLog().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SpanLog, a, b2);
  }
  static $() {
    return ["SpanLog|1 span_id 9|2 timestamp #0|3 message 9|4 level #1", Timestamp, WaterfallLogLevel];
  }
};
var SpanStatusUpdate = class _SpanStatusUpdate extends __protoMessage3132 {
  constructor(data) {
    super();
    this.spanId = "";
    this.statusType = WaterfallSpanStatusType.UNSPECIFIED;
    this.message = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SpanStatusUpdate().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SpanStatusUpdate().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SpanStatusUpdate().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SpanStatusUpdate, a, b2);
  }
  static $() {
    return ["SpanStatusUpdate|1 span_id 9|2 timestamp #0|3 status_type #1|4 message 9|5 call_to_action #2?", Timestamp, WaterfallSpanStatusType, CallToAction];
  }
};
var CallToAction = class _CallToAction extends __protoMessage3132 {
  constructor(data) {
    super();
    this.callToAction = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CallToAction().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CallToAction().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CallToAction().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CallToAction, a, b2);
  }
  static $() {
    return ["CallToAction|1 open_url #0 call_to_action", OpenUrlCallToAction];
  }
};
var OpenUrlCallToAction = class _OpenUrlCallToAction extends __protoMessage3132 {
  constructor(data) {
    super();
    this.url = "";
    this.buttonText = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _OpenUrlCallToAction().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _OpenUrlCallToAction().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _OpenUrlCallToAction().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_OpenUrlCallToAction, a, b2);
  }
  static $() {
    return ["OpenUrlCallToAction|1 url 9|2 button_text 9"];
  }
};
var GitReposSetupSpanDetails = class _GitReposSetupSpanDetails extends __protoMessage3132 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GitReposSetupSpanDetails().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GitReposSetupSpanDetails().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GitReposSetupSpanDetails().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GitReposSetupSpanDetails, a, b2);
  }
  static $() {
    return ["GitReposSetupSpanDetails"];
  }
};
var GitRepoSetupSpanDetails = class _GitRepoSetupSpanDetails extends __protoMessage3132 {
  constructor(data) {
    super();
    this.repoDisplayName = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GitRepoSetupSpanDetails().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GitRepoSetupSpanDetails().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GitRepoSetupSpanDetails().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GitRepoSetupSpanDetails, a, b2);
  }
  static $() {
    return ["GitRepoSetupSpanDetails|1 repo_display_name 9"];
  }
};
var GenericLogSpanUpdate = class _GenericLogSpanUpdate extends __protoMessage3132 {
  constructor(data) {
    super();
    this.message = "";
    this.level = WaterfallLogLevel.UNSPECIFIED;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GenericLogSpanUpdate().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GenericLogSpanUpdate().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GenericLogSpanUpdate().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GenericLogSpanUpdate, a, b2);
  }
  static $() {
    return ["GenericLogSpanUpdate|1 timestamp #0|2 message 9|3 level #1", Timestamp, WaterfallLogLevel];
  }
};

