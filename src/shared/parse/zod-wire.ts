init_errors();
var SandWireParseError = class extends SandDomainError {
  name = "SandWireParseError";
};
function describeZodIssues(error41) {
  return error41.issues.map(
    (issue2) => issue2.path.length > 0 ? `${issue2.path.join(".")}: ${issue2.message}` : issue2.message
  ).join("; ");
}
function hasUnknownKind(frame, knownKinds) {
  return typeof frame === "object" && frame !== null && "kind" in frame && typeof frame.kind === "string" && !knownKinds.has(frame.kind);
}
