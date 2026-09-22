/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/agent/v1/fetch_cloud_agent_data_tool_pb.js
 * Bundle: sand-host/agent-isolation/transcript-mirror-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage59 = "agent.v1.";
var __protoMessage358 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage59;
  }
};
var FetchCloudAgentDataArgs = class _FetchCloudAgentDataArgs extends __protoMessage358 {
  constructor(data) {
    super();
    this.bcIds = [];
    this.sources = [];
    this.statuses = [];
    this.includeTeamWide = false;
    this.includeArchived = false;
    this.includeTranscript = false;
    this.activeSince = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _FetchCloudAgentDataArgs().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _FetchCloudAgentDataArgs().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _FetchCloudAgentDataArgs().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_FetchCloudAgentDataArgs, a, b);
  }
  static $() {
    return ["FetchCloudAgentDataArgs|4 bc_ids 9*|6 sources 9*|7 statuses 9*|8 include_team_wide 8|9 include_archived 8|10 limit 5?|12 include_transcript 8|13 active_since 9"];
  }
};
var FetchCloudAgentDataResult = class _FetchCloudAgentDataResult extends __protoMessage358 {
  constructor(data) {
    super();
    this.result = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _FetchCloudAgentDataResult().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _FetchCloudAgentDataResult().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _FetchCloudAgentDataResult().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_FetchCloudAgentDataResult, a, b);
  }
  static $() {
    return ["FetchCloudAgentDataResult|1 success #0 result|2 error #1 result", FetchCloudAgentDataSuccess, FetchCloudAgentDataError];
  }
};
var FetchCloudAgentDataSuccess = class _FetchCloudAgentDataSuccess extends __protoMessage358 {
  constructor(data) {
    super();
    this.summary = "";
    this.agentCount = 0;
    this.writtenPaths = [];
    this.unavailableBcIds = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _FetchCloudAgentDataSuccess().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _FetchCloudAgentDataSuccess().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _FetchCloudAgentDataSuccess().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_FetchCloudAgentDataSuccess, a, b);
  }
  static $() {
    return ["FetchCloudAgentDataSuccess|1 summary 9|2 agent_count 5|3 written_paths 9*|4 unavailable_bc_ids 9*"];
  }
};
var FetchCloudAgentDataError = class _FetchCloudAgentDataError extends __protoMessage358 {
  constructor(data) {
    super();
    this.error = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _FetchCloudAgentDataError().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _FetchCloudAgentDataError().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _FetchCloudAgentDataError().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_FetchCloudAgentDataError, a, b);
  }
  static $() {
    return ["FetchCloudAgentDataError|1 error 9"];
  }
};
var FetchCloudAgentDataToolCall = class _FetchCloudAgentDataToolCall extends __protoMessage358 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options) {
    return new _FetchCloudAgentDataToolCall().fromBinary(bytes, options);
  }
  static fromJson(jsonValue, options) {
    return new _FetchCloudAgentDataToolCall().fromJson(jsonValue, options);
  }
  static fromJsonString(jsonString, options) {
    return new _FetchCloudAgentDataToolCall().fromJsonString(jsonString, options);
  }
  static equals(a, b) {
    return proto3.util.equals(_FetchCloudAgentDataToolCall, a, b);
  }
  static $() {
    return ["FetchCloudAgentDataToolCall|1 args #0|2 result #1", FetchCloudAgentDataArgs, FetchCloudAgentDataResult];
  }
};

