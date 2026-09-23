init_esm();
init_compact();
var __protoPackage163 = "origin.v1.";
var __protoMessage3155 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage163;
  }
};
var SlackReviewReminderDayOfWeek = /* @__PURE__ */ enumType(proto3, __protoPackage163, "SlackReviewReminderDayOfWeek", [[0, "UNSPECIFIED"], [1, "MONDAY"], [2, "TUESDAY"], [3, "WEDNESDAY"], [4, "THURSDAY"], [5, "FRIDAY"], [6, "SATURDAY"], [7, "SUNDAY"]], 1);
var OriginSlackReviewReminderFilters = class _OriginSlackReviewReminderFilters extends __protoMessage3155 {
  constructor(data) {
    super();
    this.includeTeamReviewRequests = false;
    this.ignoreDrafts = false;
    this.requiredLabels = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _OriginSlackReviewReminderFilters().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _OriginSlackReviewReminderFilters().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _OriginSlackReviewReminderFilters().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_OriginSlackReviewReminderFilters, a, b2);
  }
  static $() {
    return ["OriginSlackReviewReminderFilters|1 include_team_review_requests 8|2 ignore_drafts 8|3 require_review_request 8?|4 remind_authors_after_reviews 8?|5 ignore_approved_count 8?|6 required_labels 9*"];
  }
};
var OriginSlackReviewReminder = class _OriginSlackReviewReminder extends __protoMessage3155 {
  constructor(data) {
    super();
    this.id = "";
    this.originNamespaceId = "";
    this.slackTeamId = "";
    this.repoIds = [];
    this.daysOfWeek = [];
    this.timesOfDay = [];
    this.timeZone = "";
    this.enabled = false;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _OriginSlackReviewReminder().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _OriginSlackReviewReminder().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _OriginSlackReviewReminder().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_OriginSlackReviewReminder, a, b2);
  }
  static $() {
    return ["OriginSlackReviewReminder|1 id 9|2 origin_namespace_id 9|3 slack_team_id 9|4 repo_ids 9*|5 days_of_week #0*|6 times_of_day 9*|7 time_zone 9|8 filters #1|9 enabled 8|10 last_sent_at #2?|11 last_outcome 9?|12 created_at #2|13 updated_at #2", SlackReviewReminderDayOfWeek, OriginSlackReviewReminderFilters, Timestamp];
  }
};
var CreateOriginUserSlackReviewReminderRequest = class _CreateOriginUserSlackReviewReminderRequest extends __protoMessage3155 {
  constructor(data) {
    super();
    this.originNamespaceId = "";
    this.repoIds = [];
    this.daysOfWeek = [];
    this.timesOfDay = [];
    this.timeZone = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CreateOriginUserSlackReviewReminderRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CreateOriginUserSlackReviewReminderRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CreateOriginUserSlackReviewReminderRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CreateOriginUserSlackReviewReminderRequest, a, b2);
  }
  static $() {
    return ["CreateOriginUserSlackReviewReminderRequest|1 origin_namespace_id 9|2 slack_team_id 9?|3 repo_ids 9*|4 days_of_week #0*|5 times_of_day 9*|6 time_zone 9|7 filters #1|8 enabled 8?", SlackReviewReminderDayOfWeek, OriginSlackReviewReminderFilters];
  }
};
var CreateOriginUserSlackReviewReminderResponse = class _CreateOriginUserSlackReviewReminderResponse extends __protoMessage3155 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _CreateOriginUserSlackReviewReminderResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _CreateOriginUserSlackReviewReminderResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _CreateOriginUserSlackReviewReminderResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_CreateOriginUserSlackReviewReminderResponse, a, b2);
  }
  static $() {
    return ["CreateOriginUserSlackReviewReminderResponse|1 reminder #0", OriginSlackReviewReminder];
  }
};
var UpdateOriginUserSlackReviewReminderRequest = class _UpdateOriginUserSlackReviewReminderRequest extends __protoMessage3155 {
  constructor(data) {
    super();
    this.id = "";
    this.originNamespaceId = "";
    this.repoIds = [];
    this.daysOfWeek = [];
    this.timesOfDay = [];
    this.timeZone = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateOriginUserSlackReviewReminderRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateOriginUserSlackReviewReminderRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateOriginUserSlackReviewReminderRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateOriginUserSlackReviewReminderRequest, a, b2);
  }
  static $() {
    return ["UpdateOriginUserSlackReviewReminderRequest|1 id 9|2 origin_namespace_id 9|3 slack_team_id 9?|4 repo_ids 9*|5 days_of_week #0*|6 times_of_day 9*|7 time_zone 9|8 filters #1|9 enabled 8?", SlackReviewReminderDayOfWeek, OriginSlackReviewReminderFilters];
  }
};
var UpdateOriginUserSlackReviewReminderResponse = class _UpdateOriginUserSlackReviewReminderResponse extends __protoMessage3155 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateOriginUserSlackReviewReminderResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateOriginUserSlackReviewReminderResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateOriginUserSlackReviewReminderResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateOriginUserSlackReviewReminderResponse, a, b2);
  }
  static $() {
    return ["UpdateOriginUserSlackReviewReminderResponse|1 reminder #0", OriginSlackReviewReminder];
  }
};
var ListOriginUserSlackReviewRemindersRequest = class _ListOriginUserSlackReviewRemindersRequest extends __protoMessage3155 {
  constructor(data) {
    super();
    this.originNamespaceId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListOriginUserSlackReviewRemindersRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListOriginUserSlackReviewRemindersRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListOriginUserSlackReviewRemindersRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListOriginUserSlackReviewRemindersRequest, a, b2);
  }
  static $() {
    return ["ListOriginUserSlackReviewRemindersRequest|1 origin_namespace_id 9|2 slack_team_id 9?"];
  }
};
var ListOriginUserSlackReviewRemindersResponse = class _ListOriginUserSlackReviewRemindersResponse extends __protoMessage3155 {
  constructor(data) {
    super();
    this.reminders = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ListOriginUserSlackReviewRemindersResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ListOriginUserSlackReviewRemindersResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ListOriginUserSlackReviewRemindersResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ListOriginUserSlackReviewRemindersResponse, a, b2);
  }
  static $() {
    return ["ListOriginUserSlackReviewRemindersResponse|1 reminders #0*", OriginSlackReviewReminder];
  }
};
var GetOriginUserSlackReviewReminderRequest = class _GetOriginUserSlackReviewReminderRequest extends __protoMessage3155 {
  constructor(data) {
    super();
    this.id = "";
    this.originNamespaceId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetOriginUserSlackReviewReminderRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetOriginUserSlackReviewReminderRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetOriginUserSlackReviewReminderRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetOriginUserSlackReviewReminderRequest, a, b2);
  }
  static $() {
    return ["GetOriginUserSlackReviewReminderRequest|1 id 9|2 origin_namespace_id 9"];
  }
};
var GetOriginUserSlackReviewReminderResponse = class _GetOriginUserSlackReviewReminderResponse extends __protoMessage3155 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _GetOriginUserSlackReviewReminderResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _GetOriginUserSlackReviewReminderResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _GetOriginUserSlackReviewReminderResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_GetOriginUserSlackReviewReminderResponse, a, b2);
  }
  static $() {
    return ["GetOriginUserSlackReviewReminderResponse|1 reminder #0", OriginSlackReviewReminder];
  }
};
var DisableOriginUserSlackReviewReminderRequest = class _DisableOriginUserSlackReviewReminderRequest extends __protoMessage3155 {
  constructor(data) {
    super();
    this.id = "";
    this.originNamespaceId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DisableOriginUserSlackReviewReminderRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DisableOriginUserSlackReviewReminderRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DisableOriginUserSlackReviewReminderRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DisableOriginUserSlackReviewReminderRequest, a, b2);
  }
  static $() {
    return ["DisableOriginUserSlackReviewReminderRequest|1 id 9|2 origin_namespace_id 9"];
  }
};
var DisableOriginUserSlackReviewReminderResponse = class _DisableOriginUserSlackReviewReminderResponse extends __protoMessage3155 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _DisableOriginUserSlackReviewReminderResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _DisableOriginUserSlackReviewReminderResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _DisableOriginUserSlackReviewReminderResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_DisableOriginUserSlackReviewReminderResponse, a, b2);
  }
  static $() {
    return ["DisableOriginUserSlackReviewReminderResponse|1 reminder #0", OriginSlackReviewReminder];
  }
};
