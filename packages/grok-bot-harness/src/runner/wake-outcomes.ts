function inertDraftText(value) {
  return value.replace(/["'`\\[\]{}()<>]/g, "").replace(/\s+/g, " ").trim();
}
function draftCardSummary(message) {
  if (message.type === "email-draft") {
    return `email draft to ${inertDraftText(message.draft.to.join(", "))} (subject "${inertDraftText(message.draft.subject)}")`;
  }
  if (message.type === "slack-draft") {
    return `Slack draft to ${inertDraftText(message.draft.target)}`;
  }
  return void 0;
}
function quoted(value) {
  return `"${inertDraftText(value)}"`;
}
function userFormFillSummary(form, outcomes, submit) {
  const outcomeById = new Map(outcomes.map((outcome) => [outcome.id, outcome]));
  const missing = form.fields.filter((field) => outcomeById.get(field.id)?.filled !== true);
  const filledCount = form.fields.length - missing.length;
  const count = `${filledCount} of ${form.fields.length} field${form.fields.length === 1 ? "" : "s"}`;
  const missingNote = missing.length === 0 ? "" : ` (not filled: ${missing.map((field) => inertDraftText(field.label)).join(", ")})`;
  let submitNote = "";
  if (submit?.kind === "settled" && submit.submit?.attempted === true) {
    submitNote = submit.submit.succeeded ? "; the page was submitted" : "; the submit did not go through";
  }
  return `${count} ${filledCount === 1 ? "was" : "were"} filled into the page${missingNote}${submitNote}`;
}
function unseenWakeOutcomeSummary(entry) {
  const message = entry.message;
  if (message.type === "widget") {
    if (entry.respondedValue == null) return void 0;
    return `You asked ${quoted(summarizeWidget(message.widget))} and they answered ${quoted(entry.respondedValue)}.`;
  }
  if (message.type === "secret-request") {
    if (entry.secretProvided !== true) return void 0;
    const request5 = message.secretRequest;
    if (request5.target.kind === "box-env") {
      return `They provided the secret ${quoted(request5.label)}; it is available to new box processes as process.env.${request5.target.name}. You never see the value; do not print or echo it.`;
    }
    if (request5.target.kind === "bot-secret") {
      return `They provided the secret ${quoted(request5.label)}; it was saved on this bot as process.env.${request5.target.name}. You never see the value; do not print or echo it. This secret is on the bot, not a personal secret on the user's computer.`;
    }
    return `They provided the secret ${quoted(request5.label)}; it was stored as a connector credential. You never see the value.`;
  }
  if (message.type === "credential-request") {
    const site = inertDraftText(message.credentialRequest.targetSite);
    switch (entry.credentialResolution) {
      case "approved":
        return `1Password filled the login into ${site}. Never inspect or report credential input values.`;
      case "denied":
        return `They declined to fill the 1Password login for ${site}; do not send that credential-request again right away.`;
      case "failed":
        return `The 1Password login fill for ${site} did not complete: either the browser fill failed or the request expired first. Inspect the live page before sending the credential-request again.`;
      default:
        return void 0;
    }
  }
  if (message.type === "user-form") {
    const form = message.formRequest;
    const title = quoted(form.title);
    switch (entry.formResolution) {
      case "submitted":
        return `They submitted your form ${title}: ${userFormFillSummary(form, entry.formFieldOutcomes ?? [], entry.formSubmissionEffect)}. Those fill statuses are the only receipt for secret fields.`;
      case "fill_failed":
        return `They submitted your form ${title}, but the fill failed: ${userFormFillSummary(form, entry.formFieldOutcomes ?? [], entry.formSubmissionEffect)}.`;
      case "dismissed":
        return `They dismissed your form ${title} without submitting it; treat it as declined.`;
      case "escalated":
        return `They chose to do the step for your form ${title} on the box screen themselves instead of filling it in chat; nothing was filled.`;
      default:
        return void 0;
    }
  }
  if (message.type === "virtual-card-approval") {
    const approval = message.approval;
    const card = `${formatVirtualCardAmountForModel(approval)} card for ${inertDraftText(approval.merchantName)}`;
    switch (approval.status) {
      case "approved":
        return approval.spendRequestId == null ? `They approved your ${card}, but Stripe Link could not create it; nothing was authorized.` : `They approved your ${card}; spend request ${approval.spendRequestId} was created. Poll get_spend_request with that id to finish the purchase.`;
      case "failed":
        return `They approved your ${card}, but Stripe Link could not create it; nothing was authorized.`;
      case "denied":
        return `They declined your ${card}; nothing was authorized. Do not ask again for the same purchase.`;
      case "expired":
        return `Your ${card} expired before they answered it, and they then tried to approve it; nothing was authorized. They still want the purchase, so raise a new card.`;
      default:
        return void 0;
    }
  }
  const draft = draftCardSummary(message);
  if (draft != null) {
    const noSelfSend = "Do not send that message yourself (including via CallMcpTool or any connector send tool)";
    switch (entry.draftSendState) {
      case "sent":
        return `They pressed Send on your ${draft}; it was sent. ${noSelfSend}; it already went out.`;
      case "draft-created":
        return `They pressed Send on your ${draft}; it was staged as a Gmail draft but NOT sent, and the finishing send did not complete. ${noSelfSend}; the user should finish the send from Gmail if they want it sent.`;
      case "unconfirmed":
        return `They pressed Send on your ${draft}; the send did not confirm, so do not assume it went out or that it did not. ${noSelfSend}; check the destination before drafting or sending it again.`;
      default:
        return void 0;
    }
  }
  if (entry.boxRequestId != null) {
    const step = entry.boxInstruction == null || entry.boxInstruction.trim().length === 0 ? "your box help request" : `your box help request (${quoted(entry.boxInstruction)})`;
    switch (entry.boxResolution) {
      case "handed_back":
        return `They handed the box back to you after ${step}; start with the read-only Screenshot tool to see its current state.`;
      case "dismissed":
        return `They dismissed ${step} without doing the step; treat it as declined.`;
      default:
        return void 0;
    }
  }
  return void 0;
}
