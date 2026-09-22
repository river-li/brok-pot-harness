/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/errors/errors.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function errorMessage(error42) {
  return error42 instanceof Error ? error42.message : String(error42);
}
function errorClassOf(error42) {
  if (!(error42 instanceof Error)) return typeof error42;
  return error42.name.length > 0 ? error42.name : "Error";
}
function errorLogTag(error42) {
  if (!(error42 instanceof Error)) return typeof error42;
  const ownCode = error42.code;
  const code = ownCode != null && ownCode.length > 0 ? ownCode : findSystemErrno(error42);
  return code !== void 0 ? `${error42.name} (${code})` : error42.name;
}
var SandDomainError;
var init_errors = __esm({
  "src/shared/errors/errors.ts"() {
    "use strict";
    init_system_errno();
    SandDomainError = class extends Error {
    };
  }
});

