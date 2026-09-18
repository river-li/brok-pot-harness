function errorMessage(error41) {
  return error41 instanceof Error ? error41.message : String(error41);
}
function errorClassOf(error41) {
  if (!(error41 instanceof Error)) return typeof error41;
  return error41.name.length > 0 ? error41.name : "Error";
}
function errorLogTag(error41) {
  if (!(error41 instanceof Error)) return typeof error41;
  const ownCode = error41.code;
  const code = ownCode != null && ownCode.length > 0 ? ownCode : findSystemErrno(error41);
  return code !== void 0 ? `${error41.name} (${code})` : error41.name;
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
