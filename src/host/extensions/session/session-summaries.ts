var PREVIEW_TAIL_FIRST_LIMIT = 64;
var PREVIEW_TAIL_MAX_LIMIT = 4096;
function deriveTranscriptExtras(db, agentId, firstLimit = PREVIEW_TAIL_FIRST_LIMIT) {
  for (let limit = firstLimit; limit <= PREVIEW_TAIL_MAX_LIMIT; limit *= 4) {
    const tail = db.getTranscriptTail({ limit });
    const extras = transcriptExtrasFrom(tail.entries, agentId);
    if (tail.nextBeforeSeq === void 0 || previewsSettledWithin(tail.entries, extras)) {
      return extras;
    }
  }
  return transcriptExtrasFrom(db.getTranscriptEntries(), agentId);
}
function transcriptExtrasFrom(entries, agentId) {
  return {
    hasTranscript: entries.length > 0,
    lastEntry: previewFieldOrNull(agentId, () => getLastEntryFromTranscript(entries)),
    lastMessage: previewFieldOrNull(agentId, () => getLastMessageFromTranscript(entries)),
    newestEntryId: entries.at(-1)?.id ?? null
  };
}
function loadAgentDbExtras(db, dbPath, dirName, dbStats) {
  if (!db.isOpen) return null;
  ensureProfileFile(dbPath, db);
  return readDbExtras(db, dirName, dbStats);
}
function readDbExtras(db, dirName, dbStats) {
  try {
    const agentId = db.get("agentId") || dirName;
    seedActivityFromMtime(db, agentId, dbStats);
    const createdAt = db.get("createdAt");
    const unreadState = db.getUnreadState();
    return {
      agentId,
      createdAt,
      updatedAt: getSummaryUpdatedAt(
        {
          ...getDefaultAgentMetadata(agentId),
          createdAt,
          latestRootBlobId: db.get("latestRootBlobId")
        },
        unreadState
      ),
      ...deriveTranscriptExtras(db, agentId),
      unreadState,
      awaitingUserResponse: db.getAwaitingUserResponse(),
      lastTurnSettlement: db.getLastTurnSettlement(),
      origin: db.getAgentOrigin(),
      purpose: db.getAgentPurpose(),
      legacyAvatarPath: db.getSandProfile().avatarPath
    };
  } catch {
    return null;
  }
}
var reportedPreviewDegradations = /* @__PURE__ */ new Set();
function previewFieldOrNull(agentId, derive) {
  try {
    return derive();
  } catch (error41) {
    if (!reportedPreviewDegradations.has(agentId)) {
      reportedPreviewDegradations.add(agentId);
      reportHostDiagnostic({
        kind: "summary_preview_degraded",
        agentId,
        errorClass: errorLogTag(error41)
      });
    }
    return null;
  }
}
function orNull(value) {
  return value != null && value.length > 0 ? value : null;
}
function minimalAgentSummary(args) {
  const { dirName, dbPath, dbStats, activeAgentId } = args;
  const profilePath = getSandProfilePath((0, import_node_path140.dirname)(dbPath));
  const fileProfile = readSandProfileFile(profilePath);
  const creationMetadata = readSandProfileCreationMetadata(profilePath);
  const name17 = fileProfile != null && fileProfile.name.trim().length > 0 ? fileProfile.name : SAND_DEFAULT_AGENT_NAME;
  const fileMtimeMs = Math.floor(Number(dbStats?.mtimeMs ?? 0));
  return {
    id: dirName,
    name: name17,
    description: fileProfile?.description ?? "",
    title: fileProfile?.title ?? "",
    avatarDataUrl: null,
    avatarVersion: null,
    avatarShape: orNull(fileProfile?.avatarShape),
    avatarColor: orNull(fileProfile?.avatarColor),
    createdAt: fileMtimeMs,
    updatedAt: fileMtimeMs,
    path: dbPath,
    isActive: dirName === activeAgentId,
    isRunning: false,
    isRunningTurn: false,
    isComposingMessage: false,
    lastEntry: null,
    lastMessageId: null,
    lastMessagePreview: null,
    lastMessageAuthorId: null,
    pushMessageContent: null,
    newestEntryId: null,
    hasUnread: false,
    unreadCount: 0,
    awaitingUserResponse: null,
    notificationsEnabled: false,
    notifyOnUpdatesEnabled: true,
    isHiddenFromSidebar: false,
    origin: creationMetadata.origin ?? "user",
    ...creationMetadata.purpose === void 0 ? {} : { purpose: creationMetadata.purpose },
    ...fileProfile?.namedBy === void 0 ? {} : { namedBy: fileProfile.namedBy },
    ...readSandProfileHarness(profilePath) === "temporal" ? { harness: "temporal" } : {},
    isGroup: false,
    memberIds: []
  };
}
async function buildSummary(args) {
  const { extras, dbPath, dirName, dbStats, activeAgentId, includeBlank, agentHasMemory } = args;
  const agentDir = (0, import_node_path140.dirname)(dbPath);
  ensureSettingsFile(dbPath);
  const profilePath = getSandProfilePath(agentDir);
  const fileProfile = readSandProfileFile(profilePath);
  const creationMetadata = readSandProfileCreationMetadata(profilePath);
  const purpose = creationMetadata.purpose ?? extras?.purpose;
  const fileSettings = readSandSettingsFile(getSandSettingsPath(agentDir));
  const groupConfig = readSandGroupConfig(agentDir);
  const isGroup = groupConfig != null;
  const memberIds = groupConfig == null ? [] : groupConfig.memberIds.filter((id2) => !isSandGroupDir((0, import_node_path139.join)((0, import_node_path140.dirname)(agentDir), id2)));
  const isActive = dirName === activeAgentId;
  const derivedAvatar = resolveDerivedAvatarFilename(
    agentDir,
    readLegacyProfileAvatarField(profilePath)
  );
  const name17 = fileProfile != null && fileProfile.name.trim().length > 0 ? fileProfile.name : SAND_DEFAULT_AGENT_NAME;
  const description10 = fileProfile?.description ?? "";
  const title = fileProfile?.title ?? "";
  const hasUserIdentity = isGroup || !hasPlaceholderProfileName(fileProfile) || description10.trim().length > 0 || title.length > 0 || derivedAvatar != null || extras?.legacyAvatarPath != null;
  if (!isActive && !includeBlank) {
    const provablyBlank = extras != null && !extras.hasTranscript && !hasUserIdentity && !await agentHasDurableFootprint(agentDir, agentHasMemory);
    if (provablyBlank) return null;
  }
  const id = extras?.agentId ?? dirName;
  const avatar = await readAvatarWithinDir(agentDir, derivedAvatar) ?? await readAvatarWithinDir(agentDir, extras?.legacyAvatarPath ?? null);
  const fileMtimeMs = Math.floor(Number(dbStats?.mtimeMs ?? 0));
  const isUnread = extras != null && (extras.unreadState.isManuallyUnread || extras.unreadState.lastUnreadActivityAt > extras.unreadState.lastViewedAt);
  return {
    id,
    name: name17,
    description: description10,
    title,
    avatarDataUrl: avatar?.dataUrl ?? null,
    avatarVersion: avatar?.version ?? null,
    avatarShape: orNull(fileProfile?.avatarShape),
    avatarColor: orNull(fileProfile?.avatarColor),
    createdAt: extras?.createdAt ?? fileMtimeMs,
    updatedAt: extras?.updatedAt ?? fileMtimeMs,
    path: dbPath,
    isActive,
    isRunning: false,
    isRunningTurn: false,
    isComposingMessage: false,
    lastEntry: extras?.lastEntry ?? null,
    lastMessageId: extras?.lastMessage?.id ?? null,
    lastMessagePreview: extras?.lastMessage?.preview ?? null,
    lastMessagePreviewSource: extras?.lastMessage?.previewSource ?? null,
    lastMessageAuthorId: extras?.lastMessage?.authorId ?? null,
    pushMessageContent: extras?.lastMessage?.pushMessageContent ?? null,
    newestEntryId: extras?.newestEntryId ?? null,
    hasUnread: isUnread,
    unreadCount: isUnread && extras != null ? Math.max(extras.unreadState.unreadCount, 1) : 0,
    lastViewedAt: extras?.unreadState.lastViewedAt ?? 0,
    lastActivityAt: extras?.unreadState.lastUnreadActivityAt ?? 0,
    awaitingUserResponse: extras?.awaitingUserResponse ?? null,
    ...extras?.lastTurnSettlement != null ? { lastTurnSettlement: extras.lastTurnSettlement } : {},
    notificationsEnabled: false,
    notifyOnUpdatesEnabled: fileSettings.notifyOnAgentUpdates,
    isHiddenFromSidebar: fileSettings.hiddenFromSidebar,
    voiceId: normalizeSandVoiceId(fileSettings.voiceId),
    voiceSpeed: normalizeSandVoiceSpeed(fileSettings.voiceSpeed),
    voiceLanguage: normalizeSandVoiceLanguage(fileSettings.voiceLanguage),
    origin: creationMetadata.origin ?? extras?.origin ?? "user",
    ...purpose == null ? {} : { purpose },
    ...fileProfile?.namedBy === void 0 ? {} : { namedBy: fileProfile.namedBy },
    isGroup,
    memberIds,
    ...readSandProfileHarness(profilePath) === "temporal" ? { harness: "temporal" } : {}
  };
}
async function agentHasDurableFootprint(agentDir, agentHasMemory) {
  return await agentHasQuarantinedStoreDb(agentDir) || agentHasMemory(agentDir) || agentHasAutomations(agentDir) || agentHasSkills(agentDir);
}
async function agentHasQuarantinedStoreDb(agentDir) {
  try {
    const entries = await (0, import_promises66.readdir)(agentDir);
    return entries.some((name17) => name17.startsWith("store.db.corrupt-"));
  } catch (error41) {
    reportFallbackUnlessAbsent("session_summaries", error41);
    return false;
  }
}
