var SAND_BROWSER_AUTO_REVIEW_MAX_ELEMENT_CHARS = 500;
var SAND_BROWSER_AUTO_REVIEW_MAX_TEXT_CHARS = 2e3;
var SAND_BROWSER_AUTO_REVIEW_MAX_URL_CHARS = 2e3;
var SAND_BROWSER_AUTO_REVIEW_MAX_KEY_CHARS = 256;
var SAND_BROWSER_AUTO_REVIEW_MAX_CDP_PARAMS_CHARS = 2e3;
var BYPASS_BROWSER_OPS = /* @__PURE__ */ new Set([
  "snapshot",
  "screenshot",
  "get_bounding_box",
  "highlight",
  "scroll"
]);
function isSandBrowserAutoReviewMutatingAction(action) {
  if (action.op === "tabs") {
    return action.tabsAction === "new" || action.tabsAction === "close";
  }
  return !BYPASS_BROWSER_OPS.has(action.op);
}
var SandBrowserAutoReviewBlockedError = class extends Error {
  constructor(message, telemetryCode = "policy_denied") {
    super(message);
    this.telemetryCode = telemetryCode;
    this.name = "SandBrowserAutoReviewBlockedError";
    this.toolCallAuditOutcome = reviewFailureAuditOutcome(telemetryCode);
  }
  telemetryCode;
  toolCallAuditOutcome;
};
function rejectOversizedField2(field, maxChars) {
  throw new SandBrowserAutoReviewBlockedError(
    `Browser Auto-review rejected oversized ${field} (max ${maxChars} characters).`,
    "invalid_arguments"
  );
}
function assertBounded(value, field, maxChars) {
  if (value !== void 0 && value.length > maxChars) {
    rejectOversizedField2(field, maxChars);
  }
}
function normalizeSandBrowserExactActionArgs(raw) {
  assertBounded(raw.url, "url", SAND_BROWSER_AUTO_REVIEW_MAX_URL_CHARS);
  assertBounded(raw.text, "text", SAND_BROWSER_AUTO_REVIEW_MAX_TEXT_CHARS);
  assertBounded(raw.value, "value", SAND_BROWSER_AUTO_REVIEW_MAX_TEXT_CHARS);
  assertBounded(raw.key, "key", SAND_BROWSER_AUTO_REVIEW_MAX_KEY_CHARS);
  assertBounded(raw.cdpParams, "params", SAND_BROWSER_AUTO_REVIEW_MAX_CDP_PARAMS_CHARS);
  if (raw.values !== void 0 && raw.values.join(", ").length > SAND_BROWSER_AUTO_REVIEW_MAX_TEXT_CHARS) {
    rejectOversizedField2("values", SAND_BROWSER_AUTO_REVIEW_MAX_TEXT_CHARS);
  }
  return raw;
}
function normalizeSandBrowserElement(element) {
  if (element === void 0) return void 0;
  const trimmed = element.trim();
  if (trimmed.length === 0) return void 0;
  if (trimmed.length > SAND_BROWSER_AUTO_REVIEW_MAX_ELEMENT_CHARS) {
    rejectOversizedField2("element", SAND_BROWSER_AUTO_REVIEW_MAX_ELEMENT_CHARS);
  }
  return trimmed;
}
function buildSandBrowserAutoReviewCanonicalTarget(args) {
  const normalized = normalizeSandBrowserExactActionArgs(args.exactAction);
  const element = normalizeSandBrowserElement(normalized.element);
  return {
    exactAction: {
      ...normalized,
      ...element !== void 0 ? { element } : {}
    },
    boxIdentity: args.boxIdentity,
    displayStateIdentity: args.reviewState.displayStateIdentity,
    ...args.reviewState.targetPageUrl !== void 0 ? { targetPageUrl: args.reviewState.targetPageUrl } : {}
  };
}
function fingerprintSandBrowserAutoReviewTarget(target) {
  return fingerprintSandAutoReviewTarget({
    exact_action: target.exactAction,
    window_generation: target.boxIdentity.windowGeneration,
    box_id: target.boxIdentity.boxId,
    display_state_identity: target.displayStateIdentity,
    target_page_url: target.targetPageUrl
  });
}
function buildSandBrowserClassifierRiskTarget(args) {
  const { exactAction, boxIdentity } = args.canonicalTarget;
  const projectPermissions = buildProjectPermissionsContext({
    personalInstructions: args.personalInstructions,
    userAutoRunInstructions: args.userAutoRunInstructions,
    projectAutoRunInstructions: args.projectAutoRunInstructions
  });
  return new SmartModeRiskTarget({
    action: SAND_COMPUTER_CLASSIFIER_TARGET_ACTION,
    arguments: structFromRecord({
      surface: "browser",
      action_kind: `browser_${exactAction.op}`,
      view_id: exactAction.viewId,
      target_page_url: args.canonicalTarget.targetPageUrl,
      url: exactAction.url,
      ref: exactAction.ref,
      text: exactAction.text,
      value: exactAction.value,
      values: exactAction.values,
      key: exactAction.key,
      cdp_method: exactAction.cdpMethod,
      cdp_params: exactAction.cdpParams,
      tabs_action: exactAction.tabsAction,
      tab_index: exactAction.tabIndex,
      coordinates: exactAction.x !== void 0 && exactAction.y !== void 0 ? { x: exactAction.x, y: exactAction.y } : void 0,
      drag_source_ref: exactAction.sourceRef,
      drag_target_ref: exactAction.targetRef,
      drag_target_coordinates: exactAction.targetX !== void 0 && exactAction.targetY !== void 0 ? { x: exactAction.targetX, y: exactAction.targetY } : void 0,
      new_tab: exactAction.newTab,
      submit: exactAction.submit,
      clear: exactAction.clear,
      double_click: exactAction.doubleClick,
      hold_duration_ms: exactAction.holdDurationMs,
      button: exactAction.button,
      modifiers: exactAction.modifiers,
      declared_purpose: exactAction.element,
      box: {
        box_id: boxIdentity.boxId,
        window_generation: boxIdentity.windowGeneration,
        display_state_identity: args.canonicalTarget.displayStateIdentity
      },
      project_permissions: projectPermissions
    })
  });
}
async function runClassifier2(ctx, args, classifierMode, canonicalTarget) {
  const { options: options2, stateHandler } = args;
  return await runSandAutoReviewClassifier({
    ctx,
    resourceAccessor: args.resourceAccessor,
    toolCallId: args.toolCallId,
    mode: classifierMode,
    buildTarget: () => buildSandBrowserClassifierRiskTarget({
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
async function runSandBrowserAutoReviewPreflight(args) {
  const { options: options2 } = args;
  const mode = options2.mode;
  if (mode === "off") return;
  const op = args.exactAction.op;
  if (!isSandBrowserAutoReviewMutatingAction(args.exactAction)) {
    return;
  }
  if (mode === "enforce" && (op === "click" || op === "mouse_click_xy" || op === "drag")) {
    const element = normalizeSandBrowserElement(args.exactAction.element);
    if (element === void 0) {
      throw new SandBrowserAutoReviewBlockedError(
        "Browser click and drag actions require an element field: a concise description of the intended target and purpose.",
        "invalid_arguments"
      );
    }
  }
  const canonicalTarget = buildSandBrowserAutoReviewCanonicalTarget({
    exactAction: args.exactAction,
    boxIdentity: options2.boxIdentity,
    reviewState: await options2.captureReviewState(args.ctx, args.toolCallId)
  });
  const fingerprint = fingerprintSandBrowserAutoReviewTarget(canonicalTarget);
  const assertDisplayStateUnchanged = async () => {
    const currentDisplayStateIdentity = (await options2.captureReviewState(args.ctx, args.toolCallId)).displayStateIdentity;
    if (currentDisplayStateIdentity !== canonicalTarget.displayStateIdentity) {
      options2.autoReviewController?.reportDisplayRecheckFailed(options2.agentId);
      throw new SandBrowserAutoReviewBlockedError(
        "The page changed after review; take a fresh browser_snapshot and retry the action.",
        "state_changed"
      );
    }
  };
  if (mode === "shadow") {
    void runClassifier2(args.ctx, args, "shadow", canonicalTarget).catch((error42) => {
      if (!(error42 instanceof Error && error42.name === "AbortError")) {
        throw error42;
      }
    });
    return;
  }
  const decision = await runClassifier2(args.ctx, args, "enforce", canonicalTarget);
  if (decision.kind === "allow") {
    await assertDisplayStateUnchanged();
    return;
  }
  const blockReason = decision.reason;
  const controller = options2.autoReviewController;
  if (decision.kind === "block" && controller !== void 0) {
    const approval = await withToolExecutionTimeoutSuspended(
      args.ctx,
      () => controller.requestApproval({
        agentId: options2.agentId,
        surface: "computer",
        fingerprint,
        reason: blockReason,
        summary: summarizeSandBrowserAutoReviewAction({
          ...canonicalTarget.exactAction,
          targetPageUrl: canonicalTarget.targetPageUrl
        }),
        ...decision.proposedRule === void 0 ? {} : { proposedRule: decision.proposedRule },
        signal: args.signal,
        ...options2.getApprovalExpiryPolicy !== void 0 ? { expiryPolicy: options2.getApprovalExpiryPolicy() } : {}
      })
    );
    if (args.signal?.aborted === true) {
      throw new SandBrowserAutoReviewBlockedError("The browser action was cancelled.", "cancelled");
    }
    if (approval.approved) {
      await assertDisplayStateUnchanged();
      return;
    }
    throw new SandBrowserAutoReviewBlockedError(approval.reason ?? blockReason, "approval_denied");
  }
  throw new SandBrowserAutoReviewBlockedError(blockReason);
}
