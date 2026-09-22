/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/errors/errors.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var SandDomainError = class extends Error {
};
function errorMessage(error3) {
  return error3 instanceof Error ? error3.message : String(error3);
}
function errorClassOf(error3) {
  if (!(error3 instanceof Error)) return typeof error3;
  return error3.name.length > 0 ? error3.name : "Error";
}
function errorLogTag(error3) {
  if (!(error3 instanceof Error)) return typeof error3;
  const ownCode = error3.code;
  const code = ownCode != null && ownCode.length > 0 ? ownCode : findSystemErrno(error3);
  return code !== void 0 ? `${error3.name} (${code})` : error3.name;
}

