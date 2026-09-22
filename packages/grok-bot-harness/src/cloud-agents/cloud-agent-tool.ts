/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/cloud-agents/cloud-agent-tool.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_utils_pb();
init_esm2();
init_errors();
init_zod();

// @recovered-fragment 2/2
var SandCloudAgentToolInputError = class extends Error {
};
function cloudAgentMetricsScope(ctx, deps) {
  return deps.harness === void 0 ? void 0 : { ctx, harness: deps.harness };
}
function exchangeAttachmentsOf(args, loaded) {
  if (loaded?.ok !== true) return {};
  const images = (args.images ?? []).map((image2) => ({ url: image2.url }));
  const attachments = (args.files ?? []).map((file2, index) => {
    const byteSize = loaded.files[index]?.data.byteLength;
    return { url: file2.url, ...byteSize === void 0 ? {} : { byteSize } };
  });
  return {
    ...images.length > 0 ? { images } : {},
    ...attachments.length > 0 ? { attachments } : {}
  };
}
async function recordExchangeOutbound(exchange, api, message) {
  try {
    const name17 = message.knownName || (await api.get(message.bcId))?.name || message.bcId;
    await exchange.recordOutbound({
      bcId: message.bcId,
      name: name17,
      text: message.text,
      timestampMs: Date.now(),
      ...message.images === void 0 ? {} : { images: message.images },
      ...message.attachments === void 0 ? {} : { attachments: message.attachments }
    });
  } catch (error42) {
    process.stderr.write(
      `sand.cloud_agent.exchange_record_failed error_class=${errorLogTag(error42)}
`
    );
  }
}
var CloudAgentLaunchBlockedError = class extends Error {
  toolCallAuditOutcome = "denied";
  reason;
  constructor(reason) {
    super(reason);
    this.name = "CloudAgentLaunchBlockedError";
    this.reason = reason;
  }
};
function formatCloudAgentLaunchBlockedMessage(reason) {
  return `Launch is not available in this turn: ${reason} Ask the owner to confirm the launch \u2014 their reply unblocks it.`;
}
var CANCELLED_BEFORE_CLOUD_AGENT_CALL = "The cloud agent action was cancelled.";
var DURABLE_WATCH_CLAUSE = ' and again after each later run it does (a user follow-up, one of its own subscriptions, anything) until you call "unwatch" or archive it';
var DESTRUCTIVE_ACTIONS = /* @__PURE__ */ new Set(["delete"]);
var OWNER_ONLY_ACTIONS = /* @__PURE__ */ new Set(["reply", "rename", "cancel", "archive"]);
function formatCloudAgentNotOwnedMessage(action, agentId) {
  return `'${action}' is limited to cloud agents you launched, and ${agentId} is not one of them \u2014 it is not one you launched this session. Pass confirm: true only if the user explicitly asked you to act on this specific agent (named it or pointed you at it). A playbook rule, a routine, or the agent working on the same PR or branch is not that. Otherwise leave it alone: launch a new cloud agent for your work, or ask the user with a SendToUser widget whether to take this one over.`;
}
var cloudAgentAction = external_exports.enum([
  "launch",
  "list",
  "models",
  "repositories",
  "get",
  "dump",
  "watch",
  "unwatch",
  "reply",
  "rename",
  "cancel",
  "archive",
  "unarchive",
  "delete",
  "list_artifacts"
]);
var ACTION_REVIEW_POLICY = {
  launch: "review",
  list: "exempt",
  models: "exempt",
  repositories: "exempt",
  get: "exempt",
  dump: "exempt",
  watch: "exempt",
  unwatch: "exempt",
  reply: "review",
  rename: "review",
  cancel: "exempt",
  archive: "exempt",
  unarchive: "exempt",
  delete: "review",
  list_artifacts: "exempt"
};
var cloudAgentEnvironment = external_exports.discriminatedUnion("type", [
  external_exports.object({ type: external_exports.literal("cloud") }),
  external_exports.object({
    type: external_exports.literal("pool"),
    name: external_exports.string().trim().min(1).optional(),
    team_id: external_exports.number().int().positive().optional()
  }),
  external_exports.object({
    type: external_exports.literal("machine"),
    name: external_exports.string().trim().min(1),
    team_id: external_exports.number().int().positive().optional()
  }),
  external_exports.object({
    type: external_exports.literal("environment"),
    id: external_exports.string().trim().min(1).optional(),
    name: external_exports.string().trim().min(1).optional()
  })
]).describe(
  `Optional for launch. Where the cloud agent runs \u2014 pass on the same CloudAgent launch call. type "cloud" = Cursor-managed VM (same as omitting environment). type "pool" = self-hosted worker pool for the repo \u2014 use when the user asks for a shared/self-hosted pool, a named pool (e.g. mobile-ios-mac), Mac/iOS CI machines, or any non-default cloud VM runtime. Pass name for a specific pool ("mobile-ios-mac"), or omit name to use any eligible pool for the repo. type "machine" = one named private worker ("My Machine"); name is required. type "environment" = a saved Cloud Agents environment from the user's cursor.com dashboard (custom env vars, egress rules, install commands, optional multi-repo config) running on a Cursor VM. Pass name (its display name) or id (its public id); launch errors list the available environments if the selector doesn't match. With a saved environment, repo_url is optional and defaults to the environment's primary repo. For pool and machine, team_id is only needed when the user belongs to multiple active teams.`
);
function refineCloudAgentAttachmentUrls(value, ctx) {
  for (const field of ["images", "files"]) {
    for (const [index, attachment] of (value[field] ?? []).entries()) {
      if (posixPathFromFileUrl(attachment.url) == null) {
        ctx.addIssue({
          code: external_exports.ZodIssueCode.custom,
          path: [field, index, "url"],
          message: `each ${field} url must be an absolute file:// url (https:// is not supported here)`
        });
      }
    }
  }
}
function objectFromJsonSpelling(value) {
  if (typeof value !== "string") {
    return value;
  }
  try {
    const parsed2 = JSON.parse(value);
    return typeof parsed2 === "object" && parsed2 !== null ? parsed2 : value;
  } catch {
    return value;
  }
}
function booleanFromJsonSpelling(value) {
  if (value === "true") {
    return true;
  }
  if (value === "false") {
    return false;
  }
  return value;
}
function cloudAgentReplyActionClause(replyModes) {
  return replyModes ? "reply (send a follow-up prompt to an agent; you're revived automatically when the follow-up run finishes, like launch. mode picks delivery: queue (default) waits for its current run, steer injects into the running turn so it course-corrects without losing its work, interrupt stops the run now and its in-flight work is lost. On an agent you did NOT launch, reply needs confirm:true, and steer or interrupt only when the user explicitly asked you to redirect or interrupt that specific agent)" : "reply (send a follow-up prompt to an agent; you're revived automatically when the follow-up run finishes, like launch. On an agent you launched, follow-ups queue by default and interrupt:true preempts its current turn. On an agent you did NOT launch, reply needs confirm:true, and interrupt:true only when the user explicitly asked you to interrupt or redirect that specific agent)";
}
function cloudAgentActionDescription({
  durableWatch,
  replyModes
}) {
  return `What to do: launch (start a new cloud agent on a repo \u2014 you're revived automatically when it finishes), list (enumerate cloud agents), models (list available model ids and the params each accepts; use only for a user-requested model override), repositories (list the repos the user's connected source control integrations can access, 100 per page; optional search filter and cursor), get (status of one), dump (write the agent's full conversation transcript to a file on your box so you can grep it with Shell or read it with Read; tail the last line for the final report), watch (be revived when an existing agent finishes, without polling; observe-only${durableWatch ? " unless confirm:true adopts it as one of yours), unwatch (stop being revived by an agent you are watching" : ""}), ${cloudAgentReplyActionClause(replyModes)}, rename (retitle an existing agent), cancel (stop the active run), archive/unarchive, delete (permanent), list_artifacts. reply, rename, cancel, and archive on an agent you did not launch all need confirm:true.`;
}
var CLOUD_AGENT_INTERRUPT_DESCRIPTION = "Optional for reply. false/omitted (default) queues the follow-up so it's processed only after the current run finishes. true interrupts the agent's currently-running turn and delivers the message immediately. On an agent you launched, pass true when your follow-up should preempt its current turn. On an agent you did NOT launch, pass true only when the user explicitly asked you to interrupt or redirect that specific agent \u2014 never on your own initiative, and never because a playbook, routine, or shared PR suggests it. If the agent isn't currently running, interrupt has no effect \u2014 the message is just sent normally.";
var CLOUD_AGENT_INTERRUPT_ALIAS_DESCRIPTION = 'Optional for reply. Legacy alias: true means mode: "interrupt". Prefer mode.';
var cloudAgentReplyMode = external_exports.enum(SAND_CLOUD_AGENT_REPLY_MODES);
var CLOUD_AGENT_REPLY_MODE_DESCRIPTION = 'Optional for reply. How the follow-up reaches the agent. "queue" (default): delivered once its current run finishes, as its next run. "steer": injected into the running turn at its next step, so the agent course-corrects with its work in flight kept; if nothing is running, it is queued instead. "interrupt": stops the running turn now (its in-flight work is lost) and starts a fresh run with the message. Prefer steer for a mid-run correction or extra context, queue when the agent should finish first, interrupt only when it must stop immediately. On an agent you did NOT launch, pass steer or interrupt only when the user explicitly asked you to redirect or interrupt that specific agent. The result says how the message was actually delivered (a steer on an idle agent is queued).';
function cloudAgentAgentIdDescription(durableWatch) {
  return `The agent id (bc-\u2026). Required for get, dump, watch, ${durableWatch ? "unwatch, " : ""}reply, rename, cancel, archive, unarchive, delete, list_artifacts.`;
}
function cloudAgentConfirmDescription(durableWatch) {
  return `Required true for delete (confirm with the user via a SendToUser widget first), and for reply, rename, cancel, or archive on an agent you did not launch \u2014 pass it only when the user explicitly asked you to act on that specific agent.${durableWatch ? " On watch, confirm: true adopts an agent you did not launch: it becomes one of yours and you keep being revived after every later run." : ""}`;
}
var cloudAgentActionWithoutUnwatch = cloudAgentAction.exclude(["unwatch"]);
var cloudAgentParameters = external_exports.object({
  action: cloudAgentAction.describe(
    cloudAgentActionDescription({ durableWatch: true, replyModes: true })
  ),
  prompt: external_exports.string().trim().optional().describe("Instruction text. Required for launch and reply."),
  images: external_exports.array(
    external_exports.object({
      url: external_exports.string().trim().min(1).describe("file:// URL of the image, e.g. file:///workspace/shot.png.")
    })
  ).optional().describe(
    "Optional image(s) to attach to a launch or reply \u2014 a screenshot, mock, or chart the cloud agent needs to see. The agent actually sees them (they ride its vision channel), so never paste an image as markdown in the prompt. Pass an absolute file:// URL to a file in your box: a path under /workspace (file:///workspace/shot.png) or one in your own attachments/assets folder (file:///home/box/agent-data/agents/<your id>/attachments/\u2026). https:// is not supported here \u2014 download it to a file first. Describe what each image shows in the prompt itself; there is no caption field. A non-image file goes in files, not here."
  ),
  files: external_exports.array(
    external_exports.object({
      url: external_exports.string().trim().min(1).describe("file:// URL of the file, e.g. file:///workspace/spec.pdf.")
    })
  ).optional().describe(
    `Optional file(s) to hand to a launch or reply \u2014 a spec, dataset, log, config, archive, or recording the cloud agent should work from. Each is saved into the agent's workspace under uploads/ and its path is listed in the prompt it receives, so it reads them with its own tools instead of you pasting contents. Documents (${CLOUD_AGENT_DOCUMENT_EXTENSIONS_HINT}) and any text file (source, scripts, patches, configs \u2014 recognized by content) up to ${CLOUD_AGENT_DOCUMENT_LIMIT_LABEL} each, videos (${CLOUD_AGENT_VIDEO_EXTENSIONS_HINT}) up to ${CLOUD_AGENT_VIDEO_LIMIT_LABEL} each, and all attachments on one call (images included) up to ${CLOUD_AGENT_ATTACHMENTS_TOTAL_LIMIT_LABEL} together; other binary files are refused. .env-style files are refused because they usually hold secrets and would land in the agent's workspace. An image passed here is delivered as a file to keep, not shown \u2014 use images for that. Same file:// URL rules as images: a path under /workspace or in your own attachments/assets folder. Say what each file is for in the prompt itself.`
  ),
  /* eslint-disable lingui/no-unlocalized-strings -- CloudAgent parameter descriptions are model protocol, not UI */
  repo: external_exports.string().trim().optional().describe(
    `Required for launch unless new_repo is true or environment.type is "environment" (a saved environment supplies its own repos). Full repository URL on an SCM provider connected to the user's Cursor account \u2014 GitHub, GitLab, Bitbucket, or Azure DevOps (e.g. https://github.com/owner/repo or https://gitlab.com/group/project) \u2014 or an existing Cursor Origin repository, as its https://cursor.com/codebase/owner/repo page or its origin.cursor.com clone URL (Origin needs no separate connection: the signed-in Cursor account is the Origin account). A bare owner/name is rejected because it does not identify the provider; when the user gives one, look the repository up or ask where it lives, then pass the URL.`
  ),
  repo_url: external_exports.string().trim().optional().describe("Backward-compatible alias for repo."),
  search: external_exports.string().trim().optional().describe(
    "Optional for repositories: a repo-name fragment (or owner/name) the source control integration matches against its own listing, e.g. 'widgets' or 'acme/widgets'. Not a regex."
  ),
  cursor: external_exports.string().trim().optional().describe(
    "Optional for repositories: the cursor from a previous result's 'More repositories' line, to fetch the next page. Pass the same 'search' you used with it."
  ),
  new_repo: external_exports.boolean().optional().describe(
    'Create a new private Origin repo and start from scratch. Prefer this for greenfield requests such as "build an app", "create a new project", or "start from scratch" when the user has not named an existing repo.'
  ),
  /* eslint-enable lingui/no-unlocalized-strings */
  starting_ref: external_exports.string().trim().optional().describe(
    "Optional for launch. Branch or commit to start from; defaults to the repo's default branch."
  ),
  model: external_exports.string().trim().optional().describe(
    "Optional model id for launch/reply. Pass only when the user explicitly requests a model override; never choose one based on the task, catalog order, or your own preference. Use the 'models' action to resolve a user-requested model name. For launch, omit to use the user's saved/team/global cloud-agent default. For reply, omit to keep the cloud agent's current model."
  ),
  model_params: external_exports.record(external_exports.string(), external_exports.string()).optional().describe(
    `Optional structured model parameters for launch/reply, as a map of param id to string value (e.g. {"thinking":"true","effort":"xhigh"}). Requires model because parameter schemas are model-specific. Pass only for model settings the user explicitly requests; otherwise omit. Use the 'models' action to see the requested model's params, allowed values, and compatibility restrictions. Cloud agents always run in Max Mode, but parameter compatibility remains model-specific. Booleans are the strings "true"/"false".`
  ),
  title: external_exports.string().trim().optional().describe(
    "Title for the cloud agent shown in the UI, used verbatim instead of the auto-generated summary of the prompt. Optional for launch; required for rename."
  ),
  is_canvas: external_exports.boolean().optional().describe(
    "Launch only. true when the deliverable is a Cursor canvas (see Canvases). Implies new_repo: true; omit repo."
  ),
  is_show_card: external_exports.boolean().optional().describe(
    "Launch only, with is_canvas. A canvas launch hides its cursor-agent card; pass true only if the user asked to follow the cloud agent itself."
  ),
  project: external_exports.preprocess(booleanFromJsonSpelling, external_exports.boolean()).optional().describe(
    "Launch only. true starts a Project instead of a plain agent. The agent becomes the Project coordinator (see Projects). Pass true only when the user explicitly asked for a project. Omit it otherwise, including for large tasks."
  ),
  environment: external_exports.preprocess(objectFromJsonSpelling, cloudAgentEnvironment).optional().describe(
    'Optional for launch. Sets where the cloud agent runs. Example for a named shared pool: {"type":"pool","name":"mobile-ios-mac"}. Example for any eligible shared pool: {"type":"pool"}. Example for a saved Cloud Agents environment: {"type":"environment","name":"evals"}. Omit (or {"type":"cloud"}) for a Cursor-managed VM.'
  ),
  mode: cloudAgentReplyMode.optional().describe(CLOUD_AGENT_REPLY_MODE_DESCRIPTION),
  interrupt: external_exports.boolean().optional().describe(CLOUD_AGENT_INTERRUPT_ALIAS_DESCRIPTION),
  agent_id: external_exports.string().trim().optional().describe(cloudAgentAgentIdDescription(true)),
  scope: external_exports.enum(["launched", "all"]).optional().describe(
    "For list: 'launched' (default) returns only the agents you launched (or the user handed to you) this session; 'all' returns every cloud agent on the user's account."
  ),
  include_archived: external_exports.boolean().optional().describe("For list: include archived agents (default false)."),
  limit: external_exports.number().int().positive().optional().describe("For list: max agents to return (default 20)."),
  confirm: external_exports.boolean().optional().describe(cloudAgentConfirmDescription(true))
}).superRefine(refineCloudAgentAttachmentUrls);
function cloudAgentParametersFor(enabled) {
  const durableWatch = enabled.durableWatch === true;
  const replyModes = enabled.replyModes === true;
  const base = cloudAgentParameters.innerType().omit({
    ...enabled.isCanvasesEnabled ? {} : { is_canvas: true, is_show_card: true },
    // Reply modes off: no `mode`, and `interrupt` keeps today's full text.
    ...replyModes ? {} : { mode: true }
  });
  const withReplyModes = replyModes ? base : base.extend({
    interrupt: external_exports.boolean().optional().describe(CLOUD_AGENT_INTERRUPT_DESCRIPTION)
  });
  const hostSpecific = durableWatch && replyModes ? withReplyModes : withReplyModes.extend({
    action: (durableWatch ? cloudAgentAction : cloudAgentActionWithoutUnwatch).describe(
      cloudAgentActionDescription({ durableWatch, replyModes })
    ),
    agent_id: external_exports.string().trim().optional().describe(cloudAgentAgentIdDescription(durableWatch)),
    confirm: external_exports.boolean().optional().describe(cloudAgentConfirmDescription(durableWatch))
  });
  const refined = hostSpecific.superRefine(refineCloudAgentAttachmentUrls);
  if (replyModes) return refined;
  let strayMode;
  return external_exports.preprocess((raw) => {
    strayMode = readStrayReplyMode(raw);
    return raw;
  }, refined).transform((parsed2) => strayMode === void 0 ? parsed2 : { ...parsed2, mode: strayMode });
}
var strayReplyModeCarrier = external_exports.object({ mode: cloudAgentReplyMode.optional() });
function readStrayReplyMode(raw) {
  const carried = strayReplyModeCarrier.safeParse(raw);
  return carried.success ? carried.data.mode : void 0;
}
function cloudAgentRuntimeDescription(environment) {
  if (environment == null) {
    return "a Cursor VM";
  }
  switch (environment.type) {
    case "cloud":
      return "a Cursor VM";
    case "pool":
      return environment.name == null ? "an eligible self-hosted pool" : `the '${environment.name}' self-hosted pool`;
    case "machine":
      return `the '${environment.name}' private worker`;
    case "environment":
      return `a Cursor VM in the '${environment.name ?? environment.id}' saved environment`;
    default: {
      const exhaustiveCheck = environment;
      return exhaustiveCheck;
    }
  }
}
function toCloudAgentEnvironment(environment) {
  if (environment == null) {
    return void 0;
  }
  switch (environment.type) {
    case "cloud":
      return environment;
    case "pool":
      return {
        type: "pool",
        name: environment.name,
        teamId: environment.team_id
      };
    case "machine":
      return {
        type: "machine",
        name: environment.name,
        teamId: environment.team_id
      };
    case "environment":
      return {
        type: "environment",
        publicId: environment.id,
        name: environment.name
      };
    default: {
      const exhaustiveCheck = environment;
      return exhaustiveCheck;
    }
  }
}
function resolveReplyMode(args, replyModes) {
  if (replyModes && args.mode !== void 0) {
    return args.mode;
  }
  return args.interrupt === true ? "interrupt" : "queue";
}
function requireField2(value, name17, action) {
  const trimmed = value?.trim();
  if (trimmed == null || trimmed.length === 0) {
    throw new SandCloudAgentToolInputError(`'${name17}' is required for the '${action}' action.`);
  }
  return trimmed;
}
function modelCatalogLines(catalog) {
  const lines2 = [];
  for (const entry of catalog) {
    const name17 = entry.displayName != null && entry.displayName.length > 0 ? ` (${entry.displayName})` : "";
    const aliases = entry.aliases.length > 0 ? ` [aliases: ${entry.aliases.join(", ")}]` : "";
    lines2.push(`- ${entry.id}${name17}${aliases}`);
    for (const param of entry.params) {
      const values = param.values.map((v2) => v2.value).join(" | ");
      lines2.push(`    ${param.id}: ${values}`);
    }
    for (const note of describeParamIncompatibilities(entry)) {
      lines2.push(`    (restriction) ${note}`);
    }
  }
  return lines2;
}
async function validateModelSelection(api, modelId, modelParams) {
  const trimmedModelId = modelId?.trim() ?? "";
  const hasModel = trimmedModelId.length > 0;
  const paramsToValidate = modelParams != null && Object.keys(modelParams).length > 0 ? modelParams : void 0;
  if (!hasModel) {
    return paramsToValidate == null ? null : "'model' is required when 'model_params' are provided.";
  }
  let catalog;
  try {
    catalog = await api.listModels();
  } catch {
    return null;
  }
  const entry = findCatalogEntry(catalog, trimmedModelId);
  if (entry == null) {
    const ids = catalog.map((e) => e.id).join(", ");
    return `Unknown model '${modelId}'. Use the 'models' action to list valid models. Available: ${ids}.`;
  }
  if (paramsToValidate != null) {
    const errors = validateModelParams(entry, paramsToValidate);
    if (errors.length > 0) {
      return `Invalid model_params for ${entry.id}: ${errors.join(" ")}`;
    }
  }
  return null;
}
function backendRejectionMessage(error42, repoUrl) {
  if (!(error42 instanceof ConnectError)) return null;
  const structured = error42.findDetails(ErrorDetails)[0];
  const details = structured?.details;
  const provider = detectScmProviderForRepoUrl(repoUrl);
  const providerName = provider == null || provider === "origin" ? null : scmProviderDisplayName(provider);
  if (structured?.error === ErrorDetails_Error.GITHUB_USER_NO_ACCESS || structured?.error === ErrorDetails_Error.GITHUB_APP_NO_ACCESS) {
    return "The repository is not accessible to the connected GitHub account.";
  }
  if (details?.additionalInfo?.scmFailureReason === "repo_not_accessible") {
    return provider === "origin" ? "The Origin repository is not accessible to the signed-in Cursor account." : `The repository is not accessible to the connected ${providerName ?? "source control"} account.`;
  }
  if (structured?.error === ErrorDetails_Error.GITHUB_NO_USER_CREDENTIALS) {
    return "Please reconnect GitHub in Cursor.";
  }
  if (details?.additionalInfo?.scmFailureReason === "credentials_missing") {
    return `Please reconnect ${providerName ?? "your source control integration"} in Cursor.`;
  }
  const fromDetails = [details?.detail, details?.title].map((v2) => v2?.trim()).find((v2) => v2);
  if (fromDetails != null && fromDetails.length > 0) return fromDetails;
  const raw = error42.rawMessage.trim();
  if (raw.length === 0 || raw === "Error") return null;
  if (/repositor/i.test(raw) || /please reconnect (github|gitlab|bitbucket|azure)/i.test(raw)) {
    return raw;
  }
  return null;
}
function deriveCloudAgentHandoffLineage(ctx, toolCallId, fallbackLineage) {
  const grokBotAgentId = ctx.get(conversationGroupIdKey);
  const lineage = deriveSandRequestLineage(ctx, toolCallId ?? "", fallbackLineage);
  if (grokBotAgentId == null || grokBotAgentId === "" || lineage == null) {
    return void 0;
  }
  return { grokBotAgentId, ...lineage };
}
function describeDumpedRun(run) {
  if (run.kind === "failed") {
    return `The run's status could not be read (${run.reason}), so treat this as the transcript so far.`;
  }
  if (run.status === "running" || run.status === "creating") {
    return "The run is still in progress, so this is the transcript so far.";
  }
  if (run.status === "finished") {
    return "The run has finished, so this is the complete transcript.";
  }
  return `The run has ended (${run.status}), so this is the transcript as left.`;
}
function summaryLine(summary) {
  const bits = [summary.status];
  if (summary.isArchived) bits.push("archived");
  if (summary.branchName.length > 0) bits.push(summary.branchName);
  if (summary.prUrl.length > 0) bits.push(summary.prUrl);
  const name17 = summary.name.trim().length > 0 ? summary.name.trim() : "(unnamed)";
  return `- ${summary.bcId} \u2014 ${name17} [${bits.join(", ")}] ${summary.url}`;
}
function cloudAgentActionNeedsReview(args, launchedIds, durableWatch) {
  if (ACTION_REVIEW_POLICY[args.action] !== "exempt") {
    return true;
  }
  if (!durableWatch || args.action !== "watch" || args.confirm !== true) {
    return false;
  }
  const agentId = args.agent_id?.trim() ?? "";
  return agentId.length > 0 && !launchedIds.has(agentId);
}
async function runCloudAgentAction(ctx, args, deps) {
  const { api, launchedIds } = deps;
  if (DESTRUCTIVE_ACTIONS.has(args.action) && args.confirm !== true) {
    return `'${args.action}' is destructive. Confirm with the user first (e.g. a SendToUser widget), then call CloudAgent again with confirm: true.`;
  }
  if (OWNER_ONLY_ACTIONS.has(args.action) && args.confirm !== true) {
    const agentId = args.agent_id?.trim() ?? "";
    if (agentId.length > 0 && !launchedIds.has(agentId)) {
      return formatCloudAgentNotOwnedMessage(args.action, agentId);
    }
  }
  let attachments;
  if (args.action === "launch" || args.action === "reply") {
    attachments = await loadCloudAgentAttachments({
      ctx,
      imageUrls: (args.images ?? []).map((image2) => image2.url),
      fileUrls: (args.files ?? []).map((file2) => file2.url),
      agentDir: deps.agentDir,
      readBoxFile: deps.readBoxFile
    });
    if (!attachments.ok) {
      return args.action === "launch" ? `Could not launch the cloud agent: ${attachments.message}` : `Could not send the follow-up: ${attachments.message}`;
    }
  }
  if (deps.reviewAction !== void 0 && cloudAgentActionNeedsReview(args, launchedIds, deps.durableWatch === true)) {
    const reviewAgentId = args.agent_id?.trim() ?? "";
    const { mode: strayMode, ...withoutMode } = args;
    const reviewedArgs = deps.replyModes === true || strayMode === void 0 ? args : withoutMode;
    const review = await deps.reviewAction({
      args: reviewedArgs,
      toolCallId: deps.toolCallId ?? "cloud-agent",
      images: attachments?.ok === true ? attachments.images : [],
      files: attachments?.ok === true ? attachments.files : [],
      sessionManaged: reviewAgentId.length > 0 && launchedIds.has(reviewAgentId),
      ...ctx.signal !== void 0 ? { signal: ctx.signal } : {}
    });
    if (!review.allowed) {
      return review.reason;
    }
  }
  switch (args.action) {
    case "launch": {
      const launchBlockedReason = typeof deps.launchBlockedReason === "function" ? await deps.launchBlockedReason() : deps.launchBlockedReason;
      if (launchBlockedReason != null) {
        return formatCloudAgentLaunchBlockedMessage(launchBlockedReason);
      }
      const prompt = requireField2(args.prompt, "prompt", "launch");
      const environment = args.environment;
      if (environment?.type === "environment" && environment.id == null && environment.name == null) {
        return "A saved-environment launch needs environment.name (the environment's display name) or environment.id (its public id).";
      }
      const isCanvas = deps.isCanvasesEnabled && args.is_canvas === true;
      const isProject = args.project === true;
      if (isProject && isCanvas) {
        throw new SandCloudAgentToolInputError("project cannot be combined with is_canvas.");
      }
      const newRepo = isCanvas || args.new_repo === true;
      if (newRepo && (args.repo != null || args.repo_url != null)) {
        throw new SandCloudAgentToolInputError(
          "repo and repo_url cannot be used when new_repo is true."
        );
      }
      if (newRepo && args.starting_ref != null) {
        throw new SandCloudAgentToolInputError(
          "starting_ref cannot be used when new_repo is true."
        );
      }
      if (newRepo && environment != null && environment.type !== "cloud") {
        throw new SandCloudAgentToolInputError(
          'new_repo requires a Cursor-managed cloud VM; omit environment or use type "cloud".'
        );
      }
      const repoUrl = newRepo || environment?.type === "environment" ? args.repo?.trim() || args.repo_url?.trim() || void 0 : requireField2(args.repo?.trim() || args.repo_url, "repo", "launch");
      const modelError = await validateModelSelection(api, args.model, args.model_params);
      if (modelError != null) {
        return modelError;
      }
      if (attachments?.ok !== true) {
        return "Could not launch the cloud agent: its attachments failed to load.";
      }
      if (ctx.signal.aborted) {
        return CANCELLED_BEFORE_CLOUD_AGENT_CALL;
      }
      const isCardHidden = isCanvas && args.is_show_card !== true;
      let result;
      try {
        result = await api.launch({
          prompt: isCanvas ? composeCanvasScratchLaunchPrompt(prompt) : prompt,
          repoUrl,
          newRepo,
          startingRef: args.starting_ref,
          modelId: args.model,
          modelParams: args.model_params,
          images: attachments.images,
          files: attachments.files,
          title: args.title,
          project: isProject ? true : void 0,
          environment: toCloudAgentEnvironment(args.environment),
          lineage: deriveCloudAgentHandoffLineage(ctx, deps.toolCallId, deps.fallbackLineage)
        });
      } catch (error42) {
        if (error42 instanceof CloudAgentLaunchBlockedError) {
          return formatCloudAgentLaunchBlockedMessage(error42.reason);
        }
        const rejection = backendRejectionMessage(error42, repoUrl);
        if (rejection != null) {
          if (!newRepo && deps.describeScmConnect != null) {
            const truncatedPrompt = prompt.length > 300 ? `${prompt.slice(0, 300)}\u2026` : prompt;
            const note = await deps.describeScmConnect({
              repoUrl,
              rejection,
              blockedAction: `launch a cloud agent on ${repoUrl ?? "the requested repo"} with the prompt: ${JSON.stringify(truncatedPrompt)}`
            });
            if (note != null) {
              return `Could not launch the cloud agent: ${rejection}

${note}`;
            }
          }
          return `Could not launch the cloud agent: ${rejection}`;
        }
        throw error42;
      }
      launchedIds.add(result.bcId);
      if (isCanvas) {
        deps.canvasCursorAgentIds.add(result.bcId);
      }
      if (isCardHidden) {
        deps.hiddenCursorAgentCardIds.add(result.bcId);
      }
      deps.onLaunched?.({
        bcId: result.bcId,
        ...args.model != null && args.model.length > 0 ? { model: args.model } : {}
      });
      if (deps.exchange !== void 0 && !isCardHidden) {
        await recordExchangeOutbound(deps.exchange, api, {
          bcId: result.bcId,
          text: prompt,
          knownName: args.title?.trim(),
          ...exchangeAttachmentsOf(args, attachments)
        });
      }
      void deps.watch?.(result.bcId, {
        afterLaunch: true,
        quietOrigin: ctx.get(sandQuietWorkOriginKey),
        ...isCardHidden ? { hiddenCard: true } : {}
      });
      const followup = deps.watch != null ? `You're revived automatically when it finishes${deps.durableWatch === true ? DURABLE_WATCH_CLAUSE : ""}, so keep working and don't poll it \u2014 use "reply" to send a follow-up, or "get" if you need its status sooner.` : 'Use action "get" with this agent_id to check status, or "reply" to send a follow-up.';
      if (isCardHidden) {
        return `Launched canvas production ${result.bcId}; its cursor-agent card is hidden. You already acknowledged the user before launch, so send no progress message now. When it finishes, deliver the standalone canvas link as the only completion message. ${followup}`;
      }
      let prClause = " It will open a PR when done.";
      if (newRepo) {
        prClause = " It works directly on the new Origin repo's main branch and does not open a PR.";
      } else if (args.environment?.type === "machine") {
        prClause = " It opens a PR when done only if the worker can push to the repo.";
      }
      if (isProject) {
        return `Launched Project ${result.bcId} (coordinator).
${result.url}
It runs on ${cloudAgentRuntimeDescription(args.environment)}. The coordinator plans the work and spawns its own threads. Use "reply" to steer it or "get" for its status. When it finishes, its threads may still be running.${prClause} ${followup}`;
      }
      return `Launched cloud agent ${result.bcId}.
${result.url}
It runs on ${cloudAgentRuntimeDescription(args.environment)}.${prClause} ${followup}`;
    }
    case "list": {
      const scope = args.scope ?? "launched";
      const all = await api.list({
        limit: args.limit,
        includeArchived: args.include_archived
      });
      const filtered = scope === "launched" ? all.filter((summary) => launchedIds.has(summary.bcId)) : all;
      if (filtered.length === 0) {
        return scope === "launched" ? 'No cloud agents launched via this tool yet. Use scope: "all" to list every cloud agent on the account.' : "No cloud agents found.";
      }
      const header = scope === "launched" ? `Cloud agents launched via this tool (${filtered.length}):` : `Cloud agents on the account (${filtered.length}):`;
      return [header, ...filtered.map(summaryLine)].join("\n");
    }
    case "models": {
      const catalog = await api.listModels();
      if (catalog.length === 0) {
        return "No models available.";
      }
      return [
        `Available cloud-agent models (${catalog.length}). Pass 'model' (id) and optional 'model_params' (param id \u2192 value) to launch/reply:`,
        ...modelCatalogLines(catalog)
      ].join("\n");
    }
    case "repositories": {
      if (deps.scmConnectCard !== true) {
        return "The repositories action is not available. Ask the user which repository to use.";
      }
      const search = args.search == null || args.search.length === 0 ? void 0 : args.search;
      const cursor = args.cursor == null || args.cursor.length === 0 ? void 0 : args.cursor;
      let result;
      try {
        result = await api.listRepositories({ search, cursor });
      } catch (error42) {
        if (error42 instanceof SandCloudAgentRepositoriesCursorError) {
          return `Invalid cursor: ${error42.message}`;
        }
        throw error42;
      }
      if (result.connectedProviders.length === 0) {
        if (result.unreachableProviders.length > 0) {
          return `Could not check ${result.unreachableProviders.join(", ")} (listing failed); connection state is unknown, so don't tell the user to connect anything. Retry later.`;
        }
        const header2 = "No source control integration is connected to the user's Cursor account, so no repositories are accessible.";
        const note = deps.describeScmConnect == null ? null : await deps.describeScmConnect({
          repoUrl: void 0,
          knownIntent: "connect",
          blockedAction: "list the repositories the user's source control integrations can access"
        });
        return note == null ? header2 : `${header2}

${note}`;
      }
      const lines2 = result.repos.map(
        (repo) => `- [${repo.provider}] ${repo.ownerAndName}${repo.archived ? " (archived)" : ""} \u2014 ${repo.url}`
      );
      const count = `${result.repos.length}${cursor == null ? "" : " more"}`;
      const header = search == null ? `Repositories accessible via connected source control integrations (${count}; connected: ${result.connectedProviders.join(", ")}):` : `Repositories matching "${search}" (${count}; connected: ${result.connectedProviders.join(", ")}):`;
      const unlistable = /* @__PURE__ */ new Map();
      for (const provider of result.unlistableInstallations) {
        unlistable.set(provider, (unlistable.get(provider) ?? 0) + 1);
      }
      const footers = [
        ...result.nextCursor == null ? [] : [
          `More repositories: call repositories again with cursor "${result.nextCursor}"${search == null ? "" : ` and search "${search}"`}.`
        ],
        ...[...unlistable].map(
          ([provider, n]) => `Could not list ${n} ${provider} installation${n === 1 ? "" : "s"} (access error); the user may need to re-authorize it on ${provider}.`
        ),
        ...result.unreachableProviders.length > 0 ? [
          `Could not check ${result.unreachableProviders.join(", ")} (listing failed) \u2014 unknown, not necessarily disconnected.`
        ] : []
      ];
      return [header, ...lines2, ...footers].join("\n");
    }
    case "get": {
      const agentId = requireField2(args.agent_id, "agent_id", "get");
      const detail = await api.get(agentId);
      if (detail == null) {
        return `No cloud agent found for ${agentId}.`;
      }
      const lines2 = [
        `Cloud agent ${detail.bcId} \u2014 ${detail.name || "(unnamed)"}`,
        `Status: ${detail.status}${detail.isArchived ? " (archived)" : ""}`,
        `URL: ${detail.url}`
      ];
      if (detail.branchName.length > 0) lines2.push(`Branch: ${detail.branchName}`);
      if (detail.prUrl.length > 0) lines2.push(`Pull request: ${detail.prUrl}`);
      if (detail.filesChanged > 0) {
        lines2.push(
          `Changes: +${detail.linesAdded}/-${detail.linesRemoved} across ${detail.filesChanged} file(s).`
        );
      }
      if (detail.error != null) lines2.push(detail.error);
      return lines2.join("\n");
    }
    case "dump": {
      const agentId = requireField2(args.agent_id, "agent_id", "dump");
      const outcome = await dumpCloudAgentTranscript({
        api,
        writeBoxFile: (boxPath, data) => deps.writeBoxFile(ctx, boxPath, data),
        bcId: agentId
      });
      if (outcome == null) {
        return `No cloud agent found for ${agentId}.`;
      }
      const progressNote = describeDumpedRun(outcome.run);
      if (outcome.file == null) {
        return `Cloud agent ${agentId} hasn't produced any transcript output yet. ${progressNote}`;
      }
      return [
        `Wrote ${agentId}'s full transcript to ${outcome.file.path} (${outcome.file.sizeBytes} bytes, ${outcome.lineCount} message lines).`,
        progressNote,
        "Format: JSONL, one JSON message per line \u2014 role, text, reasoning/thinking, tool calls with args, and tool results. Use Shell to grep it or Read to read it.",
        `For just the final report, read the last line: \`tail -n 1 ${outcome.file.path}\` (the final assistant message).`
      ].join("\n");
    }
    case "watch": {
      const agentId = requireField2(args.agent_id, "agent_id", "watch");
      if (deps.watch == null) {
        return `Watching isn't available here. Use action "get" with ${agentId} to check its status.`;
      }
      if (deps.durableWatch !== true) {
        void deps.watch(agentId, { quietOrigin: ctx.get(sandQuietWorkOriginKey) });
        return `Watching ${agentId}. You'll be revived automatically when it finishes \u2014 keep working and don't poll it.`;
      }
      const adopted = args.confirm === true && !launchedIds.has(agentId);
      const adoption = adopted ? ` It is now one of your agents: "reply", "cancel" and "archive" no longer need confirm.` : "";
      if (adopted || launchedIds.has(agentId)) {
        const outcome = await deps.watch(agentId, {
          quietOrigin: ctx.get(sandQuietWorkOriginKey),
          ...adopted ? { adopt: true } : {}
        });
        if (outcome?.failed === true) {
          return `Could not watch ${agentId}: it is not a cloud agent you can read, or the watch could not be registered. Nothing will wake you for it${adopted ? ", and it has not been made one of yours" : ""}. Check the id with "list", or "get" it to see whether you have access.`;
        }
        if (adopted) {
          launchedIds.add(agentId);
        }
        if (outcome?.runInFlight === false) {
          return outcome.finishedRunDelivered === true ? `Watching ${agentId}. Its latest run had already finished, so you are being revived with that result now${DURABLE_WATCH_CLAUSE} \u2014 keep working and don't poll it.${adoption}` : `Watching ${agentId}. It is idle right now: its last run already finished and you are not being woken for that one. You'll be revived automatically when its next run finishes${DURABLE_WATCH_CLAUSE} \u2014 keep working and don't poll it.${adoption}`;
        }
        return `Watching ${agentId}. You'll be revived automatically when it finishes${DURABLE_WATCH_CLAUSE} \u2014 keep working and don't poll it.${adoption}`;
      }
      await deps.watch(agentId, { quietOrigin: ctx.get(sandQuietWorkOriginKey) });
      return `Watching ${agentId}. You'll be revived automatically when it finishes \u2014 keep working and don't poll it. This is a one-time watch on an agent you did not launch; pass confirm: true to keep following it after every later run, once the user has asked you to.`;
    }
    case "unwatch": {
      const agentId = requireField2(args.agent_id, "agent_id", "unwatch");
      if (deps.unwatch == null) {
        return `Unwatching isn't available here: a watch on ${agentId} ends by itself when its run finishes.`;
      }
      await deps.unwatch(agentId);
      return `Stopped watching ${agentId}. You won't be revived when it finishes a run any more; it keeps running, and "get", "dump", "reply", "cancel" and "archive" still work. Call "watch" to follow it again.`;
    }
    case "reply": {
      const agentId = requireField2(args.agent_id, "agent_id", "reply");
      const prompt = requireField2(args.prompt, "prompt", "reply");
      const modelError = await validateModelSelection(api, args.model, args.model_params);
      if (modelError != null) {
        return modelError;
      }
      if (attachments?.ok !== true) {
        return "Could not send the follow-up: its attachments failed to load.";
      }
      const replyModes = deps.replyModes === true;
      const mode = resolveReplyMode(args, replyModes);
      const metrics2 = cloudAgentMetricsScope(ctx, deps);
      const quietOrigin = ctx.get(sandQuietWorkOriginKey);
      const hiddenCard = deps.hiddenCursorAgentCardIds.has(agentId);
      if (mode === "steer" && deps.steer != null) {
        if (args.model != null && args.model.length > 0 || args.model_params != null && Object.keys(args.model_params).length > 0) {
          return 'A steer only adds context to the running turn and cannot change the model. Drop model and model_params, or use mode "queue" or "interrupt" to start a run with them.';
        }
        if (ctx.signal.aborted) {
          return CANCELLED_BEFORE_CLOUD_AGENT_CALL;
        }
        let outcome;
        try {
          outcome = await deps.steer({
            bcId: agentId,
            prompt,
            images: attachments.images,
            files: attachments.files,
            ...quietOrigin === void 0 ? {} : { quietOrigin }
          });
        } catch (error42) {
          const rejection = backendRejectionMessage(error42);
          if (rejection != null) {
            recordCloudAgentReply(metrics2, { mode, outcome: "rejected" });
            return `Could not steer ${agentId}: ${rejection}`;
          }
          throw error42;
        }
        if (outcome.kind === "failed") {
          recordCloudAgentReply(metrics2, { mode, outcome: "rejected" });
          return `Could not steer ${agentId}: ${outcome.reason} Nothing was delivered; retry with mode "queue".`;
        }
        launchedIds.add(agentId);
        const durableClause = deps.durableWatch === true ? DURABLE_WATCH_CLAUSE : "";
        if (outcome.kind === "already_delivered") {
          const revived2 = deps.watch != null ? `You're revived automatically when that run finishes${durableClause}, so keep working and don't poll it.` : 'Use "get" to check status.';
          return `The message already reached ${agentId} on an earlier attempt of this call, into its running turn or as its next run; nothing was sent again. ${revived2}`;
        }
        recordCloudAgentReply(metrics2, {
          mode,
          outcome: outcome.kind === "steered" ? "accepted" : "queued_fallback"
        });
        deps.onFollowupSent?.({ bcId: agentId, interrupt: false, mode });
        if (deps.exchange !== void 0 && !hiddenCard) {
          await recordExchangeOutbound(deps.exchange, api, { bcId: agentId, text: prompt });
        }
        if (outcome.kind === "steered") {
          const revived2 = deps.watch != null ? `You're revived automatically when that run finishes${durableClause}, so keep working and don't poll it.` : 'Use "get" to check status.';
          return `Steered ${agentId}: the message reaches its running turn at its next step, and its work in flight is kept. ${revived2}`;
        }
        if (outcome.runId !== void 0) {
          void deps.watch?.(agentId, {
            afterFollowup: true,
            quietOrigin,
            ...hiddenCard ? { hiddenCard: true } : {}
          });
        }
        const revived = deps.watch != null ? `You're revived automatically when this follow-up finishes${durableClause}, so keep working and don't poll it.` : 'Use "get" to check status.';
        const why = outcome.reason === "idle" ? "it wasn't running, so there was nothing to steer and the message starts its next run" : "its running turn couldn't take the steer (it ended first, or steering isn't available for it), so the message was queued as its next run";
        return `Sent follow-up to ${agentId}${outcome.runId === void 0 ? "" : ` (run ${outcome.runId})`}; ${why}. ${revived}`;
      }
      const interrupt = mode === "interrupt";
      const steerUnavailable = mode === "steer";
      const strayMode = !replyModes && args.mode !== void 0 ? args.mode : void 0;
      let wasRunning = false;
      let knownName;
      if (interrupt) {
        try {
          const detail = await api.get(agentId);
          wasRunning = detail?.status === "running" || detail?.status === "creating";
          knownName = detail?.name;
        } catch (error42) {
          process.stderr.write(
            `sand.cloud_agent.interrupt_status_probe_failed error_class=${errorLogTag(error42)}
`
          );
        }
      }
      if (ctx.signal.aborted) {
        return CANCELLED_BEFORE_CLOUD_AGENT_CALL;
      }
      let result;
      try {
        result = await api.reply({
          bcId: agentId,
          prompt,
          modelId: args.model,
          modelParams: args.model_params,
          images: attachments.images,
          files: attachments.files,
          interrupt
        });
      } catch (error42) {
        const rejection = backendRejectionMessage(error42);
        if (rejection != null) {
          recordCloudAgentReply(metrics2, { mode, outcome: "rejected" });
          return `Could not send the follow-up: ${rejection}`;
        }
        throw error42;
      }
      recordCloudAgentReply(metrics2, {
        mode,
        outcome: steerUnavailable ? "queued_fallback" : "accepted"
      });
      deps.onFollowupSent?.({
        bcId: agentId,
        interrupt,
        model: args.model,
        ...replyModes ? { mode } : {},
        ...result.runId.length > 0 ? { runId: result.runId } : {}
      });
      if (deps.exchange !== void 0 && !hiddenCard) {
        await recordExchangeOutbound(deps.exchange, api, {
          bcId: agentId,
          text: prompt,
          knownName,
          ...exchangeAttachmentsOf(args, attachments)
        });
      }
      void deps.watch?.(agentId, {
        afterFollowup: true,
        quietOrigin,
        ...hiddenCard ? { hiddenCard: true } : {}
      });
      launchedIds.add(agentId);
      const followup = deps.watch != null ? `You're revived automatically when this follow-up finishes${deps.durableWatch === true ? DURABLE_WATCH_CLAUSE : ""}, so keep working and don't poll it.` : 'Use "get" to check status.';
      let sent;
      if (steerUnavailable) {
        sent = `Sent follow-up to ${agentId} (run ${result.runId}); steering isn't available here, so it was queued and starts once the current run finishes`;
      } else if (!interrupt) {
        sent = `Sent follow-up to ${agentId} (run ${result.runId})`;
      } else if (wasRunning) {
        sent = `Interrupted ${agentId}'s active run and delivered the follow-up immediately (run ${result.runId}); it starts processing now`;
      } else {
        sent = `Sent follow-up to ${agentId} (run ${result.runId}); it wasn't running, so there was nothing to interrupt and it starts a fresh run`;
      }
      const strayModeNote = strayMode === void 0 ? "" : ` Note: reply modes aren't supported on this harness, so mode "${strayMode}" was ignored and the message was ${interrupt ? "delivered as an interrupting follow-up" : "sent as a queued follow-up"}.`;
      return `${sent}. ${followup}${strayModeNote}`;
    }
    case "rename": {
      const agentId = requireField2(args.agent_id, "agent_id", "rename");
      const title = requireField2(args.title, "title", "rename");
      try {
        await api.rename(agentId, title);
      } catch (error42) {
        const rejection = backendRejectionMessage(error42);
        if (rejection != null) {
          return `Could not rename the cloud agent: ${rejection}`;
        }
        throw error42;
      }
      return `Renamed ${agentId} to "${title}". The new title shows everywhere the agent appears (cursor.com, the IDE sidebar, mobile).`;
    }
    case "cancel": {
      const agentId = requireField2(args.agent_id, "agent_id", "cancel");
      await api.cancel(agentId);
      return `Requested cancellation of the active run for ${agentId}.`;
    }
    case "archive":
    case "unarchive": {
      const agentId = requireField2(args.agent_id, "agent_id", args.action);
      await api.setArchived(agentId, args.action === "archive");
      if (args.action === "archive") {
        await deps.unwatch?.(agentId);
        return `Archived ${agentId}.${deps.unwatch == null ? "" : " Its watch has ended; you won't be revived by it again unless you unarchive and watch it."}`;
      }
      return `Unarchived ${agentId}.`;
    }
    case "delete": {
      const agentId = requireField2(args.agent_id, "agent_id", "delete");
      await api.delete(agentId);
      launchedIds.delete(agentId);
      return `Permanently deleted ${agentId}.`;
    }
    case "list_artifacts": {
      const agentId = requireField2(args.agent_id, "agent_id", "list_artifacts");
      const artifacts = await api.listArtifacts(agentId);
      if (artifacts.length === 0) {
        return `No artifacts for ${agentId}.`;
      }
      return [
        `Artifacts for ${agentId} (${artifacts.length}):`,
        ...artifacts.map((a) => `- ${a.path} (${a.sizeBytes} bytes)`),
        deps.artifactsEnabled ? `These paths are on the cloud agent's VM, not your box. A watched run's completion copies the artifacts its final report references to ${cloudAgentArtifactsBoxDir(agentId)}/; for anything else, use the artifact URL from the run's PR body.` : `These paths are on the cloud agent's VM, not your box. To bring one back, use the artifact URL from the run's PR body.`
      ].join("\n");
    }
  }
}
var SCM_CONNECT_CARD_CLAUSE = " If the launch is rejected because no (or the wrong) source control integration is connected, or it can't see the repo, nothing is shown to the user; the result names the request_scm_connect call that asks them.";
var CANVAS_LAUNCH_CLAUSE = ", is_canvas (the deliverable is a Cursor canvas; implies new_repo), is_show_card (surface the cursor-agent card a canvas launch hides)";
var REPOSITORIES_ACTION_LINE = "- repositories: list the repositories the user's connected source control integrations (GitHub, GitLab, Bitbucket, Azure DevOps) can access, 100 per call, with an optional 'search' name filter. A 'More repositories' footer carries a cursor; pass it back (with the same search) for the next page. Use this to resolve a bare repo name the user gave you, or to see what's launchable before picking a repo.";
var CLOUD_AGENT_ARTIFACT_CLAUSES = {
  launch: {
    on: " plus the artifacts its final report references (auto-copied to your box), so you can inspect and attach them without calling dump.",
    off: ", so you can inspect it with Shell or Read without calling dump."
  },
  listArtifacts: {
    on: " A watched run's completion auto-copies the artifacts its final report references to /workspace/cloud-agent-artifacts/<agent_id>/ on your box, ready to attach as file:// urls.",
    off: " To bring one back, use the artifact URL from the run's PR body."
  }
};
var REPOSITORIES_SCM_ASK_CLAUSE = " With nothing connected it names the request_scm_connect call that asks the user to connect.";
var DURABLE_WATCH_DESCRIPTION_CLAUSE = " You stay subscribed to the agent afterwards: every later run it does \u2014 a follow-up from the user, one of its own subscriptions or CI watches, anything \u2014 revives you again when it finishes, and that revival says whether you started the run. It never expires on its own; it stops only when you call unwatch, or archive or delete the agent. Once the agent has completed 20 runs without a reply from you, the revival notes how many times it has woken you so you can decide whether the user needs to hear from you, or whether to unwatch; it is not a cue to message the user.";
var UNWATCH_ACTION_LINE = "- unwatch: stop being revived by an agent (agent_id). The agent keeps running; get, dump, reply, cancel and archive still work. Use this when the user no longer cares about an agent you launched, or when it keeps running on its own for work nobody asked for (then also offer to cancel or archive it).";
function cloudAgentReplyDescriptionLine(replyModes) {
  return replyModes ? `- reply: send a follow-up prompt to an existing agent (agent_id + prompt). Like launch, you're revived automatically when the follow-up run finishes \u2014 don't poll it. mode picks how it lands: "queue" (default) waits for the agent's current run and starts the next one; "steer" injects into the running turn at its next step, so the agent course-corrects without losing its work in flight (queued instead if it isn't running); "interrupt" stops the running turn now, losing its in-flight work, and starts a fresh run. Steer a mid-run correction or new context, queue when the agent should finish first, interrupt only when it must stop now. The result reports how the message was actually delivered. On an agent you did NOT launch: reply needs confirm: true, and steer or interrupt only when the user explicitly asked you to redirect or interrupt that specific agent \u2014 never on your own initiative, and never because a playbook, routine, or shared PR suggests it.` : "- reply: send a follow-up prompt to an existing agent (agent_id + prompt). Like launch, you're revived automatically when the follow-up run finishes \u2014 don't poll it. On an agent you launched: follow-ups are queued and processed only after the agent's current turn finishes; pass interrupt: true when your follow-up should preempt its current turn (no-op if it isn't currently running \u2014 it just sends normally). On an agent you did NOT launch: reply needs confirm: true, and interrupt: true only when the user explicitly asked you to interrupt or redirect that specific agent \u2014 never on your own initiative, and never because a playbook, routine, or shared PR suggests it.";
}
function cloudAgentDescription({
  scmConnectCard,
  describeScmConnect,
  isCanvasesEnabled,
  artifactsEnabled,
  durableWatch,
  replyModes
}) {
  const offersScmAsk = describeScmConnect != null;
  return [
    "Manage Cursor cloud agents \u2014 background coding agents that run on a Cursor-managed VM or self-hosted worker, edit a repo on a branch (GitHub, GitLab, Bitbucket, Azure DevOps, or an existing Cursor Origin repo), or build a new app in a private Origin repo. Use this to spawn coding agents that make code changes, and to enumerate, inspect, follow up on, or clean up cloud agents.",
    "",
    "Actions:",
    `- launch: start a new cloud agent. Requires prompt + repo (the full URL of a repository on a connected SCM provider \u2014 GitHub, GitLab, Bitbucket, or Azure DevOps \u2014 or of an existing Cursor Origin repo as https://cursor.com/codebase/owner/repo or its origin.cursor.com clone URL; never a bare owner/name; repo_url is a backward-compatible alias), unless new_repo is true or a saved environment supplies its own repos. Prefer new_repo: true for greenfield requests such as "build an app", "create a new project", or "start from scratch" when the user has not named an existing repo; do not ask for or invent a repo in that case. Optional starting_ref, model, model_params, title (used verbatim as the agent's title instead of the auto-generated prompt summary)` + (isCanvasesEnabled ? CANVAS_LAUNCH_CLAUSE : "") + ", project (a Project coordinator instead of a plain agent, only when the user explicitly asks for a project, see Projects below), and environment (where it runs \u2014 see Environment below). Returns the agent id and its cursor.com URL." + (offersScmAsk ? SCM_CONNECT_CARD_CLAUSE : "") + " You're revived automatically when the run finishes \u2014 don't poll it \u2014 and the completion message includes the path to its full transcript (auto-dumped to a file on your box)" + (artifactsEnabled ? CLOUD_AGENT_ARTIFACT_CLAUSES.launch.on : CLOUD_AGENT_ARTIFACT_CLAUSES.launch.off) + (durableWatch === true ? DURABLE_WATCH_DESCRIPTION_CLAUSE : ""),
    '- list: enumerate cloud agents. scope defaults to "launched" (the agents you launched, or the user handed to you, this session); pass scope: "all" to see every cloud agent on the account.',
    "- models: list the model ids you can launch with and, per model, the params each accepts with allowed values. Use only to resolve a model or settings the user explicitly requested; do not browse the catalog to choose a model yourself.",
    ...scmConnectCard === true ? [REPOSITORIES_ACTION_LINE + (offersScmAsk ? REPOSITORIES_SCM_ASK_CLAUSE : "")] : [],
    "- get: status of one agent (agent_id) \u2014 state, branch, PR, change stats. For a one-off status check; for being notified on completion, use watch instead of polling get. To read the actual code changes, use the branch from here over the provider's remote API, never a local clone: for GitHub, `gh pr diff` for runs with a PR or `gh api` against the branch for runs without one; for GitLab, `glab mr diff` or the GitLab API; for Bitbucket or Azure DevOps, their REST APIs.",
    "- dump: write the agent's FULL conversation transcript (agent_id) to a file on your box (under cloud-agent-transcripts/ in your working directory \u2014 the result gives the exact path), then use Shell to grep it or Read to read it. Returns the path + size, not the contents. JSONL, one message per line with full detail (text, reasoning, tool calls with args, tool results). The final assistant report is the last line \u2014 `tail -n 1` it for just the final output. Works while running (partial) and when finished. Use this for mid-run inspection or to re-dump; a finished run you launched/watched is auto-dumped to the same path already (its completion message has the path). Use this instead of sending a 'reply' that asks the agent to summarize.",
    "- watch: register to be revived automatically when an existing agent (agent_id) finishes \u2014 use this for agents you didn't launch this session (launch already watches its own). You keep working and are revived with the result; never poll get in a loop. Observe-only: it does not make the agent yours" + (durableWatch === true ? ", and fires once. With confirm: true (only when the user asked you to follow or take over that specific agent) it adopts the agent: you are revived after every later run until you unwatch, and reply/cancel/archive stop needing confirm." : "."),
    ...durableWatch === true ? [UNWATCH_ACTION_LINE] : [],
    cloudAgentReplyDescriptionLine(replyModes === true),
    "- rename: retitle an existing agent (agent_id + title). The title is used verbatim and shows on cursor.com, in the IDE sidebar, and on mobile. On an agent you did not launch, rename needs confirm: true.",
    "- cancel / archive / unarchive: manage lifecycle (agent_id). No confirmation is needed for agents you launched; cancel and archive on an agent you did not launch need confirm: true (unarchive never does). Archiving keeps the agent's pull request open.",
    "- delete: permanently delete an agent. Confirm with the user (e.g. a SendToUser widget) first, then call with confirm: true.",
    "- list_artifacts: list files the agent saved under its workspace artifacts (paths on its VM, not yours)." + (artifactsEnabled ? CLOUD_AGENT_ARTIFACT_CLAUSES.listArtifacts.on : CLOUD_AGENT_ARTIFACT_CLAUSES.listArtifacts.off),
    "",
    `Projects. A Project is a coordinator cloud agent. Its threads are regular cloud agents attached to it. The coordinator plans the work, spawns and directs its own threads on the repo, and keeps notes in its Agent Store. Start one with launch and project: true. The title names it. Do this only when the user explicitly asks for a project, for example "start a project", "spin up a project agent", or "make this a project". A plain cloud agent is the default for every coding task, including large ones. Never pick a project on your own, and never because the task looks big. Steer it with reply. Cancel, archive, rename, dump, and get work on the coordinator as on any agent. You are revived when the coordinator's own run finishes. Its threads may still be running then.`,
    "",
    "New Origin projects: keep the minted Origin repo as the source of truth. A full Vercel deployment requires an Origin namespace and a direct Vercel\u2194Origin connection; guide the user through Origin setup at https://cursor.com/codebase/get-started and connecting Vercel to Origin. Never mirror the repo to GitHub solely to make Vercel work or deploy Vercel from that mirror.",
    "",
    "Environment (worker pools / private workers): set where the agent runs with the environment param on launch.",
    '- Omit environment, or pass {"type":"cloud"}, for a Cursor-managed Linux VM (the default).',
    '- Pass {"type":"pool"} to run on any eligible self-hosted pool for the repo ("shared pool" / self-hosted pool).',
    `- Pass {"type":"pool","name":"<pool-name>"} for a specific named pool the user or task names (for example, "mobile-ios-mac"). Use this when the work needs Mac/iOS simulators, a team's shared workers, or any runtime the default cloud VM cannot provide.`,
    '- Pass {"type":"machine","name":"<worker-name>"} for one specific private worker ("My Machine").',
    `- Pass {"type":"environment","name":"<environment-name>"} (or "id" with its public id) to launch into a saved Cloud Agents environment from the user's cursor.com dashboard \u2014 the run gets that environment's custom env vars, egress rules, install commands, and (for multi-repo environments) all configured repos, on a Cursor VM. repo (or repo_url) is then optional and defaults to the environment's primary repo; new_repo is not compatible with a saved environment. Use this when the user names a saved environment or the task needs specific environment variables or egress settings.`,
    "- For pool and machine, a single active team is selected automatically; set team_id only when the user belongs to multiple active teams.",
    "- If the user asks to launch on a pool / self-hosted workers / a named pool / a saved environment, pass environment on that same launch call.",
    "",
    "Model configuration: only pass model (id) and model_params (structured params like thinking/effort/context/fast) when the user explicitly requests that model or those settings for this cloud agent. model_params requires model because parameter schemas are model-specific. Never select a model based on the task, catalog order, availability, or your own preference. For a user-requested override, discover valid ids and per-model params/values with the 'models' action first; params are validated against the catalog. Otherwise omit both: a launch uses the user's saved/team/global cloud-agent default, while a reply keeps the cloud agent's current model. Never encode params into the model id string \u2014 keep model a clean id and put settings in model_params.",
    "",
    'Attaching images: on launch and reply, pass images: [{"url":"file:///workspace/shot.png"}] to show the cloud agent a screenshot, mock, chart, or repro. The agent actually sees them, so never paste an image as a markdown ![](...) in the prompt. Use absolute file:// URLs to files in your box \u2014 a path under /workspace (file:///workspace/\u2026) or one in your own attachments/assets folder (file:///home/box/agent-data/agents/<your id>/attachments/\u2026, where inbound and generated images already live); https:// is rejected, so download such an image to a file first. There is no caption field: say what each image shows in the prompt text.',
    `Attaching files: on launch and reply, pass files: [{"url":"file:///workspace/spec.pdf"}] to hand the cloud agent a document, dataset, log, config, archive, or recording it should work from \u2014 the same file:// URL rules as images. Each file is saved into the agent's workspace under uploads/ and its path is listed in the prompt it receives, so it reads them with its own tools; never paste a long file's contents into the prompt when you can attach it. Documents (${CLOUD_AGENT_DOCUMENT_EXTENSIONS_HINT}) and any text file (source, scripts, patches, configs \u2014 recognized by content) up to ${CLOUD_AGENT_DOCUMENT_LIMIT_LABEL} each, videos (${CLOUD_AGENT_VIDEO_EXTENSIONS_HINT}) up to ${CLOUD_AGENT_VIDEO_LIMIT_LABEL} each, and everything attached to one call (images included) up to ${CLOUD_AGENT_ATTACHMENTS_TOTAL_LIMIT_LABEL} together \u2014 split larger sets between the launch and a follow-up. Other binary files are refused, and so are .env-style files, which usually hold secrets and would land in the agent's workspace. An image in files is delivered as a file to keep rather than shown. Say what each file is for in the prompt text.`,
    "",
    "Cloud agents run remotely and do not edit the user's local files \u2014 existing-repo results come back as a branch/PR, while new_repo works directly on the new Origin repo's main branch. Authentication is handled for the signed-in user; never ask for an API key."
  ].join("\n");
}
function repoShortName(repoUrl) {
  if (repoUrl == null || repoUrl.length === 0) return void 0;
  try {
    const segments = new URL(repoUrl).pathname.split("/").filter((segment) => segment.length > 0);
    const last = segments.at(-1);
    if (last == null) return void 0;
    return last.endsWith(".git") ? last.slice(0, -".git".length) : last;
  } catch {
    return void 0;
  }
}
function createCloudAgentTool(deps) {
  return defineCommunicateTool(deps, {
    id: "CLOUD_AGENT",
    name: "CloudAgent",
    description: cloudAgentDescription(deps),
    parameters: cloudAgentParametersFor(deps),
    describeActivity: (args) => {
      const repo = repoShortName(args.repo ?? args.repo_url);
      return repo != null ? { detail: repo } : void 0;
    },
    execute: async (ctx, args, toolDeps) => runCloudAgentAction(ctx, args, toolDeps)
  });
}

