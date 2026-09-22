/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-store/sync/dist/paths.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_child_process12 = require("node:child_process");
function createWindowsUserIdentityReader(run) {
  let cached2;
  return () => {
    cached2 !== null && cached2 !== void 0 ? cached2 : cached2 = readWindowsUserIdentityUncached(run);
    return cached2;
  };
}
var readCurrentWindowsUserIdentity = createWindowsUserIdentityReader(import_node_child_process12.execFileSync);
function readWindowsUserIdentityUncached(run) {
  const fields2 = String(run("whoami", ["/user", "/fo", "csv", "/nh"], { encoding: "utf8" })).trim().split(",").map((field) => field.replace(/^"|"$/g, ""));
  const name17 = fields2.at(-2);
  const sid = fields2.at(-1);
  if (!name17 || !sid) {
    return void 0;
  }
  return { name: name17, sid };
}

