/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/sand-email-auto-review.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_smart_mode_classifier_exec_pb();

// @recovered-fragment 2/2
var SAND_EMAIL_SEND_SERVER_NAME = "grok-bot-email";
var SAND_EMAIL_SEND_CLASSIFIER_ERROR_REASON = "An error occurred while reviewing this email. Please review manually.";
function reviewArguments2(target) {
  return {
    from: target.fromInboxEmail,
    ...target.fromDisplayName === void 0 ? {} : { from_name: target.fromDisplayName },
    to: [...target.to],
    ...target.cc.length === 0 ? {} : { cc: [...target.cc] },
    ...target.bcc.length === 0 ? {} : { bcc: [...target.bcc] },
    subject: target.subject,
    body: target.textBody,
    ...target.inReplyToMessageId === void 0 ? {} : { in_reply_to_message_id: target.inReplyToMessageId },
    ...target.replyTo.length === 0 ? {} : {
      reply_to: target.replyTo.map((address) => ({
        email: address.email,
        ...address.name.length === 0 ? {} : { name: address.name }
      }))
    },
    ...target.attachments.length === 0 ? {} : {
      attachments: target.attachments.map((attachment) => ({
        filename: attachment.filename,
        size_bytes: attachment.sizeBytes,
        sha256: attachment.sha256,
        content_type: attachment.contentType,
        // Named explicitly so an uninspected file is never mistaken for a
        // reviewed one.
        ...attachment.textPreview === void 0 ? { content_preview: "[binary or undecodable bytes; content not inspected]" } : { content_preview: attachment.textPreview }
      }))
    }
  };
}
function addressesMatch(left, right) {
  return left.trim().toLowerCase() === right.trim().toLowerCase();
}
function wakeEmailContext(target, wakeEmail) {
  return {
    from_address: wakeEmail.fromAddress,
    inbox_email: wakeEmail.inboxEmail,
    sender_authenticated: wakeEmail.authPassed,
    // Mail back to whoever wrote in is the ordinary shape; a send that
    // reaches someone the waking message never involved is the one worth
    // looking at twice.
    recipients_include_sender: [...target.to, ...target.cc, ...target.bcc].some(
      (recipient2) => addressesMatch(recipient2, wakeEmail.fromAddress)
    )
  };
}
function provenanceContext(target, provenance) {
  const source = provenance?.requestSource;
  return {
    request_source: source ?? "unknown",
    // An unrecorded source counts as unattended, as the approval expiry and
    // automation-write provenance rules already treat it.
    unattended: source !== "turn",
    ...provenance?.wakeEmbedsExternalEvent === void 0 ? {} : { wake_embeds_external_event: provenance.wakeEmbedsExternalEvent },
    ...provenance?.wakeEmail === void 0 ? {} : { wake_email: wakeEmailContext(target, provenance.wakeEmail) }
  };
}
function buildSandEmailSendRiskTarget(args) {
  return new SmartModeRiskTarget({
    action: "mcp",
    arguments: structFromRecord({
      server: {
        identifier: SAND_EMAIL_SEND_SERVER_NAME,
        name: SAND_EMAIL_SEND_SERVER_NAME,
        display_name: "Agent email"
      },
      tool_name: SAND_SEND_EMAIL_TOOL_NAME,
      arguments: reviewArguments2(args.target),
      tool_definition: {
        description: "Send an email to external recipients from one of the agent's own email addresses. The recipients are third parties; the message leaves the user's control once sent.",
        annotations: { destructiveHint: false, openWorldHint: true }
      },
      turn_provenance: provenanceContext(args.target, args.provenance),
      project_permissions: buildProjectPermissionsContext({
        personalInstructions: args.personalInstructions,
        userAutoRunInstructions: args.userAutoRunInstructions,
        projectAutoRunInstructions: args.projectAutoRunInstructions
      })
    })
  });
}
function sandEmailSendFingerprintPayload(target, provenance) {
  return {
    from: target.fromInboxEmail,
    fromDisplayName: target.fromDisplayName ?? "",
    to: target.to,
    cc: target.cc,
    bcc: target.bcc,
    subject: target.subject,
    body: target.textBody,
    inReplyToMessageId: target.inReplyToMessageId,
    replyTo: target.replyTo.map((address) => [address.name, address.email]),
    // Content-bound: a same-name, same-size swap must not reuse the decision.
    attachments: target.attachments.map((attachment) => [
      attachment.filename,
      attachment.sizeBytes,
      attachment.sha256
    ]),
    // Provenance-bound: an approval given while the user was in the
    // conversation does not carry over to the same send from an unattended
    // wake, which is the boundary the classifier is being asked to weigh.
    provenance: {
      requestSource: provenance?.requestSource ?? null,
      wakeEmbedsExternalEvent: provenance?.wakeEmbedsExternalEvent ?? null,
      wakeFromAddress: provenance?.wakeEmail?.fromAddress ?? null,
      wakeSenderAuthenticated: provenance?.wakeEmail?.authPassed ?? null
    }
  };
}
function sandEmailSendReviewSpec(provenance) {
  return {
    surface: "mcp",
    classifierErrorReason: SAND_EMAIL_SEND_CLASSIFIER_ERROR_REASON,
    buildRiskTarget: (args) => buildSandEmailSendRiskTarget({ ...args, provenance }),
    fingerprintPayload: (target) => sandEmailSendFingerprintPayload(target, provenance),
    summarize: (target) => summarizeSandEmailSendAction({
      from: target.fromInboxEmail,
      fromDisplayName: target.fromDisplayName,
      to: target.to,
      cc: target.cc,
      bcc: target.bcc,
      subject: target.subject,
      textBody: target.textBody,
      replyTo: target.replyTo,
      attachments: target.attachments
    }),
    abortPolicy: { kind: "deny", reason: "The email was cancelled before it was sent." },
    requireApproval: sendNeedsManualReview
  };
}
function attachmentsNotFullyReviewable(target) {
  const unseen = target.attachments.filter(
    (attachment) => attachment.textPreview === void 0 || attachment.textPreview.endsWith(SAND_EMAIL_ATTACHMENT_PREVIEW_TRUNCATED_MARKER)
  );
  if (unseen.length === 0) return void 0;
  const names3 = unseen.map((attachment) => attachment.filename).join(", ");
  return `The attached file${unseen.length === 1 ? "" : "s"} ${names3} cannot be reviewed automatically (binary or longer than the preview), so this email needs your approval.`;
}
function sendNeedsManualReview(target) {
  const attachmentReason = attachmentsNotFullyReviewable(target);
  if (attachmentReason !== void 0) return attachmentReason;
  const from2 = target.fromInboxEmail.toLowerCase();
  const diverted = target.replyTo.filter((address) => address.email.toLowerCase() !== from2).map((address) => address.email);
  if (diverted.length === 0) return void 0;
  return `Reply-To is set to ${diverted.join(", ")}, which is not the sending inbox, so this email needs your approval.`;
}
async function reviewSandEmailSend(args) {
  const decision = await runSandAutoReviewFlow({
    ...args,
    spec: sandEmailSendReviewSpec(args.options.provenance)
  });
  return decision.allowed === false ? decision : { allowed: true };
}
function claimReviewArguments(target) {
  return {
    username: target.username,
    ...target.displayName === void 0 ? {} : { display_name: target.displayName }
  };
}
function sandEmailClaimFingerprintPayload(target) {
  return {
    username: target.username,
    displayName: target.displayName
  };
}
var SAND_EMAIL_CLAIM_UNAVAILABLE_REASON = "Claiming an inbox needs the user's approval, which is not available in this conversation.";
var SAND_EMAIL_CLAIM_CANCELLED_REASON = "The inbox claim was cancelled before it completed.";
async function reviewSandEmailClaim(args) {
  if (args.signal?.aborted === true) {
    return { allowed: false, reason: SAND_EMAIL_CLAIM_CANCELLED_REASON };
  }
  const controller = args.options.autoReviewController;
  if (controller === void 0) {
    return { allowed: false, reason: SAND_EMAIL_CLAIM_UNAVAILABLE_REASON };
  }
  const approval = await withToolExecutionTimeoutSuspended(
    args.ctx,
    () => controller.requestApproval({
      agentId: args.options.agentId,
      surface: "mcp",
      fingerprint: fingerprintSandAutoReviewTarget(sandEmailClaimFingerprintPayload(args.target)),
      reason: "This claims a Grok Bot inbox at the local part below. That address is unique and is never reissued, including after you delete it. Nothing is claimed unless you approve.",
      summary: summarizeSandMcpAutoReviewAction({
        serverDisplayName: "Agent email",
        toolName: SAND_CLAIM_EMAIL_INBOX_TOOL_NAME,
        mcpArguments: claimReviewArguments(args.target)
      }),
      command: args.target.username,
      ...args.signal !== void 0 ? { signal: args.signal } : {},
      ...args.options.getApprovalExpiryPolicy !== void 0 ? { expiryPolicy: args.options.getApprovalExpiryPolicy() } : {}
    })
  );
  if (approval.approved) {
    return { allowed: true };
  }
  return { allowed: false, reason: approval.reason ?? "The user declined." };
}

