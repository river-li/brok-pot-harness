var __protoPackage6, __protoMessage35, PodCreatingPhase, GitCloneFailureCategory, ImagePullFailureCategory, PodStatus, PodCreatingStatus, PodRunningStatus, PodFailedStatus, PodTerminatedStatus, PodFailureDetails, ContainerWaitFailure, InstallCommandFailure, DockerBuildFailure, GitCloneFailure, GitCheckoutFailure, ImagePullFailure;
var init_pod_pb = __esm({
  "../packages/proto/dist/generated/anyrun/v1/pod_pb.js"() {
    "use strict";
    init_esm();
    init_compact();
    __protoPackage6 = "anyrun.v1.";
    __protoMessage35 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage6;
      }
    };
    PodCreatingPhase = /* @__PURE__ */ enumType(proto3, __protoPackage6, "PodCreatingPhase", [[0, "UNSPECIFIED"], [1, "CLONE"], [2, "BUILD"], [3, "POST_CREATE"], [4, "UPDATE_CONTENT"], [5, "POST_START"], [6, "QUEUED"]], 1);
    GitCloneFailureCategory = /* @__PURE__ */ enumType(proto3, __protoPackage6, "GitCloneFailureCategory", [[0, "UNSPECIFIED"], [1, "IP_ALLOW_LIST"], [2, "INVALID_CREDENTIALS"], [3, "SSO_REDIRECT"], [4, "PROXY_CONNECT"], [5, "CONNECTION_RESET"], [6, "TRANSPORT_INTERRUPTED"], [7, "REMOTE_FORBIDDEN"], [8, "UPSTREAM_BAD_GATEWAY"]], 1);
    ImagePullFailureCategory = /* @__PURE__ */ enumType(proto3, __protoPackage6, "ImagePullFailureCategory", [[0, "UNSPECIFIED"], [1, "DENIED"], [2, "UNAUTHORIZED"], [3, "NOT_FOUND"], [4, "RATE_LIMITED"], [5, "UPSTREAM"]], 1);
    PodStatus = class _PodStatus extends __protoMessage35 {
      constructor(data) {
        super();
        this.status = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PodStatus().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PodStatus().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PodStatus().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PodStatus, a, b2);
      }
      static $() {
        return ["PodStatus|1 creating #0 status|2 running #1 status|3 failed #2 status|4 terminated #3 status", PodCreatingStatus, PodRunningStatus, PodFailedStatus, PodTerminatedStatus];
      }
    };
    PodCreatingStatus = class _PodCreatingStatus extends __protoMessage35 {
      constructor(data) {
        super();
        this.phase = PodCreatingPhase.UNSPECIFIED;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PodCreatingStatus().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PodCreatingStatus().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PodCreatingStatus().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PodCreatingStatus, a, b2);
      }
      static $() {
        return ["PodCreatingStatus|1 phase #0", PodCreatingPhase];
      }
    };
    PodRunningStatus = class _PodRunningStatus extends __protoMessage35 {
      constructor(data) {
        super();
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PodRunningStatus().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PodRunningStatus().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PodRunningStatus().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PodRunningStatus, a, b2);
      }
      static $() {
        return ["PodRunningStatus|1 missed_heartbeat_deadline 4?"];
      }
    };
    PodFailedStatus = class _PodFailedStatus extends __protoMessage35 {
      constructor(data) {
        super();
        this.reason = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PodFailedStatus().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PodFailedStatus().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PodFailedStatus().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PodFailedStatus, a, b2);
      }
      static $() {
        return ["PodFailedStatus|1 reason 9|2 failure_details #0?", PodFailureDetails];
      }
    };
    PodTerminatedStatus = class _PodTerminatedStatus extends __protoMessage35 {
      constructor(data) {
        super();
        this.reason = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PodTerminatedStatus().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PodTerminatedStatus().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PodTerminatedStatus().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PodTerminatedStatus, a, b2);
      }
      static $() {
        return ["PodTerminatedStatus|1 reason 9|2 exit_code 13?"];
      }
    };
    PodFailureDetails = class _PodFailureDetails extends __protoMessage35 {
      constructor(data) {
        super();
        this.details = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PodFailureDetails().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PodFailureDetails().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PodFailureDetails().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PodFailureDetails, a, b2);
      }
      static $() {
        return ["PodFailureDetails|1 install_command_failure #0 details|2 docker_build_failure #1 details|3 git_clone_failure #2 details|4 git_checkout_failure #3 details|5 container_wait_failure #4 details|6 image_pull_failure #5 details", InstallCommandFailure, DockerBuildFailure, GitCloneFailure, GitCheckoutFailure, ContainerWaitFailure, ImagePullFailure];
      }
    };
    ContainerWaitFailure = class _ContainerWaitFailure extends __protoMessage35 {
      constructor(data) {
        super();
        this.exitCode = protoInt64.zero;
        this.message = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ContainerWaitFailure().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ContainerWaitFailure().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ContainerWaitFailure().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ContainerWaitFailure, a, b2);
      }
      static $() {
        return ["ContainerWaitFailure|1 exit_code 3|2 message 9"];
      }
    };
    InstallCommandFailure = class _InstallCommandFailure extends __protoMessage35 {
      constructor(data) {
        super();
        this.isSystem = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _InstallCommandFailure().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _InstallCommandFailure().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _InstallCommandFailure().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_InstallCommandFailure, a, b2);
      }
      static $() {
        return ["InstallCommandFailure|1 is_system 8"];
      }
    };
    DockerBuildFailure = class _DockerBuildFailure extends __protoMessage35 {
      constructor(data) {
        super();
        this.exitCode = protoInt64.zero;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _DockerBuildFailure().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _DockerBuildFailure().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _DockerBuildFailure().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_DockerBuildFailure, a, b2);
      }
      static $() {
        return ["DockerBuildFailure|1 exit_code 3"];
      }
    };
    GitCloneFailure = class _GitCloneFailure extends __protoMessage35 {
      constructor(data) {
        super();
        this.exitCode = protoInt64.zero;
        this.category = GitCloneFailureCategory.UNSPECIFIED;
        this.retryable = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GitCloneFailure().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GitCloneFailure().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GitCloneFailure().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GitCloneFailure, a, b2);
      }
      static $() {
        return ["GitCloneFailure|1 exit_code 3|2 category #0|3 retryable 8|4 remote_host 9?|5 http_status 5?", GitCloneFailureCategory];
      }
    };
    GitCheckoutFailure = class _GitCheckoutFailure extends __protoMessage35 {
      constructor(data) {
        super();
        this.exitCode = protoInt64.zero;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _GitCheckoutFailure().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _GitCheckoutFailure().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _GitCheckoutFailure().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_GitCheckoutFailure, a, b2);
      }
      static $() {
        return ["GitCheckoutFailure|1 exit_code 3"];
      }
    };
    ImagePullFailure = class _ImagePullFailure extends __protoMessage35 {
      constructor(data) {
        super();
        this.category = ImagePullFailureCategory.UNSPECIFIED;
        this.retryable = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ImagePullFailure().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ImagePullFailure().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ImagePullFailure().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ImagePullFailure, a, b2);
      }
      static $() {
        return ["ImagePullFailure|1 category #0|2 retryable 8|3 http_status 5?|4 repository 9?", ImagePullFailureCategory];
      }
    };
  }
});
