/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/local-exec/local-exec-failure-classifier.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var ERRNO_TOKEN = /\b(E[A-Z0-9]+)\b/;
function spawnErrorClass(rawErrno) {
  if (rawErrno === "ENOENT") return "spawn_enoent";
  if (rawErrno === "EACCES" || rawErrno === "EPERM") return "spawn_permissions";
  return "spawn_other";
}
function classifyLocalExecFailure(message) {
  const rawErrno = ERRNO_TOKEN.exec(message)?.[1];
  const errno = brandedErrno(rawErrno);
  const errorClass = /\bspawn(?:Sync)?\b/i.test(message) ? spawnErrorClass(rawErrno) : "other";
  return errno === void 0 ? { errorClass } : { errorClass, errno };
}

