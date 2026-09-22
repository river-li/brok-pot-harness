/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/parse/zod-wire.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function hasUnknownKind(frame, knownKinds) {
  return typeof frame === "object" && frame !== null && "kind" in frame && typeof frame.kind === "string" && !knownKinds.has(frame.kind);
}

