/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/shell-exec/dist/sandbox/macos/seatbelt.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function registerSandboxMetadata(child, metadata) {
  sandboxMetadataMap.set(child, metadata);
}
async function captureSandboxDenies(child) {
  const metadata = sandboxMetadataMap.get(child);
  if (!metadata) {
    console.log("No sandbox metadata found on child process");
    return [];
  }
  return captureSandboxDeniesInternal(metadata.pid, metadata.startTime, metadata.unrelatedPids);
}
function determineRelationship(eventPid, rootPid, unrelatedPids) {
  if (eventPid === rootPid) {
    return "related";
  }
  if (unrelatedPids?.has(eventPid)) {
    return "probably_unrelated";
  }
  return "maybe_related";
}
function captureSandboxDeniesInternal(pid, startTime, unrelatedPids) {
  return new Promise((resolve14) => {
    try {
      const now = /* @__PURE__ */ new Date();
      const secondsAgo = Math.ceil((now.getTime() - startTime.getTime()) / 1e3);
      const logArgs = [
        "show",
        "--style",
        "ndjson",
        "--predicate",
        `process=="kernel" AND eventMessage CONTAINS "Sandbox:" AND eventMessage contains "deny"`,
        "--last",
        secondsAgo.toString()
      ];
      spawnWorkload(execFileUtf8, "/usr/bin/log", logArgs, (error3, stdout) => {
        if (error3) {
          resolve14([{ raw: error3.message }]);
          return;
        }
        const lines2 = stdout.split(/\r?\n/).filter((l) => l.trim().length > 0);
        const out = [];
        for (const line of lines2) {
          try {
            const obj = JSON.parse(line);
            const msg = obj?.eventMessage ?? "";
            if (!msg || typeof msg !== "string")
              continue;
            const deny = /^Sandbox:\s+([^(]+)\((\d+)\)\s+([a-zA-Z-]+)\((\d+)\)\s+([^\s]+)\s+(.+)$/.exec(msg);
            if (deny) {
              const [, processName, pidStr, decision, decisionCodeStr, operation, targetRest] = deny;
              const eventPid = Number(pidStr);
              out.push({
                timestamp: obj.timestamp,
                processName: processName.trim(),
                pid: eventPid,
                decision: decision.toLowerCase(),
                decisionCode: Number(decisionCodeStr),
                operation,
                target: targetRest,
                duplicateCount: 1,
                raw: msg,
                relationship: determineRelationship(eventPid, pid, unrelatedPids)
              });
              continue;
            }
            const dup = /^(\d+) duplicate report for Sandbox: (.+)$/.exec(msg);
            if (dup) {
              const count = Number(dup[1]);
              const inner = dup[2];
              const dm = /^([^(]+)\((\d+)\)\s+([a-zA-Z-]+)\((\d+)\)\s+([^\s]+)\s+(.+)$/.exec(inner);
              if (dm) {
                const [, processName, pidStr, decision, decisionCodeStr, operation, targetRest] = dm;
                const eventPid = Number(pidStr);
                out.push({
                  timestamp: obj.timestamp,
                  processName: processName.trim(),
                  pid: eventPid,
                  decision: decision.toLowerCase(),
                  decisionCode: Number(decisionCodeStr),
                  operation,
                  target: targetRest,
                  duplicateCount: count,
                  raw: msg,
                  relationship: determineRelationship(eventPid, pid, unrelatedPids)
                });
              } else {
                out.push({
                  timestamp: obj.timestamp,
                  duplicateCount: count,
                  raw: msg
                });
              }
              continue;
            }
            out.push({ timestamp: obj.timestamp, raw: msg });
          } catch {
          }
        }
        resolve14(out);
      });
    } catch (error3) {
      resolve14([{ raw: String(error3) }]);
    }
  });
}
var import_node_child_process2, execFileUtf8, sandboxMetadataMap;
var init_seatbelt = __esm({
  "../packages/shell-exec/dist/sandbox/macos/seatbelt.js"() {
    "use strict";
    import_node_child_process2 = require("node:child_process");
    init_dist3();
    execFileUtf8 = import_node_child_process2.execFile;
    sandboxMetadataMap = /* @__PURE__ */ new WeakMap();
  }
});

