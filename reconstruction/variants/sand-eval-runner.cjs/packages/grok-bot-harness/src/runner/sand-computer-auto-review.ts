/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/sand-computer-auto-review.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
var import_node_crypto28 = require("node:crypto");
init_zod();

// @recovered-fragment 2/2
var SAND_COMPUTER_CLASSIFIER_TARGET_ACTION = "sand_computer";
var SAND_COMPUTER_AUTO_REVIEW_MAX_DESCRIPTION_CHARS = 500;
var SAND_COMPUTER_AUTO_REVIEW_MAX_TEXT_CHARS = 2e3;
var SAND_COMPUTER_AUTO_REVIEW_MAX_KEY_CHARS = 256;
var SAND_COMPUTER_AUTO_REVIEW_MAX_PATH_POINTS = 64;
var SAND_COMPUTER_AUTO_REVIEW_CLASSIFIER_ERROR_REASON = "An error occurred while classifying this action. Please review manually.";
var SAND_COMPUTER_AUTO_REVIEW_BYPASS_ACTIONS = [
  "screenshot",
  "move",
  "wait",
  "scroll"
];
var BYPASS_COMPUTER_ACTIONS = new Set(
  SAND_COMPUTER_AUTO_REVIEW_BYPASS_ACTIONS
);
var sandComputerReviewActionKindSchema = external_exports.enum([
  "screenshot",
  "click",
  "move",
  "drag",
  "type",
  "key",
  "scroll",
  "wait"
]);
var SandComputerAutoReviewBlockedError = class extends Error {
  constructor(message, telemetryCode = "policy_denied") {
    super(message);
    this.telemetryCode = telemetryCode;
    this.name = "SandComputerAutoReviewBlockedError";
    this.toolCallAuditOutcome = reviewFailureAuditOutcome(telemetryCode);
  }
  telemetryCode;
  toolCallAuditOutcome;
};
var SAND_COMPUTER_PAGE_STATE_CHROME_UNREACHABLE = "chrome-unreachable";
function computeSandComputerPageStateIdentity(stdout) {
  const lines2 = [];
  for (const target of parseNavigationProbeOutput(stdout)) {
    if (target.type !== "page") continue;
    const pageId = typeof target.id === "string" ? target.id : "";
    if (pageId.length === 0) continue;
    const rawUrl = typeof target.url === "string" ? target.url : "";
    lines2.push(`${pageId}	${rawUrl.trim()}`);
  }
  lines2.sort();
  return (0, import_node_crypto28.createHash)("sha256").update(lines2.join("\n")).digest("hex");
}
function isSandComputerAutoReviewBypassAction(action) {
  return BYPASS_COMPUTER_ACTIONS.has(action);
}
function isSandComputerAutoReviewMutatingAction(action) {
  return !isSandComputerAutoReviewBypassAction(action);
}
function requiresSandComputerDeclaredDescription(action) {
  return action === "click" || action === "drag";
}
function boundedActionString(value, maxChars) {
  if (value === void 0) return void 0;
  return value.length <= maxChars ? value : value.slice(0, maxChars);
}
function rejectOversizedField(field, maxChars) {
  throw new SandComputerAutoReviewBlockedError(
    `Computer Auto-review rejected oversized ${field} (max ${maxChars} characters).`,
    "invalid_arguments"
  );
}
function normalizeSandComputerExactActionArgs(raw) {
  if (raw.text !== void 0 && raw.text.length > SAND_COMPUTER_AUTO_REVIEW_MAX_TEXT_CHARS) {
    rejectOversizedField("text", SAND_COMPUTER_AUTO_REVIEW_MAX_TEXT_CHARS);
  }
  if (raw.key !== void 0 && raw.key.length > SAND_COMPUTER_AUTO_REVIEW_MAX_KEY_CHARS) {
    rejectOversizedField("key", SAND_COMPUTER_AUTO_REVIEW_MAX_KEY_CHARS);
  }
  if (raw.modifiers !== void 0 && raw.modifiers.length > SAND_COMPUTER_AUTO_REVIEW_MAX_KEY_CHARS) {
    rejectOversizedField("modifiers", SAND_COMPUTER_AUTO_REVIEW_MAX_KEY_CHARS);
  }
  if (raw.path !== void 0 && raw.path.length > SAND_COMPUTER_AUTO_REVIEW_MAX_PATH_POINTS) {
    rejectOversizedField("path", SAND_COMPUTER_AUTO_REVIEW_MAX_PATH_POINTS);
  }
  return raw;
}
function normalizeSandComputerDescription(description9) {
  if (description9 === void 0) return void 0;
  const trimmed = description9.trim();
  if (trimmed.length === 0) return void 0;
  if (trimmed.length > SAND_COMPUTER_AUTO_REVIEW_MAX_DESCRIPTION_CHARS) {
    rejectOversizedField("description", SAND_COMPUTER_AUTO_REVIEW_MAX_DESCRIPTION_CHARS);
  }
  return trimmed;
}
function buildSandComputerAutoReviewCanonicalTarget(args) {
  return {
    exactAction: normalizeSandComputerExactActionArgs(args.exactAction),
    description: normalizeSandComputerDescription(args.description),
    boxIdentity: args.boxIdentity,
    displayStateIdentity: args.displayStateIdentity
  };
}
function fingerprintSandComputerAutoReviewTarget(target) {
  return fingerprintSandAutoReviewTarget({
    exact_action: target.exactAction,
    description: target.description ?? "",
    window_generation: target.boxIdentity.windowGeneration,
    box_id: target.boxIdentity.boxId,
    display_state_identity: target.displayStateIdentity
  });
}
function buildProjectPermissionsContext(args) {
  const allowInstructions = [];
  const blockInstructions = [];
  const seenAllow = /* @__PURE__ */ new Set();
  const seenBlock = /* @__PURE__ */ new Set();
  const appendUnique2 = (target, seen, values) => {
    for (const value of values) {
      const trimmed = value.trim();
      if (trimmed.length === 0 || seen.has(trimmed)) continue;
      seen.add(trimmed);
      target.push(trimmed);
    }
  };
  appendUnique2(allowInstructions, seenAllow, args.personalInstructions?.allowInstructions ?? []);
  appendUnique2(blockInstructions, seenBlock, args.personalInstructions?.blockInstructions ?? []);
  appendUnique2(allowInstructions, seenAllow, args.userAutoRunInstructions?.allowInstructions ?? []);
  appendUnique2(blockInstructions, seenBlock, args.userAutoRunInstructions?.blockInstructions ?? []);
  appendUnique2(
    allowInstructions,
    seenAllow,
    args.projectAutoRunInstructions?.allowInstructions ?? []
  );
  appendUnique2(
    blockInstructions,
    seenBlock,
    args.projectAutoRunInstructions?.blockInstructions ?? []
  );
  if (allowInstructions.length === 0 && blockInstructions.length === 0) {
    return void 0;
  }
  return {
    auto_run: {
      allow_instructions: allowInstructions,
      block_instructions: blockInstructions
    }
  };
}
function buildSandComputerClassifierRiskTarget(args) {
  const { exactAction, description: description9, boxIdentity } = args.canonicalTarget;
  const projectPermissions = buildProjectPermissionsContext({
    personalInstructions: args.personalInstructions,
    userAutoRunInstructions: args.userAutoRunInstructions,
    projectAutoRunInstructions: args.projectAutoRunInstructions
  });
  return new SmartModeRiskTarget({
    action: SAND_COMPUTER_CLASSIFIER_TARGET_ACTION,
    arguments: structFromRecord({
      surface: "computer",
      action_kind: exactAction.action,
      coordinates: exactAction.x !== void 0 && exactAction.y !== void 0 ? { x: exactAction.x, y: exactAction.y } : void 0,
      end_coordinates: exactAction.x2 !== void 0 && exactAction.y2 !== void 0 ? { x: exactAction.x2, y: exactAction.y2 } : void 0,
      path: exactAction.path,
      button: exactAction.button,
      count: exactAction.count,
      modifiers: boundedActionString(
        exactAction.modifiers,
        SAND_COMPUTER_AUTO_REVIEW_MAX_KEY_CHARS
      ),
      text: boundedActionString(exactAction.text, SAND_COMPUTER_AUTO_REVIEW_MAX_TEXT_CHARS),
      key: boundedActionString(exactAction.key, SAND_COMPUTER_AUTO_REVIEW_MAX_KEY_CHARS),
      direction: exactAction.direction,
      amount: exactAction.amount,
      duration_ms: exactAction.durationMs,
      hold_duration_ms: exactAction.holdDurationMs,
      declared_purpose: description9,
      box: {
        box_id: boxIdentity.boxId,
        window_generation: boxIdentity.windowGeneration,
        display_state_identity: args.canonicalTarget.displayStateIdentity
      },
      project_permissions: projectPermissions
    })
  });
}
function formatSandComputerAutoReviewBlockedReason(reason) {
  return reason;
}
function describeHeldGesture(base, modifiers) {
  const gesture = modifiers === void 0 ? base : `${modifiers}-${base}`;
  return `${gesture.charAt(0).toUpperCase()}${gesture.slice(1)}`;
}
function summarizeBlockedAction(target, fingerprint, reason) {
  const { exactAction, description: description9 } = target;
  const summary = (() => {
    if (exactAction.action === "click") {
      return `${describeHeldGesture("click", exactAction.modifiers)} at (${exactAction.x}, ${exactAction.y}) on Grok Bot's computer${description9 === void 0 ? "" : ` to ${description9.slice(0, 160)}`}`;
    }
    if (exactAction.action === "drag") {
      return `${describeHeldGesture("drag", exactAction.modifiers)} from (${exactAction.x}, ${exactAction.y}) to (${exactAction.x2}, ${exactAction.y2}) on Grok Bot's computer${description9 === void 0 ? "" : ` to ${description9.slice(0, 160)}`}`;
    }
    if (exactAction.action === "type") {
      return summarizeSandComputerTypedText(exactAction.text ?? "");
    }
    return `Press ${exactAction.key?.slice(0, 80) ?? "a key"} on Grok Bot's computer`;
  })();
  return {
    surface: "computer",
    fingerprint,
    reason,
    summary
  };
}
async function runClassifier(ctx, args, classifierMode, canonicalTarget) {
  const { options: options2, stateHandler } = args;
  if (options2.devBlockState?.consume() === true) {
    return { kind: "block", reason: "This is a dev block whatever just retry it" };
  }
  return await runSandAutoReviewClassifier({
    ctx,
    resourceAccessor: args.resourceAccessor,
    toolCallId: args.toolCallId,
    mode: classifierMode,
    buildTarget: () => buildSandComputerClassifierRiskTarget({
      canonicalTarget,
      personalInstructions: options2.personalInstructions,
      userAutoRunInstructions: args.userAutoRunInstructions,
      projectAutoRunInstructions: args.projectAutoRunInstructions
    }),
    loadConversationContext: async () => {
      if (stateHandler === void 0) return [];
      if (options2.extractConversationContext !== void 0) {
        return await options2.extractConversationContext(ctx, stateHandler);
      }
      return await tryExtractSandAutoReviewClassifierConversationContext(ctx, stateHandler);
    },
    workspacePaths: args.workspacePaths,
    errorReason: SAND_COMPUTER_AUTO_REVIEW_CLASSIFIER_ERROR_REASON
  });
}
function runShadowClassifier(ctx, args, canonicalTarget) {
  void (async () => {
    try {
      const decision = await runClassifier(ctx, args, "shadow", canonicalTarget);
      if (decision.kind === "allow") {
        args.options.onShadowClassification?.({ decision: "allow" });
        return;
      }
      args.options.onShadowClassification?.({
        decision: "block",
        reason: decision.reason
      });
    } catch (error3) {
      reportHostDiagnostic({
        kind: "auto_review_shadow_classify_failed",
        errorClass: errorLogTag(error3)
      });
    }
  })();
}
async function runSandComputerAutoReviewPreflight(args) {
  const { options: options2 } = args;
  const mode = options2.mode;
  if (mode === "off") return;
  const action = args.exactAction.action;
  if (!isSandComputerAutoReviewMutatingAction(action)) {
    return;
  }
  if (mode === "enforce" && requiresSandComputerDeclaredDescription(action)) {
    const description9 = normalizeSandComputerDescription(args.description);
    if (description9 === void 0) {
      throw new SandComputerAutoReviewBlockedError(
        "Computer click and drag actions require a concise description field stating the intended UI target and purpose.",
        "invalid_arguments"
      );
    }
  }
  const canonicalTarget = buildSandComputerAutoReviewCanonicalTarget({
    exactAction: args.exactAction,
    description: args.description,
    boxIdentity: options2.boxIdentity,
    displayStateIdentity: await options2.captureDisplayStateIdentity(args.ctx, args.toolCallId)
  });
  const fingerprint = fingerprintSandComputerAutoReviewTarget(canonicalTarget);
  const assertDisplayStateUnchanged = async () => {
    const currentDisplayStateIdentity = await options2.captureDisplayStateIdentity(
      args.ctx,
      args.toolCallId
    );
    if (currentDisplayStateIdentity !== canonicalTarget.displayStateIdentity) {
      options2.autoReviewController?.reportDisplayRecheckFailed(options2.agentId);
      throw new SandComputerAutoReviewBlockedError(
        "The page changed after review; inspect the latest screenshot and retry the action.",
        "state_changed"
      );
    }
  };
  if (mode === "shadow") {
    runShadowClassifier(args.ctx, args, canonicalTarget);
    return;
  }
  const decision = await runClassifier(args.ctx, args, "enforce", canonicalTarget);
  if (decision.kind === "allow") {
    await assertDisplayStateUnchanged();
    return;
  }
  const blockReason = decision.reason;
  const controller = options2.autoReviewController;
  if (decision.kind === "block" && controller !== void 0) {
    const blockedAction = summarizeBlockedAction(canonicalTarget, fingerprint, blockReason);
    const approval = await withToolExecutionTimeoutSuspended(
      args.ctx,
      () => controller.requestApproval({
        agentId: options2.agentId,
        surface: "computer",
        fingerprint,
        reason: blockReason,
        summary: blockedAction.summary,
        ...decision.proposedRule === void 0 ? {} : { proposedRule: decision.proposedRule },
        signal: args.signal,
        ...options2.getApprovalExpiryPolicy !== void 0 ? { expiryPolicy: options2.getApprovalExpiryPolicy() } : {}
      })
    );
    if (args.signal?.aborted === true) {
      throw new SandComputerAutoReviewBlockedError(
        "The Computer action was cancelled.",
        "cancelled"
      );
    }
    if (approval.approved) {
      await assertDisplayStateUnchanged();
      return;
    }
    throw new SandComputerAutoReviewBlockedError(approval.reason ?? blockReason, "approval_denied");
  }
  throw new SandComputerAutoReviewBlockedError(
    formatSandComputerAutoReviewBlockedReason(blockReason),
    decision.kind === "reject" ? "classifier_failed" : "policy_denied"
  );
}
var sandComputerDeclaredPurposeParameter = external_exports.string().optional().describe(
  "Concise model-facing intent for this action. Required for click and drag in Auto-review enforce mode; include for type/key when it clarifies purpose."
);

