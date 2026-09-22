/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/errors/errors.ts
 * Bundle: sand-host/extensions/content-search/search-index-worker.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function errorLogTag(error) {
  if (!(error instanceof Error)) return typeof error;
  const ownCode = error.code;
  const code = ownCode != null && ownCode.length > 0 ? ownCode : findSystemErrno(error);
  return code !== void 0 ? `${error.name} (${code})` : error.name;
}

