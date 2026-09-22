/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/proto/dist/generated/aiserver/v1/scm_pb.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __protoPackage137, __protoMessage3130, PRCheckStatus, PRCheckAnnotation, PRCheck;
var init_scm_pb = __esm({
  "../packages/proto/dist/generated/aiserver/v1/scm_pb.js"() {
    "use strict";
    init_esm();
    init_compact();
    __protoPackage137 = "aiserver.v1.";
    __protoMessage3130 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage137;
      }
    };
    PRCheckStatus = class _PRCheckStatus extends __protoMessage3130 {
      constructor(data) {
        super();
        this.overallState = "";
        this.successCount = 0;
        this.failureCount = 0;
        this.pendingCount = 0;
        this.neutralCount = 0;
        this.skippedCount = 0;
        this.totalCount = 0;
        this.checks = [];
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PRCheckStatus().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PRCheckStatus().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PRCheckStatus().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PRCheckStatus, a, b2);
      }
      static $() {
        return ["PRCheckStatus|1 overall_state 9|2 success_count 5|3 failure_count 5|4 pending_count 5|5 neutral_count 5|6 skipped_count 5|7 total_count 5|8 checks #0*|9 required_failure_count 5?|10 required_pending_count 5?", PRCheck];
      }
    };
    PRCheckAnnotation = class _PRCheckAnnotation extends __protoMessage3130 {
      constructor(data) {
        super();
        this.path = "";
        this.message = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PRCheckAnnotation().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PRCheckAnnotation().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PRCheckAnnotation().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PRCheckAnnotation, a, b2);
      }
      static $() {
        return ["PRCheckAnnotation|1 path 9|2 start_line 5?|3 end_line 5?|4 annotation_level 9?|5 title 9?|6 message 9"];
      }
    };
    PRCheck = class _PRCheck extends __protoMessage3130 {
      constructor(data) {
        super();
        this.name = "";
        this.status = "";
        this.canRerun = false;
        this.annotations = [];
        this.annotationsTruncated = false;
        this.isRequired = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PRCheck().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PRCheck().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PRCheck().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PRCheck, a, b2);
      }
      static $() {
        return ["PRCheck|1 name 9|2 status 9|3 details_url 9?|4 summary 9?|5 started_at 9?|6 completed_at 9?|7 provider 9?|8 provider_check_id 9?|9 can_rerun 8|10 rerun_disabled_reason 9?|11 annotations #0*|12 annotations_truncated 8|13 is_required 8", PRCheckAnnotation];
      }
    };
  }
});

