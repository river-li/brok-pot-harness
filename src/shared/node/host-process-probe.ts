var import_node_child_process2 = require("node:child_process");
var import_node_fs28 = require("node:fs");
init_dist3();
function readProcessCommand(pid) {
  const procCmdline = attemptSync(() => (0, import_node_fs28.readFileSync)(`/proc/${pid}/cmdline`, "utf8"));
  if (procCmdline.ok && procCmdline.value.length > 0) {
    return procCmdline.value.replace(/\0/g, " ").trim();
  }
  const queried = attemptSync(
    () => (0, import_node_child_process2.execFileSync)("ps", ["-p", String(pid), "-o", "command="], {
      encoding: "utf8",
      timeout: 2e3
    })
  );
  return queried.ok ? queried.value.trim() : null;
}
function isSandHostProcess(pid) {
  const command = readProcessCommand(pid);
  return command != null && command.includes("host-main");
}
