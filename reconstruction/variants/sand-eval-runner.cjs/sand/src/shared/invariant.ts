/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/invariant.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var SandInvariantViolation = class extends Error {
  constructor(message) {
    super(message);
    this.name = "SandInvariantViolation";
  }
};
var installedReporter = null;
var STRIPPED_MESSAGE = "Invariant violation (message stripped in packaged builds; the stack identifies the site)";
function messagesStripped() {
  return false;
}
var FRAME_LINE = /^at /;
function topApplicationFrame(violation) {
  const stack = violation.stack;
  if (typeof stack !== "string" || !stack.startsWith(headerOf(violation))) return null;
  for (const raw of stack.slice(headerOf(violation).length).split("\n")) {
    const frame = raw.trim();
    if (!FRAME_LINE.test(frame)) continue;
    return frame;
  }
  return null;
}
function headerOf(violation) {
  return violation.message === "" ? violation.name : `${violation.name}: ${violation.message}`;
}
function invariant(condition, message) {
  if (condition) return;
  failInvariant(message, invariant);
}
function failInvariant(message, boundary) {
  let violationMessage;
  if (messagesStripped()) {
    violationMessage = STRIPPED_MESSAGE;
  } else if (typeof message === "function") {
    violationMessage = message();
  } else {
    violationMessage = message;
  }
  const violation = new SandInvariantViolation(violationMessage);
  let frame = null;
  if ("captureStackTrace" in Error && typeof Error.captureStackTrace === "function") {
    Error.captureStackTrace(violation, boundary);
    if (installedReporter !== null) frame = topApplicationFrame(violation);
  }
  installedReporter?.({ name: violation.name, frame });
  throw violation;
}

