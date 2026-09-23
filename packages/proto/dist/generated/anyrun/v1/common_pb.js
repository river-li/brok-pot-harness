var __protoPackage6, __protoMessage34, WorkspaceGitSetupMode, WarmForkMode, EnvironmentBuildResolution, EnvironmentBuildBootInfo;
var init_common_pb = __esm({
  "../packages/proto/dist/generated/anyrun/v1/common_pb.js"() {
    "use strict";
    init_esm();
    init_compact();
    __protoPackage6 = "anyrun.v1.";
    __protoMessage34 = class extends CompactMessage {
      static get runtime() {
        return defineOwn(this, "runtime", proto3);
      }
      static $p() {
        return __protoPackage6;
      }
    };
    WorkspaceGitSetupMode = /* @__PURE__ */ enumType(proto3, __protoPackage6, "WorkspaceGitSetupMode", [[0, "UNSPECIFIED"], [1, "REUSE"], [2, "REUSE_THEN_CHECKOUT"], [3, "NO_REPO"]], 1);
    WarmForkMode = /* @__PURE__ */ enumType(proto3, __protoPackage6, "WarmForkMode", [[0, "UNSPECIFIED"], [1, "NONE"], [2, "FORKED"], [3, "COLD_FALLBACK"], [4, "LAZY_LOAD"], [5, "COLD_FALLBACK_LAZY_LOAD"]], 1);
    EnvironmentBuildResolution = /* @__PURE__ */ enumType(proto3, __protoPackage6, "EnvironmentBuildResolution", [[0, "UNSPECIFIED"], [1, "RESOLVED"], [2, "NO_FINISHED_BUILDS"], [3, "NO_HEALTHY_BUILDS"]], 1);
    EnvironmentBuildBootInfo = class _EnvironmentBuildBootInfo extends __protoMessage34 {
      constructor(data) {
        super();
        this.snapshotId = "";
        this.workspaceGitSetupMode = WorkspaceGitSetupMode.UNSPECIFIED;
        this.warmForkMode = WarmForkMode.UNSPECIFIED;
        this.fastForwardDefaultBranch = false;
        this.resolution = EnvironmentBuildResolution.UNSPECIFIED;
        this.defaultImageFallback = false;
        proto3.util.initPartial(data, this);
      }
      static fromBinary(bytes, options2) {
        return new _EnvironmentBuildBootInfo().fromBinary(bytes, options2);
      }
      static fromJson(jsonValue, options2) {
        return new _EnvironmentBuildBootInfo().fromJson(jsonValue, options2);
      }
      static fromJsonString(jsonString, options2) {
        return new _EnvironmentBuildBootInfo().fromJsonString(jsonString, options2);
      }
      static equals(a, b2) {
        return proto3.util.equals(_EnvironmentBuildBootInfo, a, b2);
      }
      static $() {
        return ["EnvironmentBuildBootInfo|1 build_id 9?|2 snapshot_id 9|3 workspace_git_setup_mode #0|4 warm_fork_mode #1|5 fast_forward_default_branch 8|6 resolution #2|7 default_image_fallback 8", WorkspaceGitSetupMode, WarmForkMode, EnvironmentBuildResolution];
      }
    };
  }
});
