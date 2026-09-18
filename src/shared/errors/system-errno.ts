function findSystemErrno(error41) {
  const seen = /* @__PURE__ */ new Set();
  let current = error41;
  while (current != null && typeof current === "object" && !seen.has(current)) {
    seen.add(current);
    const code = current.code;
    if (typeof code === "string" && /^E[A-Z_]+$/.test(code)) return code;
    current = current.cause;
  }
  return void 0;
}
function isMissingPathError(error41) {
  const errno = findSystemErrno(error41);
  return errno === "ENOENT" || errno === "ENOTDIR";
}
var init_system_errno = __esm({
  "src/shared/errors/system-errno.ts"() {
    "use strict";
  }
});
