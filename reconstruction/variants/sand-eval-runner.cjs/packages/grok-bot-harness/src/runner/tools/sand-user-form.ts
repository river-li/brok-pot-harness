/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/tools/sand-user-form.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var SAND_REMAP_USER_FORM_TARGETS_TOOL_NAME = "remap_user_form_targets";
var SAND_REMAP_USER_FORM_TARGETS_CALL_HINT = `CallDynamicTool with namespace "cursor", toolName "${SAND_REMAP_USER_FORM_TARGETS_TOOL_NAME}", and arguments { "targets": [{ "fieldId": "<held id>", "target": { "kind": "ref" | "selector" | "label", "value": "<ref, selector, or label>" } }] } (GetDynamicTools on that namespace shows the schema)`;
function summarizeUserFormRequest(form) {
  return `Requested an in-chat form from the user: ${form.title}`;
}
var REMAP_FAILED_STATUS_BY_KIND = {
  driver_unavailable: "NOT FILLED: the host could not reach the box browser, so nothing was written",
  target_gone: "NOT FILLED: the new ref no longer resolves \u2014 the page re-rendered since that snapshot",
  target_missing: "NOT FILLED: nothing on the live page matched the new target",
  in_unreachable_frame: "NOT FILLED: the new target sits in a frame the host cannot enter (cross-origin iframe)",
  in_closed_shadow: "NOT FILLED: the new target sits behind a closed shadow root the host cannot reach",
  fill_op_failed: "NOT FILLED: the new target resolved to a live element but the write errored",
  hidden_target: "REFUSED: the new target resolved, but it is a control the user cannot see (display:none, zero-size, or aria-hidden) \u2014 a hidden twin, honeypot, or not-yet-revealed step. The host never writes into a hidden control",
  page_moved: "NOT FILLED: the live tab moved to a different page or step before this write, so the host stopped"
};
function buildUserFormRemapReceipt(outcome) {
  if (outcome.kind === "no_hold") {
    return `Nothing to remap: the host holds no submitted values for this agent. A remap is offered on a fill receipt and is spent by the first ${SAND_REMAP_USER_FORM_TARGETS_TOOL_NAME} call or by the end of that turn. If a field still needs filling, re-ask with a new request_user_form or hand the user the screen with request_box_help.`;
  }
  if (outcome.kind === "unknown_fields") {
    return `Nothing was written: ${outcome.unknownFieldIds.map((id) => `"${id}"`).join(", ")} ${outcome.unknownFieldIds.length === 1 ? "is not a field" : "are not fields"} the host holds a value for. The held field ids are ${outcome.heldFieldIds.map((id) => `"${id}"`).join(", ")} \u2014 call again via ${SAND_REMAP_USER_FORM_TARGETS_CALL_HINT} with only those (the hold stands until this turn ends).`;
  }
  const lines2 = outcome.outcomes.map((fieldOutcome) => {
    const kind = outcome.fillFailureKinds?.[fieldOutcome.id];
    let status = "NOT FILLED (the write was refused)";
    if (fieldOutcome.filled) {
      status = "filled into the page with the value the user submitted";
    } else if (kind !== void 0) {
      status = REMAP_FAILED_STATUS_BY_KIND[kind];
    }
    return `- ${fieldOutcome.id}: ${status}`;
  });
  const notRemapped = outcome.notRemappedFieldIds.map(
    (id) => `- ${id}: not remapped \u2014 its held value was discarded`
  );
  const mismatch = outcome.domainMismatch != null ? [
    `The host REFUSED to write: the live page (${outcome.domainMismatch.liveHost != null ? `host ${outcome.domainMismatch.liveHost}` : "host unknown"}) is not the host the user consented to. Nothing was written.`
  ] : [];
  const anyFailed = outcome.outcomes.some((fieldOutcome) => !fieldOutcome.filled) || notRemapped.length > 0;
  return [
    "[Remap result \u2014 the host wrote the values the user already submitted; no value is returned to you:",
    ...mismatch,
    ...lines2,
    ...notRemapped,
    `The held values for this form are now discarded (one remap per form).${anyFailed ? " For a field that did not land, do NOT immediately re-issue a form for it: the user already typed it once. Continue the task if the page moved on, or hand the user the screen with request_box_help; re-ask with a new request_user_form only if the step cannot proceed any other way." : ""} Take a fresh page SNAPSHOT (not a screenshot) before the next action, and click the site's submit control yourself.]`
  ].join("\n");
}
var STRUCTURAL_FAILURE_PHRASE = {
  in_unreachable_frame: "inside a frame the host cannot enter (cross-origin iframe)",
  in_closed_shadow: "behind a closed shadow root the host cannot reach"
};
function buildUserFormUnfillableResult(form, fieldKinds) {
  const lines2 = form.fields.flatMap((field) => {
    const kind = fieldKinds[field.id];
    return kind !== void 0 ? [`- ${field.id}: target is ${STRUCTURAL_FAILURE_PHRASE[kind]}`] : [];
  });
  return [
    `The form "${form.title}" was NOT shown and nothing was asked of the user: the host preflighted every targeted field against the live page and ALL of them are structurally unreachable, so the fill would fail the same way after they typed.`,
    ...lines2,
    "Re-issuing this form (same targets, or fresh label/selector targets into the same unreachable frame or closed shadow root) will be refused the same way. Hand the user the screen with request_box_help so they can complete the step directly."
  ].join("\n");
}
function buildUserFormDriverUnavailableResult(form) {
  return `The form "${form.title}" was NOT shown and nothing was asked of the user: the host could not reach the box browser at request time (its driver or the browser itself was down, even after a retry), so every targeted fill would have failed after they typed and their values would have been lost. Nothing is known to be wrong with the targets. Take a fresh browser_snapshot (it brings the browser back if needed) and re-issue this form with targets from it; if the browser still cannot be reached, hand the user the screen with request_box_help.`;
}
var UNSUPPORTED_TURN_PHRASE = {
  room: `this is a group-room turn, and form cards are only shown in your user's own 1:1 chat on the main session. Nothing is wrong with the form or its targets. If the step is for your user, ask them to continue in your 1:1 chat (pass "to":"dm" on SendToUser to reach it) and request the form from there; if it is for someone else in the room, ask them in text or hand the step to your user with request_box_help`,
  side_session: "this is a side session, and form cards can only be answered from the main session. Nothing is wrong with the form or its targets. Ask the user in text here, or request the form from the main session"
};
function buildUserFormUnsupportedTurnResult(form, reason) {
  return `The form "${form.title}" was NOT shown and nothing was asked of the user: ${UNSUPPORTED_TURN_PHRASE[reason]}. Do not re-issue this form on this turn.`;
}
function buildUserFormSkippedFieldsNote(skippedFieldKinds) {
  const lines2 = Object.entries(skippedFieldKinds).map(
    ([id, kind]) => `- ${id}: target is ${STRUCTURAL_FAILURE_PHRASE[kind]}`
  );
  return [
    "NOTE: the host preflighted the targeted fields against the live page and DROPPED these from the card \u2014 their targets are structurally unreachable, so the user was not asked to type them and they will not appear on the receipt as filled:",
    ...lines2,
    "Do not re-ask for them with another form into the same frame or shadow root; if the step cannot proceed without them, hand the user the screen with request_box_help."
  ].join("\n");
}

