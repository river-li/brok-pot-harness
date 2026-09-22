/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/tools/sand-state-tool.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_zod();

// @recovered-fragment 2/2
var SAND_UPDATE_STATE_TOOL_NAME = "update_state";
var OPERATIONS = {
  memory: {
    write: 'save a durable fact (fact, tier, optional scope). scope "agent" (default) is your own memory; "user" is shared user-memory every assistant should know. tier "profile" is foundational and kept in mind every turn; "log" (default) is dated history; "note" fades fast. Facts are deduped.',
    forget: "drop a fact by its EXACT recorded text (fact, same scope). Pair with a write for the corrected version."
  },
  routine: {
    create: "save a routine (name, prompt, and either schedule or trigger). prompt is what you do each time it fires, written to your future self.",
    update: "rewrite an existing one in place (id, plus any of name/prompt/schedule/trigger/enabled you mean to change). Omitted fields keep their current values; it keeps its history.",
    pause: "(id) disarm one the user wants back later.",
    resume: "(id) rearm a paused one.",
    delete: "(id) remove a finite watch as soon as it has done its job."
  },
  skill: {
    write: 'save or rewrite a reusable skill (name, description, body; id to rewrite). The description is REQUIRED and is what a reader uses to decide whether the skill applies, so write it as "use this when \u2026". A skill has no trigger \u2014 a saved task that runs on a schedule is a routine.',
    delete: "(id). Cursor-managed skills can't be edited or deleted."
  },
  profile: {
    set: "your name (the chat title the user sees in the sidebar and header), description, title (the short role label beside your name), avatar_shape, and/or avatar_color (your default mark, hidden while a custom picture is installed). Only the fields you pass change. For your picture use target avatar."
  },
  settings: {
    set: "hidden_from_sidebar, notify_on_updates. Only the fields you pass change."
  },
  channel: {
    disconnect: "(platform). The connector closes the live connection within a few seconds."
  },
  avatar: {
    set: "(path to an image on your box or the host \u2014 write/download it first, then install it here; a box path under /workspace is fine).",
    clear: "back to the default picture."
  }
};
var TEAM_BOT_SKILL_OPERATIONS = {
  write: `save or rewrite one of this bot's team skills, visible to every teammate on your next turn (name, description, body; to rewrite, id = the slug from the skill's catalog path, the folder under skills/, or that path itself). The description is REQUIRED and is what a reader uses to decide whether the skill applies, so write it as "use this when \u2026". A skill has no trigger \u2014 a saved task that runs on a schedule is a routine. Only the bot owner can save one; a teammate (even a team admin) is told the owner can add it from main or Team access.`,
  delete: "(id = the slug from the skill's catalog path, the folder under skills/, or that path itself). Removes the team skill for everyone; only the bot owner can. Cursor-managed and other plugins' skills can't be edited or deleted; only this bot's own bot-skills entries can."
};
function nonEmptyTuple(items) {
  if (items.length === 0) {
    throw new Error(`${SAND_UPDATE_STATE_TOOL_NAME} has no operations to offer`);
  }
  const [first, ...rest] = items;
  return [first, ...rest];
}
function conversationMemoryWrite(story) {
  return `save a durable fact (fact, tier, optional scope). ${renderMemoryConversationScopeStory(story)} tier "profile" is foundational and kept in mind every turn; "log" (default) is dated history; "note" fades fast. Facts are deduped.`;
}
function actionsOf(target) {
  const actions = OPERATIONS[target];
  return Object.keys(actions).filter(
    (action) => isKeyOf(actions, action)
  );
}
var TARGETS = nonEmptyTuple(
  Object.keys(OPERATIONS).filter(
    (target) => isKeyOf(OPERATIONS, target)
  )
);
var OPERATION_ENTRIES = TARGETS.map((target) => [target, OPERATIONS[target]]);
var ACTIONS = nonEmptyTuple([...new Set(TARGETS.flatMap(actionsOf))]);
var ACTION_MATRIX = OPERATION_ENTRIES.map(
  ([target, actions]) => `${target}: ${Object.keys(actions).join(" | ")}`
).join(". ");
function operationText(args) {
  const { target, action } = args;
  if (target === "memory" && action === "write") return args.memoryWrite;
  if (args.teamBot && target === "skill" && isKeyOf(TEAM_BOT_SKILL_OPERATIONS, action)) {
    return TEAM_BOT_SKILL_OPERATIONS[action];
  }
  return args.stock;
}
function operationLines(memoryWrite, teamBot) {
  return OPERATION_ENTRIES.flatMap(
    ([target, actions]) => Object.entries(actions).map(
      ([action, stock]) => `- ${target} ${action}: ${operationText({ target, action, stock, memoryWrite, teamBot })}`
    )
  );
}
var slackListener = external_exports.object({
  type: external_exports.literal("slack"),
  channel: external_exports.string().trim().min(1).describe('A channel ("#eng"), a DM ("@dana"), or "*" for anywhere.'),
  match: external_exports.discriminatedUnion("kind", [
    external_exports.object({ kind: external_exports.literal("mention") }),
    external_exports.object({
      kind: external_exports.literal("keyword"),
      keyword: external_exports.string().trim().min(1)
    }),
    external_exports.object({ kind: external_exports.literal("message") }),
    external_exports.object({
      kind: external_exports.literal("reaction"),
      emoji: external_exports.array(external_exports.string().trim().min(1)).optional().describe(
        'Normalized short names without colons ("eyes", "white_check_mark"). Absent or empty means any emoji.'
      ),
      bySelf: external_exports.boolean().optional().describe("When true, only the user's own reactions fire it \u2014 not a colleague's.")
    })
  ]).describe("What makes a message count as a match.")
});
var githubListener = external_exports.object({
  type: external_exports.literal("github"),
  repo: external_exports.string().trim().min(1).describe('One concrete "owner/name" repo. No wildcards; omit pr for repo-wide events.'),
  events: external_exports.array(external_exports.enum(GITHUB_EVENT_KINDS)).min(1).describe(
    'Which GitHub events fire this routine. For a PR babysitter, use ["review-requested", "review-approved", "review-changes-requested", "review-commented", "pr-comment", "inline-review-comment", "review-thread-resolved", "review-thread-unresolved", "pr-pushed", "pr-merged", "pr-closed", "ci-passed", "ci-failed"]. pr-pushed and the comment kinds need pr or userAllowlist.'
  ),
  pr: external_exports.number().int().positive().optional().describe(
    "Optional pull request number. When set, only events for that PR fire; a listener containing pr-merged or pr-closed deletes itself after that terminal wake finishes."
  ),
  userAllowlist: external_exports.array(external_exports.string().trim().min(1)).optional().describe(
    'Git usernames that may fire this listener ("alice", "@bob"). Absent or empty means anyone. Does not apply to ci-passed/ci-failed \u2014 CI is never user-gated.'
  ),
  ciBranch: external_exports.string().trim().min(1).optional().describe(
    'REQUIRED when repo-wide events includes ci-passed or ci-failed: the one branch whose settled checks fire them ("main"). Omit it when pr is set; that PR scopes CI instead.'
  )
});
var originListener = external_exports.object({
  type: external_exports.literal("origin"),
  repo: external_exports.string().trim().min(1).describe(
    'One concrete native Origin "owner/name" repo. Mirrored repos are rejected; no wildcards.'
  ),
  events: external_exports.array(external_exports.enum(ORIGIN_EVENT_KINDS)).min(1).describe(
    'Which Origin events fire this routine. For a PR babysitter, use ["review-requested", "review-approved", "review-changes-requested", "review-commented", "pr-comment", "inline-review-comment", "review-thread-resolved", "review-thread-unresolved", "pr-pushed", "pr-merged", "ci-passed", "ci-failed"].'
  ),
  pr: external_exports.number().int().positive().optional().describe(
    "Optional Origin pull request number. Required for ci-passed/ci-failed; a listener containing pr-merged deletes itself after that merged wake finishes."
  ),
  userAllowlist: external_exports.array(external_exports.string().trim().min(1)).optional().describe(
    "Origin actor IDs in either user-facing or internal numeric form. PR/comment events gate the PR owner; review/reviewer/thread events require both actor and PR owner; CI ignores this list. Missing required identities fail closed."
  )
});
var microsoftTeamsTrigger = external_exports.object({
  type: external_exports.literal("microsoftTeams"),
  tenantId: external_exports.string().trim().min(1).describe("The Microsoft Entra tenant ID."),
  teamId: external_exports.string().optional().describe(
    "One Microsoft Teams Graph API team ID. At least one of teamId or teamIds is required."
  ),
  teamIds: external_exports.array(external_exports.string()).optional().describe("Microsoft Teams Graph API team IDs. At least one of teamId or teamIds is required."),
  channelIds: external_exports.array(external_exports.string()).optional().describe(
    "Optional channel filter using Microsoft Teams Graph API channel IDs. Empty or absent means every channel."
  ),
  messageContains: external_exports.string().optional().describe("Optional message text filter. Empty or absent means any message."),
  messageContainsIsRegex: external_exports.boolean().optional().describe("Whether messageContains is a regular expression."),
  blockUnauthenticatedTeamsUsers: external_exports.boolean().optional().describe("When true, messages from unauthenticated Microsoft Teams users do not fire it.")
});
var linearTrigger = external_exports.object({
  type: external_exports.literal("linear"),
  event: external_exports.discriminatedUnion("case", [
    external_exports.object({
      case: external_exports.literal("issueCreated").describe("Fire when a Linear issue is created.")
    }),
    external_exports.object({
      case: external_exports.literal("statusChanged").describe("Fire when a Linear issue changes status."),
      statusIds: external_exports.array(external_exports.string()).optional().describe(
        "Optional narrowing filter using Linear status UUIDs. Empty or absent means any status."
      )
    }),
    external_exports.object({
      case: external_exports.literal("endOfCycle").describe("Fire when a Linear cycle ends."),
      cycleIds: external_exports.array(external_exports.string()).optional().describe(
        "Optional narrowing filter using Linear cycle UUIDs. Empty or absent means any cycle."
      )
    })
  ]).describe("Which Linear event fires this routine."),
  projectIds: external_exports.array(external_exports.string()).optional().describe(
    "Optional narrowing filter using Linear project UUIDs. Empty or absent means any project."
  ),
  teamIds: external_exports.array(external_exports.string()).optional().describe("Optional narrowing filter using Linear team UUIDs. Empty or absent means any team.")
});
var sentryTrigger = external_exports.object({
  type: external_exports.literal("sentry"),
  event: external_exports.object({
    case: external_exports.enum(SENTRY_EVENT_CASES).describe("Which Sentry issue event fires the routine.")
  }).describe("The Sentry event to watch."),
  projectIds: external_exports.array(external_exports.string()).optional().describe("Optional project ID filter. Empty or absent means any Sentry project.")
});
var pagerdutyTrigger = external_exports.object({
  type: external_exports.literal("pagerduty"),
  event: external_exports.object({
    case: external_exports.enum(PAGERDUTY_EVENT_CASES).describe("Which PagerDuty incident event fires the routine.")
  }).describe("The PagerDuty event to watch."),
  serviceIds: external_exports.array(external_exports.string()).optional().describe("Optional service ID filter. Empty or absent means any PagerDuty service.")
});
var emailTrigger = external_exports.object({
  type: external_exports.literal("email"),
  inbox: external_exports.string().describe("One of the user's Grok Bot inbox addresses (see list_email_inboxes)."),
  from: external_exports.array(external_exports.string()).optional().describe("Optional sender allowlist (exact addresses). Empty or absent means any sender."),
  requireAuthPass: external_exports.boolean().optional().describe(
    "Only wake on mail whose SPF/DKIM/DMARC checks passed. Defaults to true; false also wakes on unauthenticated mail."
  )
});
var webhookTrigger = external_exports.object({
  type: external_exports.literal("webhook")
});
var automationSchedule = external_exports.string().trim().min(1).refine(isValidSchedule, {
  message: "Schedule must be a valid cron expression or @every interval."
});
var cronTriggerMember = external_exports.object({
  type: external_exports.literal("cron"),
  schedule: automationSchedule.describe(
    `A 5-field cron expression in the user's local time ("0 7 * * *"), or a shorthand (@hourly/@daily/@weekly/@monthly, "@every 30m"). Calendar shorthands take their clock fields from the routine's creation time, and unphased @every intervals anchor to creation. A clock time the user names is saved as named, so "8am" is "0 8 * * *" and "daily at 2" is "0 2 * * *"; only an ask that names no time takes the current minute off the <timestamp>, so asked at 1:32 "hourly" is "32 * * * *".`
  )
});
var triggerMember = external_exports.discriminatedUnion("type", [
  cronTriggerMember,
  slackListener,
  githubListener,
  originListener,
  microsoftTeamsTrigger,
  linearTrigger,
  sentryTrigger,
  pagerdutyTrigger,
  emailTrigger,
  webhookTrigger
]);
var automationTriggerShape = external_exports.union([
  external_exports.discriminatedUnion("type", [
    cronTriggerMember,
    slackListener,
    githubListener,
    originListener,
    microsoftTeamsTrigger,
    linearTrigger,
    sentryTrigger,
    pagerdutyTrigger,
    emailTrigger,
    webhookTrigger,
    external_exports.object({
      type: external_exports.literal("group"),
      listeners: external_exports.array(triggerMember).min(1).describe(
        "Any one of these fires the same prompt. Origin may mix with cron, Slack, or GitHub, but not with server-only listener types."
      )
    })
  ]),
  external_exports.array(triggerMember).min(1).describe("Bare-array shorthand for the group form: any one member fires the prompt.")
]).superRefine((value, ctx) => {
  let members;
  if (Array.isArray(value)) members = value;
  else if (value.type === "group") members = value.listeners;
  else members = [value];
  for (const member of members) {
    if (member.type === "origin" && member.pr === void 0 && member.events.some((event) => event === "ci-passed" || event === "ci-failed")) {
      ctx.addIssue({
        code: "custom",
        message: "Origin CI listeners require one explicit PR number."
      });
    }
  }
  if (!members.some((member) => member.type === "origin")) return;
  const incompatible = members.find(
    (member) => ["microsoftTeams", "linear", "sentry", "pagerduty", "email", "webhook"].includes(member.type)
  );
  if (incompatible === void 0) return;
  ctx.addIssue({
    code: "custom",
    message: `Origin can't be grouped with ${incompatible.type} until both have one scheduling authority.`
  });
}).describe(
  "What fires the routine. Prefer an event listener (Slack, GitHub, Origin, Microsoft Teams, Linear, Sentry, PagerDuty, email) over polling on a cron when the event you care about is one of the listed shapes; never pass both this and the schedule argument."
);
function recoverTriggerModelSentAsJsonEncodedString(value) {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) return value;
  try {
    return JSON.parse(trimmed);
  } catch {
    return value;
  }
}
var automationTrigger = external_exports.preprocess(
  recoverTriggerModelSentAsJsonEncodedString,
  automationTriggerShape
);
var sandUpdateStateParameters = external_exports.object({
  target: external_exports.preprocess(
    (value) => value === "workflow" ? "skill" : value,
    external_exports.enum(TARGETS).describe("Which part of your own state to change.")
  ),
  action: external_exports.enum(ACTIONS).describe(`What to do. ${ACTION_MATRIX}.`),
  fact: external_exports.string().trim().min(1).optional().describe(
    "memory only. The fact, one self-contained sentence. For forget, the EXACT text of the recorded fact (find it with RecallMemory first, or read the memory folder when it is on your computer)."
  ),
  tier: external_exports.enum(["profile", "log", "note"]).optional().describe("memory write only. Defaults to log. Keep profile small."),
  scope: external_exports.enum(["agent", "user"]).optional().describe("memory only. Defaults to agent (your own memory)."),
  id: external_exports.string().trim().min(1).optional().describe(
    "The routine's folder or the skill's id. Required for every routine action except create, and for skill delete. Omit on a skill write to create a new one."
  ),
  name: external_exports.string().trim().min(1).optional().describe(
    "routine/skill create: its name. Required on create and on a skill write; on routine update, omit to keep the current name. profile: your new name, which is the chat title the user sees."
  ),
  prompt: external_exports.string().trim().min(1).optional().describe(
    "routine only. What you should do each time it fires, written to your future self. Write it as an INTENT, not a frozen tool recipe: a connector's schema can change between fires, so describe the goal and let each run look the tool up. Required on create; on update, omit to keep the current prompt."
  ),
  schedule: automationSchedule.optional().describe(
    `routine only. Shorthand for a cron trigger \u2014 "0 7 * * *", "@daily", "@every 2h" \u2014 interpreted in the user's local time. Calendar shorthands take their clock fields from the routine's creation time, and unphased @every intervals anchor to creation. A clock time the user names is saved as named, so "8am" is "0 8 * * *" and "daily at 2" is "0 2 * * *"; only an ask that names no time takes the current minute off the <timestamp>, so asked at 1:32 "hourly" is "32 * * * *". Use this OR trigger, never both. On update, omit (with trigger) to keep the current fire condition.`
  ),
  trigger: automationTrigger.optional(),
  enabled: external_exports.boolean().optional().describe(
    "routine create/update only. On create, defaults to true. On update, omit to leave the current arming alone (use pause/resume to toggle)."
  ),
  description: external_exports.string().trim().optional().describe(
    "skill write: REQUIRED. One line on when to use the skill. profile: your new description."
  ),
  body: external_exports.string().trim().min(1).optional().describe("skill write only. The recipe, in markdown."),
  title: external_exports.string().trim().optional().describe(
    'profile set only. The short role label shown as a chip beside your name ("Designer"), not the chat title \u2014 that is your name. Pass "" to clear it.'
  ),
  avatar_shape: external_exports.enum(nonEmptyTuple(GROK_BOT_MARK_SHAPES)).optional().describe(
    "profile set only. The shape of your default mark in the sidebar. Not visible while a custom picture is installed."
  ),
  avatar_color: external_exports.enum(nonEmptyTuple(GROK_BOT_MARK_COLORS)).optional().describe(
    "profile set only. The color of your default mark in the sidebar. Not visible while a custom picture is installed."
  ),
  hidden_from_sidebar: external_exports.boolean().optional().describe(
    "settings set only. Removes your row from the user's sidebar; you stay fully functional and reachable through Cmd-K and the Hidden chats manager."
  ),
  notify_on_updates: external_exports.boolean().optional().describe('settings set only. The "Notify me about this assistant" toggle.'),
  platform: external_exports.string().trim().min(1).optional().describe("channel disconnect only. The platform to disconnect."),
  path: external_exports.string().trim().min(1).optional().describe(
    "avatar set only. Absolute path to an image you already have (write or download it first, with Shell on your own computer or Shell using the user's computer's machineId, then install it here). A path on your box under /workspace is fine \u2014 no CopyFromBox needed. png/jpg/webp/gif/svg under 5 MB."
  )
});
function sandConversationUpdateStateParameters(defaultScope) {
  return sandUpdateStateParameters.extend({
    scope: external_exports.enum(SAND_MEMORY_SCOPES).optional().describe(
      `memory only. Defaults to ${defaultScope} (${MEMORY_CONVERSATION_SCOPE_DEFAULT_LABEL[defaultScope]}).`
    )
  });
}
function sandMemoryWriteReport(args, deps, outcome) {
  if (!outcome.ok || args.target !== "memory") return null;
  if (args.action !== "write" && args.action !== "forget") return null;
  return {
    scope: memoryScope(args, deps),
    action: args.action,
    bytes: memoryFactBytes(args.fact ?? "")
  };
}
var TEAM_SETUP_CARD_ROUTES = /* @__PURE__ */ new Set(["routine.create", "skill.write"]);
var SAND_TEAM_SETUP_UNDERWAY_STATE_REASON = "this bot's setup is already running from the owner's message, and the owner is choosing its plugins and skills from the cards in this chat. Routines and skills come after they have been through the cards and ask.";
function resolveTrigger(args, need, fallback2) {
  if (args.schedule != null && args.trigger != null) {
    throw new SandToolInputError(
      "pass either 'schedule' (a cron routine) or 'trigger' (an event-driven one), never both."
    );
  }
  if (args.schedule != null) return cronTrigger(args.schedule);
  if (args.trigger != null) {
    const parsed = parseStoredTrigger(args.trigger);
    if (isTriggerParseFailure(parsed)) {
      throw new SandToolInputError(renderTriggerParseFailure(parsed));
    }
    const unbounded = findUnboundedRepoListener(parsed);
    if (unbounded !== void 0) {
      throw new SandToolInputError(renderUnboundedRepoListenerRefusal(unbounded));
    }
    return parsed;
  }
  if (fallback2 != null) return fallback2;
  return need(void 0, "schedule' or 'trigger");
}
function resolveStoredWriteProvenance(args) {
  if (args.turnProvenance === "user") return "user";
  const allowed = args.review?.allowed;
  if (allowed === void 0 || allowed === false) return args.turnProvenance;
  if (allowed.by === "user") return "user";
  const reviewedSelfMaintenance = allowed.by === "classifier" && args.firingAutomation !== void 0 && args.firingAutomation.provenance === "user" && args.targetId === args.firingAutomation.id;
  return reviewedSelfMaintenance ? "user" : args.turnProvenance;
}
function resolveFiringAutomation(deps) {
  const wakeId = deps.activeAutomationWakeId?.();
  if (wakeId === void 0) return void 0;
  const stored = deps.automationStore?.list().find((automation) => automation.id === wakeId);
  if (stored === void 0) return void 0;
  return {
    id: stored.id,
    name: stored.name,
    prompt: stored.prompt,
    provenance: stored.provenance ?? "untrusted"
  };
}
function resolveReferencedSkills(prompt, deps) {
  const skills = deps.skillStore?.list() ?? [];
  if (skills.length === 0) return [];
  return collectMentionedSkills(prompt, skills).map((skill) => ({
    id: skill.id,
    name: skill.name,
    body: skill.body
  }));
}
function probeFiveMinuteAutomationFloor(deps) {
  try {
    return deps.fiveMinuteAutomationFloorEnabled() ? "enabled" : "disabled";
  } catch (error3) {
    reportHostDiagnostic({
      kind: "automation_floor_probe_failed",
      errorClass: errorLogTag(error3)
    });
    return "probe_failed";
  }
}
async function writeAutomation(args, deps, need) {
  const isUpdate = args.action === "update";
  const isAutomationRun = deps.canCreateAutomation?.() === false;
  if (!isUpdate && isAutomationRun) {
    return {
      ok: false,
      reason: "a routine run cannot create another routine. Tell the user what you wanted to schedule and let them ask for it in a conversation."
    };
  }
  const id = isUpdate ? need(args.id, "id") : void 0;
  if (isUpdate && isAutomationRun) {
    const wakeId = deps.activeAutomationWakeId?.();
    if (wakeId === void 0) {
      return {
        ok: false,
        reason: "a routine run cannot update a routine when the routine that started it cannot be verified. Tell the user what you wanted to change and let them ask for it in a conversation."
      };
    }
    if (id !== wakeId) {
      return {
        ok: false,
        reason: "a routine run can only update the routine that started it. Tell the user what you wanted to change and let them ask for it in a conversation."
      };
    }
  }
  if (isUpdate && isAutomationRun && args.enabled === true) {
    return {
      ok: false,
      reason: "a routine run cannot enable a routine. Tell the user what you wanted to resume and let them ask for it in a conversation."
    };
  }
  const existing = id === void 0 ? void 0 : deps.automationStore?.list().find((automation) => automation.id === id);
  if (isUpdate && deps.automationStore != null && existing == null) {
    throw new SandToolInputError(
      `no routine with folder "${id}" exists \u2014 list the automations folder, then pass its id.`
    );
  }
  if (isUpdate && deps.canReviewAutomationWrites?.() === false && existing?.provenance === "user") {
    return {
      ok: false,
      reason: `"${existing.name}" is a routine the user set up, and changing it needs a review this host cannot run. Ask the user to update it from the app, or pause it and create a new routine of your own.`
    };
  }
  const enabledPatch = (() => {
    if (args.enabled !== void 0) return { isEnabled: args.enabled };
    if (isUpdate) return {};
    return { isEnabled: true };
  })();
  const spec = {
    name: args.name ?? need(existing?.name, "name"),
    prompt: args.prompt ?? need(existing?.prompt, "prompt"),
    trigger: resolveTrigger(args, need, existing?.trigger),
    ...enabledPatch
  };
  if (probeFiveMinuteAutomationFloor(deps) !== "disabled" && triggerCronSchedules(spec.trigger).some(
    (schedule) => !isValidSchedule(schedule, SAND_AUTOMATION_MIN_INTERVAL_MS)
  )) {
    return {
      ok: false,
      reason: "routine schedules must be at least 5 minutes apart."
    };
  }
  const operation = isUpdate ? "update" : "create";
  const requestedFolder = isUpdate || args.id === void 0 ? {} : { folderId: args.id };
  const turnProvenance = deps.automationWriteProvenance?.() ?? "untrusted";
  if (turnProvenance === "template_import" && isTemplateSetupConsentedWrite({ operation, spec })) {
    const outcome2 = await deps.state.createAutomation({
      spec,
      provenance: turnProvenance,
      ...requestedFolder
    });
    if (!outcome2.ok) return outcome2;
    const note2 = await deps.onListenerAutomationSaved?.(spec.trigger);
    return note2 == null ? outcome2 : stateWriteOk(`${outcome2.detail}
${note2}`);
  }
  const referencedSkills = resolveReferencedSkills(spec.prompt, deps);
  const provenance = reviewedWriteProvenance(turnProvenance);
  const firingAutomation = resolveFiringAutomation(deps);
  const review = await deps.reviewAutomationWrite?.(
    {
      operation,
      id,
      spec,
      referencedSkills,
      writeProvenance: provenance,
      ...firingAutomation === void 0 ? {} : { firingRoutine: firingAutomation }
    },
    deps.toolCallId
  );
  if (review !== void 0 && !review.allowed) {
    return { ok: false, reason: review.reason };
  }
  const storedProvenance = resolveStoredWriteProvenance({
    review,
    turnProvenance: provenance,
    targetId: id,
    firingAutomation
  });
  const outcome = id === void 0 ? await deps.state.createAutomation({
    spec,
    provenance: storedProvenance,
    ...requestedFolder
  }) : await deps.state.updateAutomation({ id, spec, provenance: storedProvenance });
  if (!outcome.ok) return outcome;
  const note = await deps.onListenerAutomationSaved?.(spec.trigger);
  return note == null ? outcome : stateWriteOk(`${outcome.detail}
${note}`);
}
function refuseUnreviewableUserAutomationRemoval(deps, automationId) {
  if (deps.canReviewAutomationWrites?.() !== false) return void 0;
  const automation = deps.automationStore?.list().find((entry) => entry.id === automationId);
  if (automation?.provenance !== "user") return void 0;
  return {
    ok: false,
    reason: `"${automation.name}" is a routine the user set up, and removing it needs a review this host cannot run. Ask the user to remove it from the app, or pause it instead.`
  };
}
function resolveNamedSkill(deps, id) {
  if (id === void 0) return void 0;
  const target = resolveBotSkillWriteTarget(deps.skillStore, id);
  if (target.kind === "bot-skill" || target.kind === "personal") return target.skill;
  return deps.skillStore?.list().find((skill) => skill.id === id);
}
async function writeSkill(args, deps, need) {
  const name17 = need(args.name, "name");
  const body = need(args.body, "body");
  const description9 = need(args.description, "description");
  const id = args.id;
  const existing = resolveNamedSkill(deps, id);
  const skillId = existing?.id ?? id ?? slugifySkillName(name17);
  const reservedInStore = deps.skillStore?.list().find(
    (skill) => skill.id === skillId && (skill.source === "managed" || skill.source === "plugin" && !isBotSkillsPluginSkill(skill))
  );
  if (reservedInStore?.source === "plugin") {
    return { ok: false, reason: otherPluginSkillRefusal(skillId) };
  }
  if (reservedInStore != null || RESERVED_MANAGED_SKILL_IDS.has(skillId)) {
    return {
      ok: false,
      reason: `"${skillId}" is the id of a Cursor-managed skill, which cannot be edited or shadowed. Save yours under a different name.`
    };
  }
  const mentionTargets = [
    { id: skillId, name: name17 },
    ...existing != null && existing.name !== name17 ? [{ id: existing.id, name: existing.name }] : []
  ];
  const referencingAutomations = (deps.automationStore?.list() ?? []).filter(
    (automation) => mentionTargets.some((target) => promptReferencesSkill(automation.prompt, target))
  );
  const firingAutomation = resolveFiringAutomation(deps);
  const provenance = reviewedWriteProvenance(deps.automationWriteProvenance?.() ?? "untrusted");
  let review;
  if (deps.canReviewAutomationWrites?.() === false) {
    return {
      ok: false,
      reason: `Saving shared skills needs a review this host cannot run. Ask the user to add or update "${name17}" from the app, or save the instructions as a routine of your own instead.`
    };
  }
  if (referencingAutomations.length > 0) {
    const anchor = referencingAutomations[0];
    review = await deps.reviewAutomationWrite?.(
      {
        operation: "workflow_body",
        id: existing?.id ?? id,
        spec: {
          name: name17,
          prompt: body,
          trigger: anchor.trigger,
          isEnabled: referencingAutomations.some((automation) => automation.isEnabled)
        },
        writeProvenance: provenance,
        ...firingAutomation === void 0 ? {} : { firingRoutine: firingAutomation },
        referencedSkills: [
          {
            id: skillId,
            name: name17,
            body
          }
        ],
        referencingRoutines: referencingAutomations.map((automation) => ({
          id: automation.id,
          name: automation.name,
          prompt: automation.prompt
        }))
      },
      deps.toolCallId
    );
    if (review !== void 0 && !review.allowed) {
      return { ok: false, reason: review.reason };
    }
  }
  return await deps.state.writeSkill({
    id,
    name: name17,
    description: description9,
    body,
    provenance: resolveStoredWriteProvenance({
      review,
      turnProvenance: provenance,
      targetId: id ?? existing?.id,
      firingAutomation
    })
  });
}
function memoryScope(args, deps) {
  return args.scope ?? deps.conversationMemory?.defaultScope ?? "agent";
}
function recordMemoryOutcome(ctx, args, deps, outcome) {
  if (deps.memoryTelemetry === void 0) return;
  const report = sandMemoryWriteReport(args, deps, outcome);
  if (report === null) return;
  recordMemoryWrite(
    deps.metricsHarness === void 0 ? void 0 : { ctx, harness: deps.metricsHarness },
    deps.memoryTelemetry,
    report
  );
}
var ROUTES = {
  "memory.write": async (args, deps, need) => await deps.state.writeMemory({
    content: need(args.fact, "fact"),
    tier: args.tier ?? "log",
    scope: memoryScope(args, deps)
  }),
  "memory.forget": async (args, deps, need) => await deps.state.removeMemory({
    content: need(args.fact, "fact"),
    scope: memoryScope(args, deps)
  }),
  "routine.create": writeAutomation,
  "routine.update": writeAutomation,
  "routine.pause": async (args, deps, need) => await deps.state.setAutomationEnabled({
    id: need(args.id, "id"),
    isEnabled: false
  }),
  "routine.resume": async (args, deps, need) => {
    if (deps.canCreateAutomation?.() === false) {
      return {
        ok: false,
        reason: "a routine run cannot enable a routine. Tell the user what you wanted to resume and let them ask for it in a conversation."
      };
    }
    if (deps.automationWriteProvenance?.() === "template_import") {
      return await writeAutomation({ ...args, action: "update", enabled: true }, deps, need);
    }
    return await deps.state.setAutomationEnabled({
      id: need(args.id, "id"),
      isEnabled: true
    });
  },
  "routine.delete": async (args, deps, need) => {
    const id = need(args.id, "id");
    const refusal = refuseUnreviewableUserAutomationRemoval(deps, id);
    if (refusal !== void 0) return refusal;
    return await deps.state.deleteAutomation({ id });
  },
  "skill.write": writeSkill,
  "skill.delete": async (args, deps, need) => {
    const id = need(args.id, "id");
    const existing = resolveNamedSkill(deps, id);
    if (existing?.source === "plugin" && !isBotSkillsPluginSkill(existing)) {
      return { ok: false, reason: otherPluginSkillRefusal(id) };
    }
    if (existing?.source === "automation") {
      const refusal = refuseUnreviewableUserAutomationRemoval(deps, id);
      if (refusal !== void 0) return refusal;
    }
    if (deps.canReviewAutomationWrites?.() === false && existing != null && existing.source !== "automation") {
      return {
        ok: false,
        reason: `"${existing.name}" is a shared skill, and removing it needs a review this host cannot run. Ask the user to remove it from the app.`
      };
    }
    return await deps.state.deleteSkill({
      id,
      provenance: reviewedWriteProvenance(deps.automationWriteProvenance?.() ?? "untrusted")
    });
  },
  "profile.set": async (args, deps) => await deps.state.updateProfile({
    name: args.name,
    description: args.description,
    title: args.title,
    avatarShape: args.avatar_shape,
    avatarColor: args.avatar_color
  }),
  "settings.set": async (args, deps) => await deps.state.updateSettings({
    hiddenFromSidebar: args.hidden_from_sidebar,
    notifyOnAgentUpdates: args.notify_on_updates
  }),
  "channel.disconnect": async (args, deps, need) => await deps.state.disconnectChannel({
    platform: need(args.platform, "platform")
  }),
  "avatar.set": async (args, deps, need) => await deps.state.setAvatar({ path: need(args.path, "path") }),
  "avatar.clear": async (_args, deps) => await deps.state.clearAvatar()
};
function isSandStateRoute(value) {
  return Object.hasOwn(ROUTES, value);
}
async function applySandStateUpdate(args, deps) {
  const routeKey = `${args.target}.${args.action}`;
  if (!isSandStateRoute(routeKey)) {
    throw new SandToolInputError(
      `'${args.action}' is not an action on ${args.target}. ${args.target} takes: ${Object.keys(OPERATIONS[args.target]).join(" | ")}.`
    );
  }
  if (TEAM_SETUP_CARD_ROUTES.has(routeKey) && deps.isTeamSetupUnderway?.() === true) {
    return { ok: false, reason: SAND_TEAM_SETUP_UNDERWAY_STATE_REASON };
  }
  const route = ROUTES[routeKey];
  const need = (value, field) => {
    if (value == null) {
      throw new SandToolInputError(`'${field}' is required for ${args.target} ${args.action}.`);
    }
    return value;
  };
  return await route(args, deps, need);
}
function stateToolDescription(memoryWrite, teamBot = false) {
  return [
    "Change your OWN durable state: what you remember (own or shared user), the routines you run, the skills you save, your profile and settings, which channels you're connected to, and your picture. Prefer this over editing those files with the shell \u2014 read them with RecallMemory, or with Read and grep when they are on your computer.",
    "",
    "target + action:",
    ...operationLines(memoryWrite, teamBot),
    "",
    "Just do it and mention it in passing \u2014 don't narrate a save or ask permission for an ordinary one. Creating or changing a ROUTINE may ask the user to confirm, since it's the one change that acts while they're away; if it does, they'll see a card and you'll get their answer back as the tool result."
  ].join("\n");
}
var description8 = stateToolDescription(OPERATIONS.memory.write);
var toolVariants = /* @__PURE__ */ new Map();
function toolVariant(story, teamBot) {
  const key = JSON.stringify([
    story?.defaultScope,
    story?.userScope,
    story?.teamShared,
    story?.privateMain,
    teamBot
  ]);
  let variant = toolVariants.get(key);
  if (variant === void 0) {
    variant = {
      description: stateToolDescription(
        story === void 0 ? OPERATIONS.memory.write : conversationMemoryWrite(story),
        teamBot
      ),
      parameters: story === void 0 ? sandUpdateStateParameters : sandConversationUpdateStateParameters(story.defaultScope)
    };
    toolVariants.set(key, variant);
  }
  return variant;
}
function describeStateUpdate(args) {
  if (args.target === "memory") {
    if (args.scope === "user") return "user memory";
    return "memory";
  }
  if (args.target === "avatar") return "avatar";
  return args.name ?? args.id ?? args.platform ?? args.target;
}
function createSandStateTool(deps) {
  const teamBot = deps.teamBot?.() === true;
  const variant = deps.conversationMemory === void 0 && !teamBot ? { description: description8, parameters: sandUpdateStateParameters } : toolVariant(deps.conversationMemory, teamBot);
  return defineCommunicateTool(deps, {
    id: "PLATFORM_ACTION",
    name: SAND_UPDATE_STATE_TOOL_NAME,
    description: variant.description,
    parameters: variant.parameters,
    describeActivity: (args) => ({ detail: describeStateUpdate(args) }),
    execute: async (ctx, args, d) => {
      d.assertNoPendingAutoReviewApproval?.();
      const outcome = await applySandStateUpdate(args, d);
      recordMemoryOutcome(ctx, args, d, outcome);
      return outcome.ok ? outcome.detail : `Not saved \u2014 ${outcome.reason}`;
    }
  });
}

