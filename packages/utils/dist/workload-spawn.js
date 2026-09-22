function buildPlacementShimScript(workloadCgroupDir) {
  return `echo $$ 2>/dev/null > '${workloadCgroupDir}/cgroup.procs'; echo 0 2>/dev/null > /proc/$$/oom_score_adj; exec "$0" "$@"`;
}
function isUsableWorkloadCgroupDir(workloadCgroupDir) {
  try {
    if (!(0, import_node_fs2.statSync)(workloadCgroupDir).isDirectory()) {
      return false;
    }
    (0, import_node_fs2.accessSync)(`${workloadCgroupDir}/cgroup.procs`, import_node_fs2.constants.W_OK);
    return true;
  } catch (_a19) {
    return false;
  }
}
function resolveWorkloadPlacement(platform2, workloadCgroupDir, isUsable = isUsableWorkloadCgroupDir) {
  if (platform2 !== "linux" || workloadCgroupDir === void 0 || !WORKLOAD_CGROUP_PATH_PATTERN.test(workloadCgroupDir) || workloadCgroupDir.includes("..") || !isUsable(workloadCgroupDir)) {
    return DIRECT_WORKLOAD_PLACEMENT;
  }
  return Object.freeze({
    kind: "armed",
    workloadCgroupDir,
    executable: "/bin/sh",
    argumentPrefix: Object.freeze(["-c", buildPlacementShimScript(workloadCgroupDir)])
  });
}
function resetReturnedChildPid(value, resetChildPid) {
  if (typeof value === "object" && value !== null && "pid" in value && typeof value.pid === "number") {
    resetChildPid(value.pid);
    return;
  }
  if (typeof value === "object" && value !== null && "child" in value && typeof value.child === "object" && value.child !== null && "pid" in value.child && typeof value.child.pid === "number") {
    resetChildPid(value.child.pid);
  }
}
function createSpawnWorkload(placement, resetChildPid = resetChildOomScoreAdj) {
  return function spawnWithPlacement(createProcess, command, args, ...rest) {
    const result = placement.kind === "direct" ? createProcess(command, [...args], ...rest) : createProcess(placement.executable, [...placement.argumentPrefix, command, ...args], ...rest);
    resetReturnedChildPid(result, resetChildPid);
    return result;
  };
}
var import_node_fs2, WORKLOAD_CGROUP_ENV_VAR, WORKLOAD_CGROUP_PATH_PATTERN, DIRECT_WORKLOAD_PLACEMENT, capturedWorkloadPlacement, spawnWorkload;
var init_workload_spawn = __esm({
  "../packages/utils/dist/workload-spawn.js"() {
    "use strict";
    import_node_fs2 = require("node:fs");
    init_oom_score_adj();
    WORKLOAD_CGROUP_ENV_VAR = "CURSOR_WORKLOAD_CGROUP";
    WORKLOAD_CGROUP_PATH_PATTERN = /^\/sys\/fs\/cgroup\/[A-Za-z0-9_/.-]+$/;
    DIRECT_WORKLOAD_PLACEMENT = Object.freeze({
      kind: "direct"
    });
    capturedWorkloadPlacement = resolveWorkloadPlacement(process.platform, process.env[WORKLOAD_CGROUP_ENV_VAR]);
    spawnWorkload = createSpawnWorkload(capturedWorkloadPlacement);
  }
});
