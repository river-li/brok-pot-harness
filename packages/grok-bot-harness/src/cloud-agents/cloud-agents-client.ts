var MAX_CLOUD_AGENT_FILES = 300;
var SAVED_ENVIRONMENT_LIST_LIMIT = 500;
var MAX_LISTED_SAVED_ENVIRONMENTS = 25;
var REPOSITORIES_PAGE_LIMIT = 100;
var REPOSITORIES_MAX_PAGE_FETCHES_PER_CALL = 3;
var REPOSITORIES_BACKEND_PAGE_SIZE = 100;
function isDashboardConnectableProvider(value) {
  return DASHBOARD_CONNECTABLE_PROVIDERS.some((provider) => provider === value);
}
var scmProviderWire = external_exports.string().refine(isDashboardConnectableProvider);
var repositoriesCursorWire = external_exports.object({
  v: external_exports.literal(2),
  s: external_exports.string().nullable(),
  c: external_exports.array(scmProviderWire),
  u: external_exports.array(scmProviderWire),
  d: external_exports.array(scmProviderWire).default([]),
  units: external_exports.array(
    external_exports.tuple([scmProviderWire, external_exports.string().regex(/^\d+$/), external_exports.union([external_exports.literal(0), external_exports.literal(1)])])
  ),
  o: external_exports.number().int().nonnegative()
});
function encodeRepositoriesCursor(state) {
  const wire = {
    v: 2,
    s: state.search ?? null,
    c: [...state.connectedProviders],
    u: [...state.unreachableProviders],
    d: [...state.accessDenied],
    units: state.units.map((unit) => [
      unit.provider,
      unit.installationId.toString(),
      unit.inlineComplete ? 1 : 0
    ]),
    o: state.offset
  };
  return Buffer.from(JSON.stringify(wire)).toString("base64url");
}
function decodeRepositoriesCursor(args) {
  if (args.cursor == null || args.cursor.length === 0) return null;
  let wire;
  try {
    wire = repositoriesCursorWire.parse(
      JSON.parse(Buffer.from(args.cursor, "base64url").toString("utf8"))
    );
  } catch {
    throw new SandCloudAgentRepositoriesCursorError("The cursor is not one this tool issued.");
  }
  const cursorSearch = wire.s ?? void 0;
  if (cursorSearch !== args.search) {
    throw new SandCloudAgentRepositoriesCursorError(
      cursorSearch == null ? "The cursor was issued for an unfiltered listing; drop 'search' or start over without a cursor." : `The cursor was issued for search "${cursorSearch}"; pass the same search or start over without a cursor.`
    );
  }
  return {
    search: cursorSearch,
    connectedProviders: wire.c,
    unreachableProviders: wire.u,
    units: wire.units.map(([provider, installationId, inlineComplete]) => ({
      provider,
      installationId: BigInt(installationId),
      inlineComplete: inlineComplete === 1
    })),
    offset: wire.o,
    accessDenied: wire.d
  };
}
function mapRunStatus(status) {
  switch (status) {
    case BackgroundComposerStatus.CREATING:
      return "creating";
    case BackgroundComposerStatus.RUNNING:
      return "running";
    case BackgroundComposerStatus.FINISHED:
      return "finished";
    case BackgroundComposerStatus.ERROR:
      return "error";
    case BackgroundComposerStatus.EXPIRED:
      return "expired";
    default:
      return "unknown";
  }
}
function resolvePrUrl(detailed) {
  const composerPrUrl = detailed?.composer?.prUrl;
  if (composerPrUrl && composerPrUrl.length > 0) {
    return composerPrUrl;
  }
  return detailed?.prs?.find((pr2) => pr2.prUrl && pr2.prUrl.length > 0)?.prUrl ?? "";
}
function resolveBranchName(detailed) {
  const composerBranch = detailed?.composer?.branchName;
  if (composerBranch && composerBranch.length > 0) {
    return composerBranch;
  }
  return detailed?.prs?.find((pr2) => pr2.branchName && pr2.branchName.length > 0)?.branchName ?? "";
}
function resolveProjectMembership(composer) {
  return composer?.projectMetadata == null ? void 0 : { role: "root" };
}
function mapProtoPrStatus(status) {
  switch (status) {
    case PRStatus.PR_STATUS_OPEN:
      return "open";
    case PRStatus.PR_STATUS_DRAFT:
      return "draft";
    case PRStatus.PR_STATUS_MERGED:
      return "merged";
    case PRStatus.PR_STATUS_CLOSED:
      return "closed";
    default:
      return null;
  }
}
function exchangeConversationReads(bcId) {
  return [
    new GetBackgroundComposerConversationRequest({ bcId, exchangeOnly: true }),
    new GetBackgroundComposerConversationRequest({ bcId })
  ];
}
function refusesExchangeProjection(error42) {
  return error42 instanceof ConnectError && (error42.code === Code.Unimplemented || error42.code === Code.InvalidArgument);
}
function classifyReadFailure(error42) {
  if (!(error42 instanceof ConnectError)) {
    return "internal";
  }
  switch (error42.code) {
    case Code.Unavailable:
    case Code.DeadlineExceeded:
    case Code.Canceled:
    case Code.Aborted:
      return "unreachable";
    case Code.ResourceExhausted:
      return "throttled";
    case Code.Unauthenticated:
      return "unauthenticated";
    case Code.PermissionDenied:
    case Code.NotFound:
    case Code.Unimplemented:
    case Code.InvalidArgument:
    case Code.FailedPrecondition:
    case Code.AlreadyExists:
    case Code.OutOfRange:
      return "rejected";
    default:
      return "internal";
  }
}
function mapMergeStatusToPrState(status) {
  if (status.isMerged) {
    return "merged";
  }
  if (status.isClosed) {
    return "closed";
  }
  if (status.isDraft) {
    return "draft";
  }
  if (status.state === "open") {
    return "open";
  }
  return null;
}
var MERGEABLE_STATES = /* @__PURE__ */ new Set([
  "behind",
  "blocked",
  "clean",
  "dirty",
  "draft",
  "has_hooks",
  "unknown",
  "unstable"
]);
var GITLAB_MERGEABLE_STATES = {
  cannot_be_merged: "dirty",
  unchecked: "unknown",
  checking: "unknown",
  can_be_merged: "clean"
};
function isMergeableState(value) {
  return MERGEABLE_STATES.has(value);
}
function parseMergeableState(raw) {
  const normalized = raw.trim().toLowerCase();
  const remapped = GITLAB_MERGEABLE_STATES[normalized];
  if (remapped != null) {
    return remapped;
  }
  return isMergeableState(normalized) ? normalized : "unknown";
}
function positiveMs(value) {
  return value != null && Number.isFinite(value) && value > 0 ? Math.round(value) : null;
}
function boundedSingleLine(value, limit) {
  const normalized = value.replace(/\s+/g, " ").trim();
  const codePoints = [...normalized];
  return codePoints.length <= limit ? normalized : `${codePoints.slice(0, limit - 1).join("")}\u2026`;
}
function userMessage(action) {
  return action?.action.case === "userMessageAction" ? action.action.value.userMessage : void 0;
}
function coordinatorProjectName(detailed) {
  return boundedSingleLine(
    detailed.composer?.name || userMessage(detailed.originalConversationAction)?.projectDetails?.name || "Untitled Cursor Project",
    160
  );
}
function activityProject(detailed, projectNamesById) {
  const composer = detailed.composer;
  if (composer == null) return void 0;
  const details = userMessage(detailed.originalConversationAction)?.projectDetails;
  if (composer.projectMetadata != null) {
    return {
      name: coordinatorProjectName(detailed),
      relationship: "coordinator"
    };
  }
  if (details?.subagent == null && details?.sideChat == null && !composer.managerAgentId) {
    return void 0;
  }
  const relationship = details?.sideChat != null ? "side_chat" : "thread";
  const name17 = boundedSingleLine(
    projectNamesById.get(composer.managerAgentId ?? "") || details?.name || "",
    160
  );
  return name17 === "" ? void 0 : { name: name17, relationship };
}
function toRecentActivity(detailed, projectNamesById) {
  const composer = detailed.composer;
  if (composer == null) return null;
  const occurredAtMs = positiveMs(composer.lastMessageActivityAtMs) ?? positiveMs(composer.updatedAtMs) ?? positiveMs(composer.createdAtMs);
  if (occurredAtMs === null) return null;
  return {
    title: boundedSingleLine(composer.name || "Untitled Cursor conversation", 160),
    excerpt: boundedSingleLine(
      detailed.prompt?.text || userMessage(detailed.originalConversationAction)?.text || detailed.summary || "",
      240
    ),
    occurredAtMs,
    project: activityProject(detailed, projectNamesById)
  };
}
function resolvePr(detailed) {
  const url2 = resolvePrUrl(detailed);
  const primaryRow = url2.length > 0 ? detailed?.prs?.find((pr2) => pr2.prUrl === url2) : detailed?.prs?.find((pr2) => pr2.pullNumber != null || mapProtoPrStatus(pr2.prStatus) != null);
  const state = mapProtoPrStatus(primaryRow?.prStatus) ?? mapProtoPrStatus(detailed?.composer?.prStatus) ?? (url2.length > 0 || primaryRow != null ? "unknown" : "none");
  return { state, number: primaryRow?.pullNumber ?? null };
}
function normalizeDiffPath(rawPath) {
  const trimmed = rawPath.trim();
  return trimmed === "/dev/null" ? "" : trimmed;
}
function toFileChange(diff) {
  const from2 = normalizeDiffPath(diff.from);
  const to3 = normalizeDiffPath(diff.to);
  const path31 = to3 !== "" ? to3 : from2;
  if (path31 === "") {
    return null;
  }
  return { path: path31, added: diff.added, removed: diff.removed };
}
function cloudAgentUrl(bcId) {
  return `https://cursor.com/agents/${bcId}`;
}
function buildTranscriptJsonl(conversation) {
  const trace2 = convertConversationMessagesToTrace(conversation, HistoryVisibilityMode.NO_PREAMBLE);
  const lines2 = trace2.map(
    (message) => (
      /*
       * Protobuf 64-bit fields can contain BigInt. JSON.stringify requires custom serialization for BigInt.
       * https://github.com/bufbuild/protobuf-es/blob/v1.10.1/docs/generated_code.md#64-bit-integral-types
       * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/BigInt_not_serializable
       */
      JSON.stringify(
        message,
        (_key, value) => typeof value === "bigint" ? value.toString() : value
      )
    )
  );
  return {
    jsonl: lines2.length > 0 ? `${lines2.join("\n")}
` : "",
    lineCount: lines2.length
  };
}
function toCloudAgentSummary(composer) {
  return {
    bcId: composer.bcId,
    name: composer.name,
    status: mapRunStatus(composer.status),
    branchName: composer.branchName,
    prUrl: composer.prUrl,
    isArchived: composer.isArchived,
    createdAtMs: composer.createdAtMs,
    url: cloudAgentUrl(composer.bcId)
  };
}
function resolveSandLimitError(detailed) {
  const details = detailed?.permanentError?.details;
  if (details?.additionalInfo?.rateLimitReason !== "sand_included_limit") {
    return null;
  }
  return [details.title, details.detail].flatMap((value) => {
    const trimmed = value.trim();
    return trimmed.length > 0 ? [trimmed] : [];
  }).join("\n");
}
function formatDiffStats(detailed) {
  const composer = detailed?.composer;
  if (composer == null) {
    return void 0;
  }
  const parts = [];
  if (composer.commitCount != null && composer.commitCount > 0) {
    parts.push(`${composer.commitCount} commit${composer.commitCount === 1 ? "" : "s"}`);
  }
  if (composer.filesChanged != null && composer.filesChanged > 0) {
    const added = composer.linesAdded ?? 0;
    const removed = composer.linesRemoved ?? 0;
    parts.push(
      `+${added}/-${removed} across ${composer.filesChanged} file${composer.filesChanged === 1 ? "" : "s"}`
    );
  }
  return parts.length > 0 ? `Changes: ${parts.join(", ")}.` : void 0;
}
async function fetchCloudAgentReport(backend, bcId, options2) {
  try {
    return await readCloudAgentReport(backend, bcId, options2);
  } catch (error42) {
    process.stderr.write(
      `sand.cloud_agent.report_read_failed bc_id=${bcId} error_class=${error42 instanceof ConnectError ? Code[error42.code] : "unknown"}
`
    );
    return void 0;
  }
}
function isNoReportError(error42) {
  return error42 instanceof ConnectError && (error42.code === Code.InvalidArgument || error42.code === Code.FailedPrecondition);
}
async function readCloudAgentReport(backend, bcId, options2) {
  try {
    const response = await backend.getTurnSummaryBackgroundComposer(
      new GetTurnSummaryBackgroundComposerRequest({ bcId }),
      options2 === void 0 ? void 0 : { timeoutMs: options2.timeoutMs }
    );
    const report = response.summary.trim();
    return report.length > 0 ? report : void 0;
  } catch (error42) {
    if (isNoReportError(error42)) return void 0;
    throw error42;
  }
}
var MAX_QUOTED_CLOUD_AGENT_REPORT_CHARS = 12e3;
function quoteReport(report) {
  if (report.length <= MAX_QUOTED_CLOUD_AGENT_REPORT_CHARS) return report;
  return `${report.slice(0, MAX_QUOTED_CLOUD_AGENT_REPORT_CHARS)}
[... report truncated after ${MAX_QUOTED_CLOUD_AGENT_REPORT_CHARS} characters; the full message is in the run's conversation.]`;
}
function buildWatchResult(bcId, status, detailed, report) {
  const composer = detailed?.composer;
  const summary = report?.trim();
  const name17 = composer?.name && composer.name.length > 0 ? { name: composer.name } : {};
  const prUrl = (composer?.prUrl && composer.prUrl.length > 0 ? composer.prUrl : void 0) ?? detailed?.prs?.find((pr2) => pr2.prUrl && pr2.prUrl.length > 0)?.prUrl;
  if (status === BackgroundComposerStatus.ERROR || status === BackgroundComposerStatus.EXPIRED) {
    const reason = status === BackgroundComposerStatus.EXPIRED ? "expired" : "errored";
    const lines3 = [`The Cursor agent (${bcId}) ${reason} before finishing.`];
    const limitError = resolveSandLimitError(detailed);
    if (limitError != null) {
      lines3.push("", limitError);
    }
    if (summary) {
      lines3.push("", "Last message from the Cursor agent:", quoteReport(summary));
    }
    return { status: "error", text: lines3.join("\n"), ...summary ? { summary } : {}, ...name17 };
  }
  const lines2 = ["The Cursor agent finished."];
  const branch = composer?.branchName;
  if (branch) {
    lines2.push(`Branch: ${branch}`);
  }
  if (prUrl) {
    lines2.push(`Pull request: ${prUrl}`);
  } else {
    lines2.push(
      "No pull request link is available yet (the agent may have made no changes, or the PR is still being created)."
    );
  }
  const stats = formatDiffStats(detailed);
  if (stats) {
    lines2.push(stats);
  }
  if (summary) {
    lines2.push("", "Summary from the Cursor agent:", quoteReport(summary));
  }
  return { status: "completed", text: lines2.join("\n"), ...summary ? { summary } : {}, ...name17 };
}
function markWatchResultAborted(bcId, result) {
  if (result.status === "error") {
    return result;
  }
  const [, ...detail] = result.text.split("\n");
  return {
    ...result,
    status: "error",
    text: [`The Cursor agent (${bcId}) was stopped before finishing.`, ...detail].join("\n")
  };
}
function terminalStatusToProto(status) {
  switch (status) {
    case "finished":
      return BackgroundComposerStatus.FINISHED;
    case "error":
      return BackgroundComposerStatus.ERROR;
    case "expired":
      return BackgroundComposerStatus.EXPIRED;
  }
}
function availableEnvironmentsNote(environments) {
  if (environments.length === 0) {
    return " This account has no saved environments; create one from the Cloud Agents dashboard on cursor.com.";
  }
  const listed = environments.slice(0, MAX_LISTED_SAVED_ENVIRONMENTS).map((environment) => {
    const name17 = environment.name.trim();
    return name17.length > 0 ? `${name17} (${environment.publicId})` : environment.publicId;
  }).join(", ");
  const hidden = environments.length - MAX_LISTED_SAVED_ENVIRONMENTS;
  const overflow = hidden > 0 ? ` (+${hidden} more; set environment.id to launch one that isn't listed)` : "";
  return ` Available: ${listed}${overflow}.`;
}
async function resolveSavedEnvironment(client, selector) {
  const publicId = selector.publicId?.trim();
  const name17 = selector.name?.trim();
  if (publicId) {
    const response = await client.getEnvironment(new GetEnvironmentRequest({ publicId }));
    const match2 = response.environment;
    if (match2 != null) {
      return match2;
    }
    throw new SandCloudAgentLaunchError(
      `No saved environment with id '${publicId}'.${availableEnvironmentsNote(
        await listSavedEnvironments(client)
      )}`
    );
  }
  if (!name17) {
    throw new SandCloudAgentLaunchError(
      "A saved-environment launch requires the environment's public id or name."
    );
  }
  const environments = await listSavedEnvironments(client);
  const loweredName = name17.toLowerCase();
  const matches = environments.filter(
    (environment) => environment.name.trim().toLowerCase() === loweredName
  );
  if (matches.length === 1) {
    return matches[0];
  }
  if (matches.length === 0) {
    throw new SandCloudAgentLaunchError(
      `No saved environment named '${name17}'.${availableEnvironmentsNote(environments)}`
    );
  }
  const ids = matches.map((environment) => environment.publicId).join(", ");
  throw new SandCloudAgentLaunchError(
    `Multiple saved environments are named '${name17}'. Set environment.id to one of: ${ids}.`
  );
}
async function listSavedEnvironments(client) {
  const response = await client.listEnvironments(
    new ListEnvironmentsRequest({
      includeRepositoryScopeEnvironments: true,
      limit: SAVED_ENVIRONMENT_LIST_LIMIT
    })
  );
  return response.environments;
}
async function resolvePrivateWorkerTeamId(deps, environment) {
  if (environment == null || environment.type === "cloud" || environment.type === "environment") {
    return void 0;
  }
  if (environment.teamId != null) {
    return environment.teamId;
  }
  const response = await deps.getDashboardClient().getTeams(new GetTeamsRequest({ activeOnly: true }));
  const teams = response.teams.filter((team) => team.id > 0 && team.isDirectMember);
  if (teams.length === 1) {
    return teams[0].id;
  }
  if (teams.length === 0) {
    if (environment.type === "pool") {
      throw new SandCloudAgentLaunchError(
        "A self-hosted pool requires an active team, but this account has none."
      );
    }
    return void 0;
  }
  const options2 = teams.map((team) => `${team.name} (${team.id})`).join(", ");
  throw new SandCloudAgentLaunchError(
    `This account has multiple active teams. Set environment.team_id to one of: ${options2}.`
  );
}
async function fetchLivePrState(client, prUrl, storedState) {
  if (prUrl.length === 0 || storedState === "merged") {
    return { state: storedState, source: { kind: "stored" }, mergeableState: "unknown" };
  }
  let status;
  try {
    status = await client.getPullRequestMergeStatus(
      new GetPullRequestMergeStatusRequest({ prUrl })
    );
  } catch (error42) {
    return {
      state: storedState,
      source: { kind: "failed", reason: classifyReadFailure(error42) },
      mergeableState: "unknown"
    };
  }
  const live = mapMergeStatusToPrState(status);
  if (live == null) {
    return {
      state: storedState,
      source: { kind: "failed", reason: "internal" },
      mergeableState: "unknown"
    };
  }
  return {
    state: live,
    source: { kind: "live" },
    mergeableState: parseMergeableState(status.mergeableState)
  };
}
async function fetchFileChanges(client, bcId) {
  let response;
  try {
    response = await client.getOptimizedDiffDetails(
      new GetOptimizedDiffDetailsRequest({
        bcId,
        excludeBeforeAfterDiffs: true
      })
    );
  } catch (error42) {
    return { kind: "failed", reason: classifyReadFailure(error42) };
  }
  const files = [];
  for (const diff of response.diff?.diffs ?? []) {
    const change = toFileChange(diff);
    if (change != null) {
      files.push(change);
    }
    if (files.length >= MAX_CLOUD_AGENT_FILES) {
      break;
    }
  }
  return { kind: "listed", files };
}
function infoRequest(bcId) {
  return new GetBackgroundComposerInfoRequest({
    bcId,
    includeDiff: false,
    doNotThrowIfSetupNotFinished: true
  });
}
function createCloudAgentsClient(deps) {
  const client = () => deps.getClient();
  async function launch(args) {
    const startFromScratch = args.newRepo === true;
    if (startFromScratch && args.repoUrl != null) {
      throw new SandCloudAgentLaunchError(
        "repo and repo_url cannot be used when new_repo is true."
      );
    }
    if (startFromScratch && args.startingRef != null) {
      throw new SandCloudAgentLaunchError("starting_ref cannot be used when new_repo is true.");
    }
    if (startFromScratch && args.environment != null && args.environment.type !== "cloud") {
      throw new SandCloudAgentLaunchError(
        'new_repo requires a Cursor-managed cloud VM; omit environment or use type "cloud".'
      );
    }
    if (args.environment?.type === "machine" && args.startingRef != null && args.startingRef.trim().length > 0) {
      throw new SandCloudAgentLaunchError(
        `A named private worker runs on its own checkout, so it can't start from '${args.startingRef}'. Omit starting_ref (the worker uses its current branch), or use a cloud or pool environment to start from a specific ref.`
      );
    }
    const savedEnvironment = args.environment?.type === "environment" ? await resolveSavedEnvironment(client(), args.environment) : void 0;
    const newRepo = startFromScratch && deps.prepareNewRepo != null ? await deps.prepareNewRepo() : void 0;
    if (startFromScratch && newRepo == null) {
      throw new SandCloudAgentLaunchError("New Origin projects are not available in this client.");
    }
    const repo = buildRepoFromRemote(
      resolveLaunchRepoReference(newRepo?.repoUrl ?? args.repoUrl, savedEnvironment),
      newRepo?.startingRef ?? args.startingRef
    );
    const environmentFields = resolveCloudAgentEnvironmentFields(
      repo.httpRepoUrl,
      args.environment
    );
    const teamId = await resolvePrivateWorkerTeamId(deps, args.environment);
    const requestedModel = buildCloudAgentRequestedModel(args.modelId, args.modelParams);
    const bcId = args.identity?.bcId ?? `bc-${crypto.randomUUID()}`;
    const title = args.title?.trim() || void 0;
    const conversationAction = buildCloudAgentConversationAction(
      buildCloudAgentUserMessage({
        prompt: args.prompt,
        mode: AgentMode.AGENT,
        images: args.images,
        files: args.files,
        messageId: args.identity?.messageId
      })
    );
    const request5 = new StartBackgroundComposerFromSnapshotRequest({
      bcId,
      snapshotNameOrId: repo.sanitizedRepoUrl,
      devcontainerStartingPoint: new DevcontainerStartingPoint({
        url: repo.httpRepoUrl,
        ref: repo.baseBranch ?? "",
        ...savedEnvironment != null ? {
          environmentPublicId: savedEnvironment.publicId,
          environmentName: savedEnvironment.name.trim() || void 0,
          repoConfig: toStartRepoConfig(savedEnvironment.repoConfig)
        } : {}
      }),
      snapshotWorkspaceRootPath: CLOUD_AGENT_SINGLE_REPO_WORKSPACE_ROOT,
      returnImmediately: true,
      repoUrl: repo.httpRepoUrl,
      source: BackgroundComposerSource.GROK_BOT,
      autoBranch: !startFromScratch,
      baseBranch: repo.baseBranch,
      autoCreatePr: !startFromScratch,
      conversationAction,
      startingMessageType: StartingMessageType.USER_MESSAGE,
      addInitialMessageToResponses: true,
      repositoryInfo: { pathEncryptionKey: "", shouldSyncIndex: false },
      ...environmentFields,
      requestedModels: requestedModel != null ? [requestedModel] : [],
      skills: [],
      teamId,
      ...title != null ? { name: title } : {},
      ...args.project === true ? { projectDetails: new ProjectDetails(title != null ? { name: title } : {}) } : {},
      ...args.lineage != null ? {
        grokBotHandoffLineage: new GrokBotHandoffLineage({
          grokBotAgentId: args.lineage.grokBotAgentId,
          launchingRequestId: args.lineage.parentRequestId,
          launchingRootRequestId: args.lineage.rootParentRequestId,
          launchingToolCallId: args.lineage.parentAgentToolCallId ?? ""
        })
      } : {}
    });
    const response = await client().startBackgroundComposerFromSnapshot(request5);
    newRepo?.markLaunched();
    const id = response.composer?.bcId || bcId;
    return { bcId: id, url: cloudAgentUrl(id) };
  }
  async function list(args) {
    const response = await client().listBackgroundComposers(
      new ListBackgroundComposersRequest({ n: args?.limit ?? 20 })
    );
    const includeArchived = args?.includeArchived ?? false;
    return response.composers.filter((composer) => includeArchived || !composer.isArchived).map(toCloudAgentSummary);
  }
  async function listRecentActivity(limit) {
    const requestedLimit = Number.isFinite(limit) ? Math.trunc(limit) : 1;
    const response = await client().listDetailedBackgroundComposers(
      new ListDetailedBackgroundComposersRequest({
        n: Math.min(Math.max(requestedLimit, 1), SAND_CONNECTED_ACTIVITY_LIMIT),
        includeTeamWide: false,
        includeArchived: false,
        includeDiff: false,
        statusOnly: false
      })
    );
    const projectNamesById = new Map(
      response.composers.flatMap((detailed) => {
        const composer = detailed.composer;
        return composer?.projectMetadata != null && composer.bcId !== "" ? [[composer.bcId, coordinatorProjectName(detailed)]] : [];
      })
    );
    return response.composers.map((detailed) => toRecentActivity(detailed, projectNamesById)).filter((item) => item !== null);
  }
  async function get(bcId) {
    const trimmed = bcId.trim();
    if (trimmed.length === 0) {
      return null;
    }
    const response = await client().getBackgroundComposerInfo(infoRequest(trimmed));
    const detailed = response.composer;
    const composer = detailed?.composer;
    if (composer == null) {
      return null;
    }
    return {
      bcId: trimmed,
      name: composer.name,
      status: mapRunStatus(composer.status),
      branchName: resolveBranchName(detailed),
      prUrl: resolvePrUrl(detailed),
      isArchived: composer.isArchived,
      createdAtMs: composer.createdAtMs,
      url: cloudAgentUrl(trimmed),
      filesChanged: composer.filesChanged ?? 0,
      linesAdded: composer.linesAdded ?? 0,
      linesRemoved: composer.linesRemoved ?? 0,
      error: resolveSandLimitError(detailed)
    };
  }
  async function reply2(args) {
    const followupConversationAction = buildCloudAgentConversationAction(
      buildCloudAgentUserMessage({
        prompt: args.prompt,
        images: args.images,
        files: args.files,
        messageId: args.identity?.messageId
      })
    );
    const response = await client().addAsyncFollowupBackgroundComposer(
      new AddAsyncFollowupBackgroundComposerRequest({
        bcId: args.bcId,
        followupId: args.identity?.followupId,
        followupConversationAction,
        synchronous: args.interrupt ?? false,
        followupSource: BackgroundComposerSource.GROK_BOT,
        requestedModel: buildCloudAgentRequestedModel(args.modelId, args.modelParams) ?? void 0
      })
    );
    return { runId: response.runId };
  }
  async function cancel(bcId) {
    await client().pauseBackgroundComposer(
      new PauseBackgroundComposerRequest({
        bcId,
        source: BackgroundComposerSource.GROK_BOT
      })
    );
  }
  async function rename7(bcId, newName) {
    await client().renameBackgroundComposer(new RenameBackgroundComposerRequest({ bcId, newName }));
  }
  async function setArchived(bcId, archived) {
    await client().archiveBackgroundComposer(
      new ArchiveBackgroundComposerRequest({
        bcId,
        unarchive: !archived,
        source: BackgroundComposerSource.GROK_BOT,
        closePullRequest: false
      })
    );
  }
  async function remove(bcId) {
    await client().deleteBackgroundComposer(new DeleteBackgroundComposerRequest({ bcId }));
  }
  async function listArtifacts(bcId) {
    const response = await client().listBackgroundComposerArtifacts(
      new ListBackgroundComposerArtifactsRequest({ bcId })
    );
    return response.artifacts.map((artifact) => ({
      path: artifact.absolutePath,
      sizeBytes: Number(artifact.sizeBytes)
    }));
  }
  async function getArtifactBytes(args) {
    const response = await client().getBackgroundComposerArtifactBytes(
      new GetBackgroundComposerArtifactBytesRequest({
        bcId: args.bcId,
        absolutePath: args.absolutePath
      })
    );
    return { bytes: response.content, contentType: response.contentType };
  }
  async function getTranscriptDump(args) {
    const bcId = args.bcId.trim();
    if (bcId.length === 0) {
      return null;
    }
    const backend = client();
    const conversationResponse = await backend.getBackgroundComposerConversation(
      new GetBackgroundComposerConversationRequest({ bcId })
    );
    const { jsonl, lineCount } = buildTranscriptJsonl(conversationResponse.conversation);
    let run;
    try {
      const infoResponse = await backend.getBackgroundComposerInfo(infoRequest(bcId));
      run = { kind: "status", status: mapRunStatus(infoResponse.composer?.composer?.status) };
    } catch (error42) {
      run = { kind: "failed", reason: classifyReadFailure(error42) };
    }
    return { jsonl, lineCount, run };
  }
  async function getConversation(args) {
    const bcId = args.bcId.trim();
    if (bcId.length === 0) {
      return null;
    }
    const backend = client();
    const reads = exchangeConversationReads(bcId);
    let conversation = [];
    try {
      for (const [index, request5] of reads.entries()) {
        try {
          conversation = (await backend.getBackgroundComposerConversation(request5)).conversation;
          break;
        } catch (error42) {
          const isLastRead = index === reads.length - 1;
          if (isLastRead || !refusesExchangeProjection(error42)) throw error42;
        }
      }
    } catch (error42) {
      return { kind: "failed", reason: classifyReadFailure(error42) };
    }
    return { kind: "read", messages: toCloudAgentMessages(conversation) };
  }
  async function fetchCitedArtifacts(backend, bcId) {
    let summary;
    try {
      summary = await readCloudAgentReport(backend, bcId);
    } catch (error42) {
      return { kind: "failed", reason: classifyReadFailure(error42) };
    }
    if (summary === void 0) {
      return { kind: "skipped" };
    }
    let listed;
    try {
      listed = await listArtifacts(bcId);
    } catch (error42) {
      if (error42 instanceof ConnectError && (error42.code === Code.InvalidArgument || error42.code === Code.FailedPrecondition || error42.code === Code.NotFound)) {
        return { kind: "unavailable" };
      }
      return { kind: "failed", reason: classifyReadFailure(error42) };
    }
    const plan = planCloudAgentArtifacts({ bcId, summary, artifacts: listed });
    return { kind: "listed", files: plannedCloudAgentArtifactFiles(bcId, plan.planned) };
  }
  async function getInfo(bcId, options2 = {}) {
    const includeFiles = options2.includeFiles ?? true;
    const trimmedBcId = bcId.trim();
    if (trimmedBcId.length === 0) {
      return null;
    }
    const backend = client();
    let response;
    try {
      response = await backend.getBackgroundComposerInfo(infoRequest(trimmedBcId));
    } catch (error42) {
      if (error42 instanceof ConnectError && (error42.code === Code.NotFound || error42.code === Code.PermissionDenied)) {
        return null;
      }
      throw error42;
    }
    const detailed = response.composer;
    const composer = detailed?.composer;
    const filesChanged = composer?.filesChanged ?? 0;
    const storedPr = resolvePr(detailed);
    const prUrl = resolvePrUrl(detailed);
    const status = mapRunStatus(composer?.status);
    const updatedAtMs = positiveMs(composer?.updatedAtMs);
    const [files, pr2, artifacts] = await Promise.all([
      includeFiles && filesChanged > 0 ? fetchFileChanges(backend, trimmedBcId) : Promise.resolve({ kind: "skipped" }),
      fetchLivePrState(backend, prUrl, storedPr.state),
      options2.includeArtifacts === true && isTerminalCloudAgentRunStatus(status) ? fetchCitedArtifacts(backend, trimmedBcId) : Promise.resolve({ kind: "skipped" })
    ]);
    return {
      bcId: trimmedBcId,
      status,
      name: composer?.name ?? "",
      prompt: detailed?.prompt?.text ?? "",
      branchName: resolveBranchName(detailed),
      prUrl,
      prState: pr2.state,
      prStateSource: pr2.source,
      prNumber: storedPr.number,
      mergeableState: pr2.mergeableState,
      lastActivityAtMs: positiveMs(composer?.lastMessageActivityAtMs) ?? updatedAtMs,
      ...updatedAtMs !== null ? { updatedAtMs } : {},
      filesChanged,
      linesAdded: composer?.linesAdded ?? 0,
      linesRemoved: composer?.linesRemoved ?? 0,
      files,
      artifacts,
      project: resolveProjectMembership(composer)
    };
  }
  async function fetchWatchResult(bcId, options2) {
    const backend = client();
    const [response, report] = await Promise.all([
      backend.getBackgroundComposerInfo(infoRequest(bcId)),
      fetchCloudAgentReport(backend, bcId)
    ]);
    const detailed = response.composer;
    const status = detailed?.composer?.status ?? BackgroundComposerStatus.UNSPECIFIED;
    const isTerminal2 = status === BackgroundComposerStatus.FINISHED || status === BackgroundComposerStatus.ERROR || status === BackgroundComposerStatus.EXPIRED;
    const seamStatus = options2.seamStatus === "aborted" ? "finished" : options2.seamStatus;
    const result = buildWatchResult(
      bcId,
      isTerminal2 ? status : terminalStatusToProto(seamStatus),
      detailed,
      report
    );
    return options2.seamStatus === "aborted" ? markWatchResultAborted(bcId, result) : result;
  }
  async function listInstallationUnits(search) {
    const dashboard = deps.getDashboardClient();
    const connected2 = [];
    const unreachable3 = [];
    const accessDenied = [];
    const inlineUnits = [];
    const pagedUnits = [];
    await Promise.all(
      DASHBOARD_CONNECTABLE_PROVIDERS.map(async (provider) => {
        const gheApplication = SCM_PROVIDER_GHE_APPLICATION_UUID[provider];
        try {
          const response = await dashboard.getGithubInstallations(
            new GetGithubInstallationsRequest({
              includeTeamOwnedRepos: true,
              ...gheApplication == null ? {} : { gheApplication }
            })
          );
          if (!response.githubConnected) return;
          connected2.push(provider);
          for (const installation of response.installations) {
            const unit = { provider, installationId: installation.installationId };
            const denied = installation.accessError != null && installation.accessError.length > 0 && !installation.hasMoreRepos;
            if (denied) {
              accessDenied.push(provider);
              continue;
            }
            if (!installation.hasMoreRepos && search == null) {
              inlineUnits.push({ ...unit, inlineRepos: installation.repos, inlineComplete: true });
            } else {
              pagedUnits.push({ ...unit, inlineComplete: false });
            }
          }
        } catch {
          unreachable3.push(provider);
        }
      })
    );
    const rank = (provider) => DASHBOARD_CONNECTABLE_PROVIDERS.findIndex((candidate) => candidate === provider);
    const byPosition = (a, b2) => {
      const byProvider = rank(a.provider) - rank(b2.provider);
      if (byProvider !== 0) return byProvider;
      if (a.installationId === b2.installationId) return 0;
      return a.installationId < b2.installationId ? -1 : 1;
    };
    return {
      search,
      connectedProviders: connected2.sort((a, b2) => rank(a) - rank(b2)),
      unreachableProviders: unreachable3.sort((a, b2) => rank(a) - rank(b2)),
      units: [...inlineUnits.sort(byPosition), ...pagedUnits.sort(byPosition)],
      offset: 0,
      accessDenied: accessDenied.sort((a, b2) => rank(a) - rank(b2))
    };
  }
  async function rehydrateInlineUnits(state) {
    const dashboard = deps.getDashboardClient();
    const providers = new Set(
      state.units.filter((unit) => unit.inlineComplete && unit.inlineRepos == null).map((unit) => unit.provider)
    );
    if (providers.size === 0) return state;
    const inlineByKey = /* @__PURE__ */ new Map();
    const pageInstead = /* @__PURE__ */ new Set();
    const providerList = [...providers];
    const settled = await Promise.allSettled(
      providerList.map((provider) => {
        const gheApplication = SCM_PROVIDER_GHE_APPLICATION_UUID[provider];
        return dashboard.getGithubInstallations(
          new GetGithubInstallationsRequest({
            includeTeamOwnedRepos: true,
            ...gheApplication == null ? {} : { gheApplication }
          })
        );
      })
    );
    settled.forEach((outcome, index) => {
      const provider = providerList[index];
      if (provider == null) return;
      if (outcome.status === "rejected") {
        pageInstead.add(provider);
        return;
      }
      for (const installation of outcome.value.installations) {
        if (installation.hasMoreRepos) continue;
        if (installation.accessError != null && installation.accessError.length > 0) continue;
        inlineByKey.set(`${provider}:${installation.installationId}`, installation.repos);
      }
    });
    return {
      ...state,
      units: state.units.map((unit) => {
        if (!unit.inlineComplete || unit.inlineRepos != null) return unit;
        const inlineRepos = inlineByKey.get(`${unit.provider}:${unit.installationId}`);
        return inlineRepos == null ? { ...unit, inlineComplete: false } : { ...unit, inlineRepos };
      })
    };
  }
  async function listRepositories(args) {
    const search = args?.search == null || args.search.length === 0 ? void 0 : args.search;
    const resumed = decodeRepositoriesCursor({ cursor: args?.cursor, search });
    const state = resumed == null ? await listInstallationUnits(search) : await rehydrateInlineUnits(resumed);
    const dashboard = deps.getDashboardClient();
    async function fetchUnitPage(unit, page) {
      const gheApplication = SCM_PROVIDER_GHE_APPLICATION_UUID[unit.provider];
      try {
        const response = await dashboard.getInstallationRepos(
          new GetInstallationReposRequest({
            installationId: unit.installationId,
            startPage: page,
            pageSize: REPOSITORIES_BACKEND_PAGE_SIZE,
            ...gheApplication == null ? {} : { gheApplication },
            ...search == null ? {} : { search }
          })
        );
        if (response.accessError != null && response.accessError.length > 0) {
          return { repos: [], hasMore: false, failed: true };
        }
        return { repos: response.repos, hasMore: response.hasMore, failed: false };
      } catch {
        return { repos: [], hasMore: false, failed: true };
      }
    }
    const repos = [];
    const unlistableInstallations = [...state.accessDenied];
    let nextCursor;
    let fetches = 0;
    walk: for (let index = 0; index < state.units.length; index++) {
      const unit = state.units[index];
      if (unit == null) break;
      let offset = index === 0 ? state.offset : 0;
      while (true) {
        const pageIndex = Math.floor(offset / REPOSITORIES_BACKEND_PAGE_SIZE) + 1;
        const inline = pageIndex === 1 && search == null ? unit.inlineRepos : void 0;
        if (repos.length >= REPOSITORIES_PAGE_LIMIT || inline == null && fetches >= REPOSITORIES_MAX_PAGE_FETCHES_PER_CALL) {
          nextCursor = encodeRepositoriesCursor({
            ...state,
            units: state.units.slice(index),
            offset,
            accessDenied: unlistableInstallations
          });
          break walk;
        }
        let page;
        if (inline != null) {
          page = { repos: inline, hasMore: false, failed: false };
        } else {
          fetches++;
          page = await fetchUnitPage(unit, pageIndex);
        }
        if (page.failed) {
          unlistableInstallations.push(unit.provider);
          break;
        }
        const within = offset % REPOSITORIES_BACKEND_PAGE_SIZE;
        const taken = page.repos.slice(within, within + REPOSITORIES_PAGE_LIMIT - repos.length);
        for (const repo of taken) {
          repos.push({
            provider: unit.provider,
            ownerAndName: `${repo.owner}/${repo.name}`,
            url: repo.htmlUrl,
            archived: repo.archived
          });
        }
        offset += taken.length;
        if (within + taken.length < page.repos.length) {
          nextCursor = encodeRepositoriesCursor({
            ...state,
            units: state.units.slice(index),
            offset,
            accessDenied: unlistableInstallations
          });
          break walk;
        }
        if (!page.hasMore) break;
        offset = pageIndex * REPOSITORIES_BACKEND_PAGE_SIZE;
      }
    }
    return {
      repos,
      connectedProviders: state.connectedProviders,
      unreachableProviders: state.unreachableProviders,
      unlistableInstallations,
      nextCursor
    };
  }
  return {
    launch,
    list,
    listRecentActivity,
    get,
    reply: reply2,
    cancel,
    rename: rename7,
    setArchived,
    delete: remove,
    listArtifacts,
    getArtifactBytes,
    listRepositories,
    getTranscriptDump,
    getConversation,
    getInfo,
    fetchWatchResult
  };
}
