var SAND_REMAP_USER_FORM_TARGETS_TOOL_NAME = "remap_user_form_targets";
var SAND_REMAP_USER_FORM_TARGETS_CALL_HINT = `CallDynamicTool with namespace "cursor", toolName "${SAND_REMAP_USER_FORM_TARGETS_TOOL_NAME}", and arguments { "targets": [{ "fieldId": "<held id>", "target": { "kind": "ref" | "selector" | "label", "value": "<ref, selector, or label>" } }] } (GetDynamicTools on that namespace shows the schema)`;
function summarizeUserFormRequest(form) {
  return `Requested an in-chat form from the user: ${form.title}`;
}
var FILL_FAILED_STATUS_BY_KIND = {
  driver_unavailable: "FILL FAILED: the host could not reach the box browser (its driver or the browser itself was down), so nothing was written for this field and nothing is known to be wrong with the target. Take a fresh browser_snapshot (it brings the browser back if needed) and re-ask for just this field with a target from it",
  target_gone: "FILL FAILED: the ref no longer resolves. The page re-rendered or navigated since your snapshot. Take a fresh browser_snapshot and re-ask for just this field with a fresh target",
  target_missing: "FILL FAILED: nothing on the live page matched the target (snapshots pierce open shadow roots and same-origin iframes, so it is not merely nested in one). Take a fresh browser_snapshot and re-ask with a target from it",
  in_unreachable_frame: "FILL FAILED: the target was not found, and the page embeds a frame the host cannot enter (cross-origin iframe) where the field may be. Re-issuing the SAME target would fail the same way. Hand the user the screen with request_box_help, unless a fresh browser_snapshot actually shows the field (then re-ask once with a ref from it)",
  in_closed_shadow: "FILL FAILED: the target matched a custom element whose internals sit behind a closed shadow root the host cannot reach. Re-issuing the same form would fail the same way. Hand the user the screen with request_box_help",
  fill_op_failed: "FILL FAILED: the target resolved to a live element but the write errored. Take a fresh browser_snapshot and re-ask with a fresh target, or hand the user the screen with request_box_help"
};
var FILL_FAILED_STATUS_UNCLASSIFIED = "FILL FAILED (the target was gone, unresolvable, or the fill errored)";
function buildUserFormSubmittedAck(form, outcomes, domainMismatch, submit, fillFailureKinds, pageMoved, remap) {
  const outcomeById = new Map(outcomes.map((outcome) => [outcome.id, outcome]));
  const anyFilled = outcomes.some((outcome) => outcome.filled);
  const liveHostText = domainMismatch?.liveHost != null ? `host ${domainMismatch.liveHost}` : "host unknown";
  const consentedHost = form.liveHost ?? form.domain ?? "the destination host shown to the user";
  let mismatchLine = [];
  if (domainMismatch != null) {
    mismatchLine = [
      anyFilled ? `The host STOPPED filling mid-form: the live page (${liveHostText}) left ${consentedHost}, the exact host the card showed the user as the destination. Fields marked "filled into the page" below were written while the page was still on that host; every remaining value was refused and discarded. Bring the browser back to the right page, take a fresh snapshot, and re-ask for just the missing fields with a new form.` : `The host REFUSED to fill: the live page (${liveHostText}) is not ${consentedHost}, the exact host the card showed the user as the destination (fills only ever go to that exact host, never another subdomain). NOTHING was written; the submitted values were discarded. Navigate the browser to the right page, take a fresh snapshot, and re-issue the form with the exact browser-bar domain and fresh targets.`
    ];
  }
  const heldForRemap = new Set(domainMismatch == null ? remap?.fieldIds ?? [] : []);
  const remapOffered = heldForRemap.size > 0;
  const handedBackAsPageMoved = pageMoved != null && domainMismatch == null;
  const pageMovedLines = handedBackAsPageMoved ? buildPageMovedLinesThatSteerTheAgentToRePlanNotRetry(pageMoved, anyFilled, remapOffered) : [];
  const remapLines = remapOffered ? buildRemapOfferLines(heldForRemap, consentedHost, remap, pageMoved) : [];
  const lines2 = form.fields.map((field) => {
    const outcome = outcomeById.get(field.id);
    const failureKind = fillFailureKinds?.[field.id];
    let status = "not filled (no usable browser target)";
    if (outcome?.fillFailed === true) {
      if (heldForRemap.has(field.id)) {
        status = `NOT FILLED: ${failureKind !== void 0 ? HELD_FIELD_MISS_BY_KIND[failureKind] : "the page moved before this field was written"}. The host still HOLDS the submitted value. Name its new target through ${SAND_REMAP_USER_FORM_TARGETS_TOOL_NAME} in the cursor dynamic namespace (see below)`;
      } else if (handedBackAsPageMoved) {
        status = "not filled: the page moved before this field was written, and its value was discarded";
      } else if (failureKind !== void 0) {
        status = FILL_FAILED_STATUS_BY_KIND[failureKind];
      } else {
        status = FILL_FAILED_STATUS_UNCLASSIFIED;
      }
    } else if (outcome?.filled === true) {
      status = "filled into the page";
    }
    return `- ${field.id} (${field.type}): ${status}`;
  });
  let nextStep = "If a fill failed, re-ask for just that field with a new request_user_form (fresh target) or hand the user the screen with request_box_help";
  if (remapOffered) {
    nextStep = "Follow the remap note above for what to do next";
  } else if (handedBackAsPageMoved) {
    nextStep = "Follow the page-moved note above for what to do next";
  }
  return [
    `[The user submitted the form "${form.title}"${(form.liveHost ?? form.domain) != null ? ` for ${form.liveHost ?? form.domain}` : ""}. Host fill result:`,
    ...mismatchLine,
    ...pageMovedLines,
    ...remapLines,
    ...lines2,
    `Submitted values are write-only for EVERY field. The host filled them into the page and never returns them to you. The per-field statuses above ARE the verification for secret fields. Do NOT take a screenshot to check what landed in a secret field (structured snapshots redact secret values; a screenshot is raw page pixels and redacts nothing). ${nextStep}. Never ask the user to paste values in chat.`,
    buildSubmitAfterFillLine(form, submit)
  ].join("\n");
}
var HELD_FIELD_MISS_BY_KIND = {
  driver_unavailable: "the host could not reach the box browser",
  target_gone: "its ref no longer resolves and its label matched nothing on the live page",
  target_missing: "nothing on the live page matched its target",
  in_unreachable_frame: "its target sits in a frame the host cannot enter",
  in_closed_shadow: "its target sits behind a closed shadow root",
  fill_op_failed: "its target resolved but the write errored"
};
function buildRemapOfferLines(heldFieldIds, consentedHost, remap, pageMoved) {
  const snapshot = remap?.valueScrubbedFreshSnapshot ?? pageMoved?.valueScrubbedFreshSnapshot;
  let snapshotWhere = "a fresh browser_snapshot";
  if (pageMoved?.valueScrubbedFreshSnapshot !== void 0) {
    snapshotWhere = "the fresh snapshot above";
  } else if (snapshot !== void 0) {
    snapshotWhere = "the fresh snapshot below";
  }
  return [
    `REMAP OFFERED: the user is NOT being asked again. The host still holds the submitted value of ${[...heldFieldIds].map((id) => `"${id}"`).join(", ")} for ONE remap on ${consentedHost}. Look at ${snapshotWhere}. If the SAME field is on the page under a new ref (the page re-rendered, revealed the next step, or swapped the control), remap NOW, in this turn, via ${SAND_REMAP_USER_FORM_TARGETS_CALL_HINT}, with one entry per held field you can place, all in one call. The host writes the value the user already typed into that target: one write, same host, and only into a control the user can see (a hidden twin is refused). You cannot supply, change, or see a value. Remap is target-only, and the held values are discarded the moment this turn ends or the remap runs. If the field is genuinely no longer on the page (the step moved on), do NOT remap it and do NOT re-issue a form for it. Continue the task from the current page, or hand the user the screen with request_box_help.`,
    ...snapshot !== void 0 && pageMoved?.valueScrubbedFreshSnapshot === void 0 ? [
      "What is on the page now (fresh structured snapshot; submitted values withheld):",
      snapshot
    ] : []
  ];
}
function buildPageMovedLinesThatSteerTheAgentToRePlanNotRetry(pageMoved, anyFilled, remapOffered) {
  if (pageMoved == null) return [];
  const why = pageMoved.signal === "navigated" ? "the live tab navigated to a different page or step while the host was filling" : "a target went stale, and when the host re-looked that field up by its own label on the still-open page the control was GONE. The page replaced this form, it did not merely re-render";
  const remaining = remapOffered ? "remaining value is HELD for the one remap described below, not written anywhere" : "remaining value was refused and DISCARDED";
  const nextStep = remapOffered ? "Do NOT retry this form's old targets. They describe a page that is no longer there. Read the current page state below, then remap the held fields that are still on screen, or continue the task if the step moved on." : `Do NOT retry this form or its targets. The refs and labels it carried describe a page that is no longer there. Re-plan from the current page state${pageMoved.valueScrubbedFreshSnapshot !== void 0 ? " below" : " (take a fresh browser_snapshot)"}. If the step you meant is still on screen, issue a NEW request_user_form with fresh targets; if the page moved on to the next step, continue the task from there; if the user has to act on the page itself, hand them the screen with request_box_help.`;
  return [
    `The host STOPPED filling: ${why}. ${anyFilled ? 'Fields marked "filled into the page" below were written before the page moved; every' : "NOTHING was written; every"} ${remaining}. ${nextStep}`,
    ...pageMoved.valueScrubbedFreshSnapshot !== void 0 ? [
      "What is on the page now (fresh structured snapshot; submitted values withheld):",
      pageMoved.valueScrubbedFreshSnapshot
    ] : []
  ];
}
var REMAP_FAILED_STATUS_BY_KIND = {
  driver_unavailable: "NOT FILLED: the host could not reach the box browser, so nothing was written",
  target_gone: "NOT FILLED: the new ref no longer resolves. The page re-rendered since that snapshot",
  target_missing: "NOT FILLED: nothing on the live page matched the new target",
  in_unreachable_frame: "NOT FILLED: the new target sits in a frame the host cannot enter (cross-origin iframe)",
  in_closed_shadow: "NOT FILLED: the new target sits behind a closed shadow root the host cannot reach",
  fill_op_failed: "NOT FILLED: the new target resolved to a live element but the write errored",
  hidden_target: "REFUSED: the new target resolved, but it is a control the user cannot see (display:none, zero-size, or aria-hidden), such as a hidden twin, honeypot, or not-yet-revealed step. The host never writes into a hidden control",
  page_moved: "NOT FILLED: the live tab moved to a different page or step before this write, so the host stopped"
};
function buildUserFormRemapReceipt(outcome) {
  if (outcome.kind === "no_hold") {
    return `Nothing to remap: the host holds no submitted values for this agent. A remap is offered on a fill receipt and is spent by the first ${SAND_REMAP_USER_FORM_TARGETS_TOOL_NAME} call or by the end of that turn. If a field still needs filling, re-ask with a new request_user_form or hand the user the screen with request_box_help.`;
  }
  if (outcome.kind === "unknown_fields") {
    return `Nothing was written: ${outcome.unknownFieldIds.map((id) => `"${id}"`).join(", ")} ${outcome.unknownFieldIds.length === 1 ? "is not a field" : "are not fields"} the host holds a value for. The held field ids are ${outcome.heldFieldIds.map((id) => `"${id}"`).join(", ")}. Call again via ${SAND_REMAP_USER_FORM_TARGETS_CALL_HINT} with only those (the hold stands until this turn ends).`;
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
    (id) => `- ${id}: not remapped, and its held value was discarded`
  );
  const mismatch = outcome.domainMismatch != null ? [
    `The host REFUSED to write: the live page (${outcome.domainMismatch.liveHost != null ? `host ${outcome.domainMismatch.liveHost}` : "host unknown"}) is not the host the user consented to. Nothing was written.`
  ] : [];
  const anyFailed = outcome.outcomes.some((fieldOutcome) => !fieldOutcome.filled) || notRemapped.length > 0;
  return [
    "[Remap result: the host wrote the values the user already submitted; no value is returned to you:",
    ...mismatch,
    ...lines2,
    ...notRemapped,
    `The held values for this form are now discarded (one remap per form).${anyFailed ? " For a field that did not land, do NOT immediately re-issue a form for it: the user already typed it once. Continue the task if the page moved on, or hand the user the screen with request_box_help; re-ask with a new request_user_form only if the step cannot proceed any other way." : ""} Take a fresh page SNAPSHOT (not a screenshot) before the next action, and click the site's submit control yourself.]`
  ].join("\n");
}
function buildSubmitAfterFillLine(form, submit) {
  if (form.submitAfterFill !== true) {
    return "The host only filled values; it did NOT click the site's own submit button and did not navigate. Start from a fresh page snapshot, not a screenshot while a submitted secret could still be visible on the page, and do not assume the page moved on; then click the submit control yourself.]";
  }
  if (submit?.attempted === true && submit.succeeded) {
    return "You asked for submitAfterFill. After the fills, the host pressed Enter in the last filled field, so the page may have submitted and moved on. Take a fresh page snapshot to verify the outcome before anything else, not a screenshot in case a submitted secret is still visible on the page, and do not submit again unless the page shows the step did not go through.]";
  }
  if (submit?.attempted === true) {
    return "You asked for submitAfterFill, but the host's Enter-press submit FAILED after the fills. The filled values are still in the page and nothing was submitted. Take a fresh snapshot and click the site's submit control yourself.]";
  }
  return "You asked for submitAfterFill, but the host did not attempt it. The Enter press runs only after a fully successful one-shot fill, one where every targeted field filled and the form has a single text code field to press Enter in (a failed fill, a non-one-shot form shape, or a field Enter cannot submit from all skip it). Nothing was submitted and the site's own submit button was never clicked.]";
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
    "NOTE: the host preflighted the targeted fields against the live page and DROPPED these from the card. Their targets are structurally unreachable, so the user was not asked to type them and they will not appear on the receipt as filled:",
    ...lines2,
    "Do not re-ask for them with another form into the same frame or shadow root; if the step cannot proceed without them, hand the user the screen with request_box_help."
  ].join("\n");
}
function buildUserFormDismissedAck(form) {
  return `[The user dismissed your form "${form.title}" without submitting it. Treat it as declined: no values were filled, and do not immediately re-issue the same form. Continue the task without it if you can; if the task cannot proceed, send the user a brief message saying what is blocked, then stop and wait for their reply.]`;
}
