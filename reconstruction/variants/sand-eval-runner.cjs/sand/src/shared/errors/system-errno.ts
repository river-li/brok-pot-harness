/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/errors/system-errno.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function findSystemErrno(error3) {
  const seen = /* @__PURE__ */ new Set();
  let current = error3;
  while (current != null && typeof current === "object" && !seen.has(current)) {
    seen.add(current);
    const code = current.code;
    if (typeof code === "string" && /^E[A-Z_]+$/.test(code)) return code;
    current = current.cause;
  }
  return void 0;
}

