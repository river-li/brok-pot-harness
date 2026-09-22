/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/parse/zod-wire.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_errors();
var SandWireParseError = class extends SandDomainError {
  name = "SandWireParseError";
};
function describeZodIssues(error42) {
  return error42.issues.map(
    (issue2) => issue2.path.length > 0 ? `${issue2.path.join(".")}: ${issue2.message}` : issue2.message
  ).join("; ");
}
function hasUnknownKind(frame, knownKinds) {
  return typeof frame === "object" && frame !== null && "kind" in frame && typeof frame.kind === "string" && !knownKinds.has(frame.kind);
}

