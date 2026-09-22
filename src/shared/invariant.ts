/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/invariant.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function installInvariantReporter(reporter) {
  if (installedReporter !== null) {
    failInvariant(
      "installInvariantReporter: a reporter is already installed",
      installInvariantReporter
    );
  }
  installedReporter = reporter;
  return () => {
    if (installedReporter === reporter) installedReporter = null;
  };
}
function messagesStripped() {
  return false;
}
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
var SandInvariantViolation, installedReporter, STRIPPED_MESSAGE, FRAME_LINE;
var init_invariant = __esm({
  "src/shared/invariant.ts"() {
    "use strict";
    SandInvariantViolation = class extends Error {
      constructor(message) {
        super(message);
        this.name = "SandInvariantViolation";
      }
    };
    installedReporter = null;
    STRIPPED_MESSAGE = "Invariant violation (message stripped in packaged builds; the stack identifies the site)";
    FRAME_LINE = /^at /;
  }
});

