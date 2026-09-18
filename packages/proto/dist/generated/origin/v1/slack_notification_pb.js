init_esm();
init_compact();
var __protoPackage161 = "origin.v1.";
var __protoMessage3153 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage161;
  }
};
var EventType = /* @__PURE__ */ enumType(proto3, __protoPackage161, "EventType", [[0, "UNSPECIFIED"], [1, "REVIEW_REQUESTED"], [2, "PULL_OPENED"], [3, "PULL_READY"], [4, "PULL_MERGED"], [5, "REVIEW_SUBMITTED"], [6, "COMMENT_CREATED"], [7, "MENTION"]], 1);
var OriginSlackNotification = class _OriginSlackNotification extends __protoMessage3153 {
  constructor(data) {
    super();
    this.id = "";
    this.originNamespaceId = "";
    this.slackTeamId = "";
    this.ignoreDrafts = false;
    this.events = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _OriginSlackNotification().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _OriginSlackNotification().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _OriginSlackNotification().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_OriginSlackNotification, a, b2);
  }
  static $() {
    return ["OriginSlackNotification|1 id 9|2 origin_namespace_id 9|3 slack_team_id 9|4 ignore_drafts 8|5 events #0*|8 notify_app_bots 8?|6 created_at #1|7 updated_at #1", EventType, Timestamp];
  }
};
var UpsertOriginUserSlackNotificationRequest = class _UpsertOriginUserSlackNotificationRequest extends __protoMessage3153 {
  constructor(data) {
    super();
    this.originNamespaceId = "";
    this.ignoreDrafts = false;
    this.events = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpsertOriginUserSlackNotificationRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpsertOriginUserSlackNotificationRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpsertOriginUserSlackNotificationRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpsertOriginUserSlackNotificationRequest, a, b2);
  }
  static $() {
    return ["UpsertOriginUserSlackNotificationRequest|1 origin_namespace_id 9|2 slack_team_id 9?|3 ignore_drafts 8|4 events #0*|5 notify_app_bots 8?", EventType];
  }
};
var UpsertOriginUserSlackNotificationResponse = class _UpsertOriginUserSlackNotificationResponse extends __protoMessage3153 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpsertOriginUserSlackNotificationResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpsertOriginUserSlackNotificationResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpsertOriginUserSlackNotificationResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpsertOriginUserSlackNotificationResponse, a, b2);
  }
  static $() {
    return ["UpsertOriginUserSlackNotificationResponse|1 notification #0", OriginSlackNotification];
  }
};
var DeleteOriginUserSlackNotificationRequest = class _DeleteOriginUserSlackNotificationRequest extends __protoMessage3153 {
  constructor(data) {
    super();
    this.id = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DeleteOriginUserSlackNotificationRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DeleteOriginUserSlackNotificationRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DeleteOriginUserSlackNotificationRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DeleteOriginUserSlackNotificationRequest, a, b2);
  }
  static $() {
    return ["DeleteOriginUserSlackNotificationRequest|1 id 9"];
  }
};
var DeleteOriginUserSlackNotificationResponse = class _DeleteOriginUserSlackNotificationResponse extends __protoMessage3153 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DeleteOriginUserSlackNotificationResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DeleteOriginUserSlackNotificationResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DeleteOriginUserSlackNotificationResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DeleteOriginUserSlackNotificationResponse, a, b2);
  }
  static $() {
    return ["DeleteOriginUserSlackNotificationResponse"];
  }
};
var GetOriginUserSlackNotificationRequest = class _GetOriginUserSlackNotificationRequest extends __protoMessage3153 {
  constructor(data) {
    super();
    this.originNamespaceId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetOriginUserSlackNotificationRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetOriginUserSlackNotificationRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetOriginUserSlackNotificationRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetOriginUserSlackNotificationRequest, a, b2);
  }
  static $() {
    return ["GetOriginUserSlackNotificationRequest|1 slack_team_id 9?|2 origin_namespace_id 9"];
  }
};
var GetOriginUserSlackNotificationResponse = class _GetOriginUserSlackNotificationResponse extends __protoMessage3153 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetOriginUserSlackNotificationResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetOriginUserSlackNotificationResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetOriginUserSlackNotificationResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetOriginUserSlackNotificationResponse, a, b2);
  }
  static $() {
    return ["GetOriginUserSlackNotificationResponse|1 notification #0?", OriginSlackNotification];
  }
};
