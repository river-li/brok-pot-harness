/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/aiserver/v1/usage_signals_pb.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage147, __protoMessage3140, SubjectScore, ProjectionScoreSet, GetProjectionSnapshotRequest, GetProjectionSnapshotResponse;
var init_usage_signals_pb = __esm({
  "../packages/proto/dist/generated/aiserver/v1/usage_signals_pb.js"() {
    "use strict";
    init_esm();
    init_compact();
    __protoPackage147 = "aiserver.v1.";
    __protoMessage3140 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage147;
      }
    };
    SubjectScore = class _SubjectScore extends __protoMessage3140 {
      constructor(data) {
        super();
        this.subjectKey = "";
        this.score = 0;
        this.sampleCount = 0;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SubjectScore().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SubjectScore().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SubjectScore().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SubjectScore, a, b2);
      }
      static $() {
        return ["SubjectScore|1 subject_key 9|2 score 1|3 sample_count 1"];
      }
    };
    ProjectionScoreSet = class _ProjectionScoreSet extends __protoMessage3140 {
      constructor(data) {
        super();
        this.sourceWatermarkMs = protoInt64.zero;
        this.generatedAtMs = protoInt64.zero;
        this.expiresAtMs = protoInt64.zero;
        this.scores = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ProjectionScoreSet().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ProjectionScoreSet().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ProjectionScoreSet().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ProjectionScoreSet, a, b2);
      }
      static $() {
        return ["ProjectionScoreSet|1 source_watermark_ms 3|2 generated_at_ms 3|3 expires_at_ms 3|4 scores #0*", SubjectScore];
      }
    };
    GetProjectionSnapshotRequest = class _GetProjectionSnapshotRequest extends __protoMessage3140 {
      constructor(data) {
        super();
        this.policyId = "";
        this.knownSnapshotVersion = protoInt64.zero;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GetProjectionSnapshotRequest().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GetProjectionSnapshotRequest().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GetProjectionSnapshotRequest().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GetProjectionSnapshotRequest, a, b2);
      }
      static $() {
        return ["GetProjectionSnapshotRequest|1 policy_id 9|2 known_snapshot_version 4"];
      }
    };
    GetProjectionSnapshotResponse = class _GetProjectionSnapshotResponse extends __protoMessage3140 {
      constructor(data) {
        super();
        this.policyId = "";
        this.policyVersion = 0;
        this.snapshotVersion = protoInt64.zero;
        this.notModified = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GetProjectionSnapshotResponse().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GetProjectionSnapshotResponse().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GetProjectionSnapshotResponse().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GetProjectionSnapshotResponse, a, b2);
      }
      static $() {
        return ["GetProjectionSnapshotResponse|1 policy_id 9|2 policy_version 13|3 snapshot_version 4|4 team #0|5 not_modified 8", ProjectionScoreSet];
      }
    };
  }
});

