init_invariant();
init_zod();
var remapTargetSchema = external_exports.object({
  kind: external_exports.enum(["ref", "selector", "label"]).describe(
    'How the host finds the NEW control: "ref" is an [ref=eN] from the fresh snapshot on the receipt (preferred), "selector" a CSS selector, "label" the visible field label on the live page.'
  ),
  value: external_exports.string().trim().min(1).describe("The ref, selector, or label text.")
});
var REMAP_ENTRY_KEYS = /* @__PURE__ */ new Set(["fieldId", "target"]);
var remapEntrySchema = external_exports.object({
  fieldId: external_exports.string().trim().min(1).max(64).describe("A field id the receipt listed as HELD. Nothing else is accepted."),
  target: remapTargetSchema
}).passthrough();
var remapUserFormTargetsParameters = external_exports.object({
  targets: external_exports.array(remapEntrySchema).min(1).max(USER_FORM_MAX_FIELDS).describe(
    "One entry per held field you can place on the live page: fieldId \u2192 its new target. Fields you leave out are dropped (their held values are discarded). Never include a value."
  )
});
function normalizeUserFormRemapArgs(args) {
  const seen = /* @__PURE__ */ new Set();
  return args.targets.map((entry) => {
    const extraKeys = Object.keys(entry).filter((key) => !REMAP_ENTRY_KEYS.has(key));
    if (extraKeys.length > 0) {
      throw new SandToolInputError(
        `${SAND_REMAP_USER_FORM_TARGETS_TOOL_NAME} is target-only. The entry for field "${entry.fieldId}" carried ${extraKeys.map((key) => `"${key}"`).join(", ")}. The host already holds the value the user submitted and never accepts a replacement or an addition from you. Send only fieldId and target.`
      );
    }
    if (seen.has(entry.fieldId)) {
      throw new SandToolInputError(
        `Field "${entry.fieldId}" is listed twice: name each held field once, with one target.`
      );
    }
    seen.add(entry.fieldId);
    return {
      fieldId: entry.fieldId,
      target: { kind: entry.target.kind, value: entry.target.value }
    };
  });
}
var SAND_REMAP_USER_FORM_TARGETS_CONCISE_CONTEXT = "Only after a request_user_form receipt says a field's value is HELD: remap its new target.";
var REMAP_TOOL_DESCRIPTION = "Point the host at the NEW browser target of a form field whose fill just missed, so it writes the value the user ALREADY submitted there. The user is not asked again. It is only meaningful right after a request_user_form receipt said the host still HOLDS a field's value. The hold lasts for this turn and is spent by the first call, so name every held field you can place on the live page in ONE call. Targets come from the fresh snapshot on that receipt (an [ref=eN], a CSS selector, or the visible label); the write goes to the same host the user consented to and only into a control the user can see, and a hidden twin is refused. This tool carries NO values. You cannot supply, replace, or read one, and an entry with a value is rejected. If the field is genuinely gone from the page, leave it out and continue the task instead of re-asking the user. The result is per-field status only.";
function createRemapUserFormTargetsTool(deps) {
  const tool = defineCommunicateTool(deps, {
    id: "PLATFORM_ACTION",
    name: SAND_REMAP_USER_FORM_TARGETS_TOOL_NAME,
    description: () => {
      const agentId = deps.getAgentId();
      const held = agentId != null && deps.hasRemapHold?.(agentId) === true;
      return `${REMAP_TOOL_DESCRIPTION} ${held ? "Right now the host HOLDS submitted values for this agent: a remap is open for this turn." : "Right now nothing is held for this agent: a call returns no_hold and writes nothing, so do not call it until a receipt offers a remap."}`;
    },
    parameters: remapUserFormTargetsParameters,
    describeActivity: (args) => ({
      detail: `Remapping ${args.targets.length} form field${args.targets.length === 1 ? "" : "s"}`
    }),
    execute: async (_ctx, args, d) => {
      const agentId = d.getAgentId();
      invariant(
        agentId != null,
        `${SAND_REMAP_USER_FORM_TARGETS_TOOL_NAME} was called outside an agent run.`
      );
      const targets = normalizeUserFormRemapArgs(args);
      return buildUserFormRemapReceipt(await d.remapTargets({ agentId, targets }));
    }
  });
  const offloadedToTheCursorDynamicNamespace = {
    ...tool,
    contextType: {
      type: "dynamic",
      conciseStaticContext: SAND_REMAP_USER_FORM_TARGETS_CONCISE_CONTEXT
    }
  };
  return offloadedToTheCursorDynamicNamespace;
}
