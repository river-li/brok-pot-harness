/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/origin/v1/sync_pb.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_esm();
init_compact();
var __protoPackage180 = "origin.v1.";
var __protoMessage3171 = class extends CompactMessage {
  static get runtime() {
    return defineOwn(this, "runtime", proto3);
  }
  static $p() {
    return __protoPackage180;
  }
};
var WatchChangeSyncEventsRequest = class _WatchChangeSyncEventsRequest extends __protoMessage3171 {
  constructor(data) {
    super();
    this.changeNumber = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WatchChangeSyncEventsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WatchChangeSyncEventsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WatchChangeSyncEventsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WatchChangeSyncEventsRequest, a, b2);
  }
  static $() {
    return ["WatchChangeSyncEventsRequest|1 identifier #0|2 change_number 4", ClientRepoIdentifier];
  }
};
var WatchChangeSyncEventsResponse = class _WatchChangeSyncEventsResponse extends __protoMessage3171 {
  constructor(data) {
    super();
    this.frame = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WatchChangeSyncEventsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WatchChangeSyncEventsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WatchChangeSyncEventsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WatchChangeSyncEventsResponse, a, b2);
  }
  static $() {
    return ["WatchChangeSyncEventsResponse|1 snapshot_json 9 frame|2 event_json 9 frame|3 heartbeat #0 frame", SyncEventHeartbeat];
  }
};
var SyncEventHeartbeat = class _SyncEventHeartbeat extends __protoMessage3171 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _SyncEventHeartbeat().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _SyncEventHeartbeat().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _SyncEventHeartbeat().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_SyncEventHeartbeat, a, b2);
  }
  static $() {
    return ["SyncEventHeartbeat"];
  }
};
var ChangeSyncTarget = class _ChangeSyncTarget extends __protoMessage3171 {
  constructor(data) {
    super();
    this.changeNumber = protoInt64.zero;
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _ChangeSyncTarget().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _ChangeSyncTarget().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _ChangeSyncTarget().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_ChangeSyncTarget, a, b2);
  }
  static $() {
    return ["ChangeSyncTarget|1 identifier #0|2 change_number 4", ClientRepoIdentifier];
  }
};
var WatchChangeSyncEventsV2Request = class _WatchChangeSyncEventsV2Request extends __protoMessage3171 {
  constructor(data) {
    super();
    this.subscriptions = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WatchChangeSyncEventsV2Request().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WatchChangeSyncEventsV2Request().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WatchChangeSyncEventsV2Request().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WatchChangeSyncEventsV2Request, a, b2);
  }
  static $() {
    return ["WatchChangeSyncEventsV2Request|1 subscriptions #0*", ChangeSyncTarget];
  }
};
var WatchSyncSessionStarted = class _WatchSyncSessionStarted extends __protoMessage3171 {
  constructor(data) {
    super();
    this.connectionId = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WatchSyncSessionStarted().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WatchSyncSessionStarted().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WatchSyncSessionStarted().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WatchSyncSessionStarted, a, b2);
  }
  static $() {
    return ["WatchSyncSessionStarted|1 connection_id 9"];
  }
};
var TaggedSyncSnapshot = class _TaggedSyncSnapshot extends __protoMessage3171 {
  constructor(data) {
    super();
    this.snapshotJson = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TaggedSyncSnapshot().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TaggedSyncSnapshot().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TaggedSyncSnapshot().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TaggedSyncSnapshot, a, b2);
  }
  static $() {
    return ["TaggedSyncSnapshot|1 target #0|2 snapshot_json 9", ChangeSyncTarget];
  }
};
var TaggedSyncEvent = class _TaggedSyncEvent extends __protoMessage3171 {
  constructor(data) {
    super();
    this.eventJson = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _TaggedSyncEvent().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _TaggedSyncEvent().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _TaggedSyncEvent().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_TaggedSyncEvent, a, b2);
  }
  static $() {
    return ["TaggedSyncEvent|1 target #0|2 event_json 9", ChangeSyncTarget];
  }
};
var WatchSyncSubscriptionNack = class _WatchSyncSubscriptionNack extends __protoMessage3171 {
  constructor(data) {
    super();
    this.reason = "";
    this.message = "";
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WatchSyncSubscriptionNack().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WatchSyncSubscriptionNack().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WatchSyncSubscriptionNack().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WatchSyncSubscriptionNack, a, b2);
  }
  static $() {
    return ["WatchSyncSubscriptionNack|1 target #0|2 reason 9|3 message 9", ChangeSyncTarget];
  }
};
var WatchSyncSubscriptionRemoved = class _WatchSyncSubscriptionRemoved extends __protoMessage3171 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WatchSyncSubscriptionRemoved().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WatchSyncSubscriptionRemoved().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WatchSyncSubscriptionRemoved().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WatchSyncSubscriptionRemoved, a, b2);
  }
  static $() {
    return ["WatchSyncSubscriptionRemoved|1 target #0", ChangeSyncTarget];
  }
};
var WatchChangeSyncEventsV2Response = class _WatchChangeSyncEventsV2Response extends __protoMessage3171 {
  constructor(data) {
    super();
    this.frame = { case: void 0 };
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _WatchChangeSyncEventsV2Response().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _WatchChangeSyncEventsV2Response().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _WatchChangeSyncEventsV2Response().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_WatchChangeSyncEventsV2Response, a, b2);
  }
  static $() {
    return ["WatchChangeSyncEventsV2Response|1 session #0 frame|2 snapshot #1 frame|3 event #2 frame|4 heartbeat #3 frame|5 nack #4 frame|6 removed #5 frame", WatchSyncSessionStarted, TaggedSyncSnapshot, TaggedSyncEvent, SyncEventHeartbeat, WatchSyncSubscriptionNack, WatchSyncSubscriptionRemoved];
  }
};
var UpdateWatchChangeSyncSubscriptionsRequest = class _UpdateWatchChangeSyncSubscriptionsRequest extends __protoMessage3171 {
  constructor(data) {
    super();
    this.connectionId = "";
    this.add = [];
    this.remove = [];
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateWatchChangeSyncSubscriptionsRequest().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateWatchChangeSyncSubscriptionsRequest().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateWatchChangeSyncSubscriptionsRequest().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateWatchChangeSyncSubscriptionsRequest, a, b2);
  }
  static $() {
    return ["UpdateWatchChangeSyncSubscriptionsRequest|1 connection_id 9|2 add #0*|3 remove #0*", ChangeSyncTarget];
  }
};
var UpdateWatchChangeSyncSubscriptionsResponse = class _UpdateWatchChangeSyncSubscriptionsResponse extends __protoMessage3171 {
  constructor(data) {
    super();
    proto3.util.initPartial(data, this);
  }
  static fromBinary(bytes, options2) {
    return new _UpdateWatchChangeSyncSubscriptionsResponse().fromBinary(bytes, options2);
  }
  static fromJson(jsonValue, options2) {
    return new _UpdateWatchChangeSyncSubscriptionsResponse().fromJson(jsonValue, options2);
  }
  static fromJsonString(jsonString, options2) {
    return new _UpdateWatchChangeSyncSubscriptionsResponse().fromJsonString(jsonString, options2);
  }
  static equals(a, b2) {
    return proto3.util.equals(_UpdateWatchChangeSyncSubscriptionsResponse, a, b2);
  }
  static $() {
    return ["UpdateWatchChangeSyncSubscriptionsResponse"];
  }
};

