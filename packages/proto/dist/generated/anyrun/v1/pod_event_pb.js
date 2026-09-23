var __protoPackage5, __protoMessage33, PrivateWorkerWaitReason, ClonePurpose, PodIdentity, PodEvent, LifecycleProcessRestarted, LifecycleProcessExited, SpanStarted, SpanEnded, WaitingForWorkerStatus, HydrationProgress, PodErrorEvent, FeatureOutput, FeatureExitCode, BuildStepStarted, BuildStatusLine, InternalBuildMessage, ImagePullStarted, ImagePullLayerUpdate, ProgressDetail, ImagePullStatusUpdate, ImagePullCompleted, InstallCommand, CloneStarted, CloneCompleted;
var init_pod_event_pb = __esm({
  "../packages/proto/dist/generated/anyrun/v1/pod_event_pb.js"() {
    "use strict";
    init_esm();
    init_pod_daemon_pb();
    init_compact();
    __protoPackage5 = "anyrun.v1.";
    __protoMessage33 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage5;
      }
    };
    PrivateWorkerWaitReason = /* @__PURE__ */ enumType(proto3, __protoPackage5, "PrivateWorkerWaitReason", [[0, "UNSPECIFIED"], [1, "NO_CONNECTED_WORKERS"], [2, "LABEL_MISMATCH"], [3, "OWNER_FILTERED"], [4, "SHARED_ASSIGNMENT_FILTERED"], [5, "ALL_BUSY"]], 1);
    ClonePurpose = /* @__PURE__ */ enumType(proto3, __protoPackage5, "ClonePurpose", [[0, "UNSPECIFIED"], [1, "DOCKER_BUILD"], [2, "WORKSPACE_SETUP"]], 1);
    PodIdentity = class _PodIdentity extends __protoMessage33 {
      constructor(data) {
        super();
        this.tenantId = "";
        this.podId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PodIdentity().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PodIdentity().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PodIdentity().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PodIdentity, a, b2);
      }
      static $() {
        return ["PodIdentity|1 tenant_id 9|2 pod_id 9"];
      }
    };
    PodEvent = class _PodEvent extends __protoMessage33 {
      constructor(data) {
        super();
        this.creationTimestamp = protoInt64.zero;
        this.payload = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PodEvent().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PodEvent().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PodEvent().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PodEvent, a, b2);
      }
      static $() {
        return ["PodEvent|49 creation_timestamp 4|26 error #0 payload|1 debug_event 9 payload|43 hydration_started #1 payload|44 hydration_progress #2 payload|45 hydration_completed #1 payload|31 clone_started #1 payload|32 clone_completed #1 payload|51 clone_started_v2 #3 payload|52 clone_completed_v2 #4 payload|33 checkout_started #1 payload|34 checkout_completed #1 payload|2 build_started 9 payload|3 build_status_message 9 payload|27 build_step_started #5 payload|28 build_status_line #6 payload|29 internal_build_message #7 payload|30 build_exit_code 5 payload|14 prepare_stdout 9 payload|15 prepare_stderr 9 payload|16 prepare_exit_code 3 payload|50 install_command #8 payload|17 install_stdout 9 payload|18 install_stderr 9 payload|19 install_exit_code 3 payload|46 verify_stdout 9 payload|47 verify_stderr 9 payload|48 verify_exit_code 3 payload|6 start_stdout 9 payload|7 start_stderr 9 payload|8 start_exit_code 3 payload|20 extension_install_stdout #9 payload|21 extension_install_stderr #9 payload|22 extension_install_exit_code #10 payload|35 snapshot_started #1 payload|36 snapshot_completed #1 payload|9 creation_completed #1 payload|10 post_start_stdout 9 payload|11 post_start_stderr 9 payload|12 post_start_exit_code 3 payload|23 extension_start_stdout #9 payload|24 extension_start_stderr #9 payload|25 extension_start_exit_code #10 payload|13 startup_completed #1 payload|37 image_pull_started #11 payload|38 image_pull_layer_update #12 payload|39 image_pull_status_update #13 payload|40 image_pull_completed #14 payload|41 blocked_repo_state #15 payload|42 acquired_repo_state #1 payload|53 private_worker_ready #1 payload|54 waiting_for_worker #16 payload|55 span_started #17 payload|56 span_ended #18 payload|57 lifecycle_process_restarted #19 payload|58 lifecycle_process_exited #20 payload", PodErrorEvent, Empty, HydrationProgress, CloneStarted, CloneCompleted, BuildStepStarted, BuildStatusLine, InternalBuildMessage, InstallCommand, FeatureOutput, FeatureExitCode, ImagePullStarted, ImagePullLayerUpdate, ImagePullStatusUpdate, ImagePullCompleted, PodIdentity, WaitingForWorkerStatus, SpanStarted, SpanEnded, LifecycleProcessRestarted, LifecycleProcessExited];
      }
    };
    LifecycleProcessRestarted = class _LifecycleProcessRestarted extends __protoMessage33 {
      constructor(data) {
        super();
        this.attempt = 0;
        this.previousExitCode = 0;
        this.reason = RestartReason.UNSPECIFIED;
        this.commandName = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _LifecycleProcessRestarted().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _LifecycleProcessRestarted().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _LifecycleProcessRestarted().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_LifecycleProcessRestarted, a, b2);
      }
      static $() {
        return ["LifecycleProcessRestarted|1 attempt 13|2 previous_exit_code 5|3 reason #0|4 command_name 9", RestartReason];
      }
    };
    LifecycleProcessExited = class _LifecycleProcessExited extends __protoMessage33 {
      constructor(data) {
        super();
        this.exitCode = 0;
        this.commandName = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _LifecycleProcessExited().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _LifecycleProcessExited().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _LifecycleProcessExited().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_LifecycleProcessExited, a, b2);
      }
      static $() {
        return ["LifecycleProcessExited|1 exit_code 5|2 command_name 9"];
      }
    };
    SpanStarted = class _SpanStarted extends __protoMessage33 {
      constructor(data) {
        super();
        this.spanId = "";
        this.name = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SpanStarted().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SpanStarted().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SpanStarted().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SpanStarted, a, b2);
      }
      static $() {
        return ["SpanStarted|1 span_id 9|2 name 9|3 parent_span_id 9?|5 href 9?"];
      }
    };
    SpanEnded = class _SpanEnded extends __protoMessage33 {
      constructor(data) {
        super();
        this.spanId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _SpanEnded().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _SpanEnded().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _SpanEnded().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_SpanEnded, a, b2);
      }
      static $() {
        return ["SpanEnded|1 span_id 9"];
      }
    };
    WaitingForWorkerStatus = class _WaitingForWorkerStatus extends __protoMessage33 {
      constructor(data) {
        super();
        this.retryCount = 0;
        this.maxRetries = 0;
        this.waitReason = PrivateWorkerWaitReason.UNSPECIFIED;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _WaitingForWorkerStatus().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _WaitingForWorkerStatus().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _WaitingForWorkerStatus().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_WaitingForWorkerStatus, a, b2);
      }
      static $() {
        return ["WaitingForWorkerStatus|1 retry_count 5|2 max_retries 5|3 wait_reason #0", PrivateWorkerWaitReason];
      }
    };
    HydrationProgress = class _HydrationProgress extends __protoMessage33 {
      constructor(data) {
        super();
        this.transferred = protoInt64.zero;
        this.total = protoInt64.zero;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _HydrationProgress().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _HydrationProgress().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _HydrationProgress().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_HydrationProgress, a, b2);
      }
      static $() {
        return ["HydrationProgress|1 transferred 4|2 total 4"];
      }
    };
    PodErrorEvent = class _PodErrorEvent extends __protoMessage33 {
      constructor(data) {
        super();
        this.errorMessage = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _PodErrorEvent().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _PodErrorEvent().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _PodErrorEvent().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_PodErrorEvent, a, b2);
      }
      static $() {
        return ["PodErrorEvent|1 error_message 9"];
      }
    };
    FeatureOutput = class _FeatureOutput extends __protoMessage33 {
      constructor(data) {
        super();
        this.featureId = "";
        this.output = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _FeatureOutput().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _FeatureOutput().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _FeatureOutput().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_FeatureOutput, a, b2);
      }
      static $() {
        return ["FeatureOutput|1 feature_id 9|2 output 9"];
      }
    };
    FeatureExitCode = class _FeatureExitCode extends __protoMessage33 {
      constructor(data) {
        super();
        this.featureId = "";
        this.exitCode = protoInt64.zero;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _FeatureExitCode().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _FeatureExitCode().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _FeatureExitCode().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_FeatureExitCode, a, b2);
      }
      static $() {
        return ["FeatureExitCode|1 feature_id 9|2 exit_code 3"];
      }
    };
    BuildStepStarted = class _BuildStepStarted extends __protoMessage33 {
      constructor(data) {
        super();
        this.streamId = 0;
        this.step = 0;
        this.totalSteps = 0;
        this.command = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _BuildStepStarted().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _BuildStepStarted().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _BuildStepStarted().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_BuildStepStarted, a, b2);
      }
      static $() {
        return ["BuildStepStarted|1 stream_id 13|2 step 13|3 total_steps 13|4 command 9"];
      }
    };
    BuildStatusLine = class _BuildStatusLine extends __protoMessage33 {
      constructor(data) {
        super();
        this.streamId = 0;
        this.timestamp = "";
        this.content = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _BuildStatusLine().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _BuildStatusLine().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _BuildStatusLine().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_BuildStatusLine, a, b2);
      }
      static $() {
        return ["BuildStatusLine|1 stream_id 13|2 timestamp 9|3 content 9"];
      }
    };
    InternalBuildMessage = class _InternalBuildMessage extends __protoMessage33 {
      constructor(data) {
        super();
        this.streamId = 0;
        this.content = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _InternalBuildMessage().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _InternalBuildMessage().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _InternalBuildMessage().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_InternalBuildMessage, a, b2);
      }
      static $() {
        return ["InternalBuildMessage|1 stream_id 13|2 content 9"];
      }
    };
    ImagePullStarted = class _ImagePullStarted extends __protoMessage33 {
      constructor(data) {
        super();
        this.imageName = "";
        this.pullId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ImagePullStarted().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ImagePullStarted().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ImagePullStarted().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ImagePullStarted, a, b2);
      }
      static $() {
        return ["ImagePullStarted|1 image_name 9|2 pull_id 9"];
      }
    };
    ImagePullLayerUpdate = class _ImagePullLayerUpdate extends __protoMessage33 {
      constructor(data) {
        super();
        this.imageName = "";
        this.pullId = "";
        this.layerId = "";
        this.status = { case: void 0 };
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ImagePullLayerUpdate().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ImagePullLayerUpdate().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ImagePullLayerUpdate().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ImagePullLayerUpdate, a, b2);
      }
      static $() {
        return ["ImagePullLayerUpdate|1 image_name 9|2 pull_id 9|3 layer_id 9|4 pulling_fs_layer 8 status|5 waiting 8 status|6 verifying_checksum 8 status|7 download_complete 8 status|8 pull_complete 8 status|9 downloading #0 status|10 extracting #0 status|11 other 9 status", ProgressDetail];
      }
    };
    ProgressDetail = class _ProgressDetail extends __protoMessage33 {
      constructor(data) {
        super();
        this.current = protoInt64.zero;
        this.total = protoInt64.zero;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ProgressDetail().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ProgressDetail().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ProgressDetail().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ProgressDetail, a, b2);
      }
      static $() {
        return ["ProgressDetail|1 current 4|2 total 4"];
      }
    };
    ImagePullStatusUpdate = class _ImagePullStatusUpdate extends __protoMessage33 {
      constructor(data) {
        super();
        this.imageName = "";
        this.pullId = "";
        this.status = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ImagePullStatusUpdate().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ImagePullStatusUpdate().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ImagePullStatusUpdate().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ImagePullStatusUpdate, a, b2);
      }
      static $() {
        return ["ImagePullStatusUpdate|1 image_name 9|2 pull_id 9|3 status 9"];
      }
    };
    ImagePullCompleted = class _ImagePullCompleted extends __protoMessage33 {
      constructor(data) {
        super();
        this.imageName = "";
        this.pullId = "";
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _ImagePullCompleted().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _ImagePullCompleted().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _ImagePullCompleted().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_ImagePullCompleted, a, b2);
      }
      static $() {
        return ["ImagePullCompleted|1 image_name 9|2 pull_id 9"];
      }
    };
    InstallCommand = class _InstallCommand extends __protoMessage33 {
      constructor(data) {
        super();
        this.name = "";
        this.command = "";
        this.isSystem = false;
        this.failureTolerant = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _InstallCommand().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _InstallCommand().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _InstallCommand().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_InstallCommand, a, b2);
      }
      static $() {
        return ["InstallCommand|1 name 9|2 command 9|3 user 9?|4 is_system 8|5 failure_tolerant 8"];
      }
    };
    CloneStarted = class _CloneStarted extends __protoMessage33 {
      constructor(data) {
        super();
        this.purpose = ClonePurpose.UNSPECIFIED;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CloneStarted().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CloneStarted().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CloneStarted().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CloneStarted, a, b2);
      }
      static $() {
        return ["CloneStarted|1 purpose #0", ClonePurpose];
      }
    };
    CloneCompleted = class _CloneCompleted extends __protoMessage33 {
      constructor(data) {
        super();
        this.purpose = ClonePurpose.UNSPECIFIED;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _CloneCompleted().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _CloneCompleted().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _CloneCompleted().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_CloneCompleted, a, b2);
      }
      static $() {
        return ["CloneCompleted|1 purpose #0", ClonePurpose];
      }
    };
  }
});
