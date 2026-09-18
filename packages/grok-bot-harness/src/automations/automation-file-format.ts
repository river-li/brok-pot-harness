var import_node_path94 = require("node:path");
init_unknown_record();
var AUTOMATIONS_DIRNAME = "automations";
var AUTOMATION_CONFIG_FILENAME = "automation.json";
var AUTOMATION_RUNS_FILENAME = "runs.json";
function getAgentAutomationsDir(agentDir) {
  return (0, import_node_path94.join)(agentDir, AUTOMATIONS_DIRNAME);
}
function parseStoredConfigTrigger(parsed2) {
  if (parsed2.trigger != null) {
    const trigger2 = parseStoredTrigger(parsed2.trigger);
    if (!isTriggerParseFailure(trigger2)) return trigger2;
  }
  const schedule = typeof parsed2.schedule === "string" ? normalizeSchedule(parsed2.schedule) : "";
  return schedule.length > 0 ? cronTrigger(schedule) : null;
}
function parseTriggerPresentation(value, trigger2) {
  if (!isUnknownRecord(value) || value.version !== 1) return void 0;
  const presentationTrigger = parseStoredTrigger(value.trigger);
  if (isTriggerParseFailure(presentationTrigger) || triggerIdentity(presentationTrigger) !== triggerIdentity(trigger2)) {
    return void 0;
  }
  return { version: 1, trigger: presentationTrigger };
}
function parseAutomationNoticeIds(value) {
  if (!Array.isArray(value)) return [];
  const ids = [];
  for (const entry of value) {
    if (typeof entry !== "string") continue;
    const id = entry.trim();
    if (id.length === 0 || ids.includes(id) || !isAutomationNoticeId(id)) continue;
    ids.push(id);
  }
  return ids;
}
function parseStoredProvenance(value) {
  return value === "user" || value === "template_import" ? value : "untrusted";
}
function parseStoredSessionId(value) {
  return typeof value === "string" && value.length > 0 ? value : void 0;
}
function parseStoredAutomationConfig(raw, fallbackCreatedAt) {
  let json3;
  try {
    json3 = JSON.parse(raw);
  } catch {
    return null;
  }
  if (json3 == null || typeof json3 !== "object") return null;
  const parsed2 = json3;
  const name17 = typeof parsed2.name === "string" ? clampAutomationName(parsed2.name) : "";
  const prompt = typeof parsed2.prompt === "string" ? normalizeAutomationPrompt(parsed2.prompt) : "";
  const trigger2 = parseStoredConfigTrigger(parsed2);
  if (name17.length === 0 || prompt.length === 0 || trigger2 == null) {
    return null;
  }
  const authoredCreatedAt = typeof parsed2.createdAt === "number" && Number.isFinite(parsed2.createdAt) ? parsed2.createdAt : fallbackCreatedAt;
  const createdAt = Math.min(authoredCreatedAt, fallbackCreatedAt);
  const lastRunAt = typeof parsed2.lastRunAt === "number" && Number.isFinite(parsed2.lastRunAt) ? parsed2.lastRunAt : null;
  const isEnabled = parsed2.enabled !== false;
  const triggerPresentation = parseTriggerPresentation(parsed2.triggerPresentation, trigger2);
  const sessionId = parseStoredSessionId(parsed2.sessionId);
  return {
    name: name17,
    prompt,
    trigger: trigger2,
    ...triggerPresentation != null ? { triggerPresentation } : {},
    isEnabled,
    provenance: parseStoredProvenance(parsed2.provenance),
    ...sessionId != null ? { sessionId } : {},
    createdAt,
    lastRunAt,
    pendingNotices: parseAutomationNoticeIds(parsed2.pendingNotices),
    raisedNotices: parseAutomationNoticeIds(parsed2.raisedNotices)
  };
}
function serializeStoredAutomationConfig(config2) {
  const schedule = triggerSchedule(config2.trigger);
  return `${JSON.stringify(
    {
      name: config2.name,
      prompt: config2.prompt,
      ...schedule != null ? { schedule } : {},
      ...config2.trigger.type === "cron" ? {} : { trigger: serializeStoredTrigger(config2.trigger) },
      ...config2.triggerPresentation != null ? {
        triggerPresentation: {
          version: config2.triggerPresentation.version,
          trigger: serializeStoredTrigger(config2.triggerPresentation.trigger)
        }
      } : {},
      enabled: config2.isEnabled,
      provenance: config2.provenance,
      ...config2.sessionId != null ? { sessionId: config2.sessionId } : {},
      createdAt: config2.createdAt,
      lastRunAt: config2.lastRunAt,
      ...config2.pendingNotices.length > 0 ? { pendingNotices: config2.pendingNotices } : {},
      ...config2.raisedNotices.length > 0 ? { raisedNotices: config2.raisedNotices } : {}
    },
    null,
    2
  )}
`;
}
function clampAutomationRunDetail(detail) {
  if (detail == null) return void 0;
  const trimmed = detail.trim();
  if (trimmed.length === 0) return void 0;
  return trimmed.slice(0, AUTOMATION_MAX_RUN_DETAIL_LENGTH);
}
function clampAutomationCoalescedRunIds(value) {
  if (!Array.isArray(value)) return void 0;
  const ids = value.filter((id) => typeof id === "string" && id.length > 0).slice(0, MAX_EVENTS_IN_AUTOMATION_WAKE);
  return ids.length > 0 ? ids : void 0;
}
function parseStoredAutomationRun(entry) {
  if (entry == null || typeof entry !== "object") return null;
  const id = typeof entry.id === "string" && entry.id.length > 0 ? entry.id : null;
  const startedAt = typeof entry.startedAt === "number" && Number.isFinite(entry.startedAt) ? entry.startedAt : null;
  if (id == null || startedAt == null) return null;
  const status = entry.status === "error" || entry.status === "running" ? entry.status : "ok";
  const trigger2 = entry.trigger === "manual" || entry.trigger === "event" ? entry.trigger : "schedule";
  const finishedAt = typeof entry.finishedAt === "number" && Number.isFinite(entry.finishedAt) ? entry.finishedAt : null;
  const detail = clampAutomationRunDetail(entry.detail);
  const errorKind = typeof entry.errorKind === "string" && entry.errorKind.length > 0 ? entry.errorKind : void 0;
  const event = clampAutomationRunDetail(entry.event);
  const coalescedRunIds = clampAutomationCoalescedRunIds(entry.coalescedRunIds);
  const requestId2 = typeof entry.requestId === "string" && entry.requestId.length > 0 ? entry.requestId : void 0;
  return {
    id,
    ...requestId2 != null ? { requestId: requestId2 } : {},
    trigger: trigger2,
    startedAt,
    finishedAt,
    status,
    ...detail != null ? { detail } : {},
    ...errorKind != null ? { errorKind } : {},
    ...event != null ? { event } : {},
    ...coalescedRunIds != null ? { coalescedRunIds } : {}
  };
}
function parseStoredAutomationRuns(raw) {
  let parsed2;
  try {
    const value = JSON.parse(raw);
    parsed2 = Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
  const runs = [];
  for (const entry of parsed2) {
    const run = parseStoredAutomationRun(entry);
    if (run != null) runs.push(run);
  }
  runs.sort((a, b2) => b2.startedAt - a.startedAt);
  return runs.slice(0, AUTOMATION_MAX_RUN_HISTORY);
}
function serializeStoredAutomationRuns(runs) {
  return `${JSON.stringify(runs, null, 2)}
`;
}
function uniqueAutomationId(name17, existingIds) {
  const base = slugifyAutomationName(name17);
  if (!existingIds.has(base)) return base;
  for (let suffix = 2; suffix < 1e3; suffix++) {
    const candidate = `${base}-${suffix}`;
    if (!existingIds.has(candidate)) return candidate;
  }
  return `${base}-${Date.now()}`;
}
function normalizeAutomationSpecTrigger(trigger2, minimumIntervalMs) {
  const members = [];
  for (const member of triggerList(trigger2)) {
    if (member.type !== "cron") {
      members.push(member);
      continue;
    }
    const schedule = normalizeSchedule(member.schedule);
    if (schedule.length === 0 || !isValidSchedule(schedule, minimumIntervalMs)) return null;
    members.push(cronTrigger(schedule));
  }
  const normalized = triggerFromList(members);
  if (normalized == null || normalized.type === "cron") return normalized;
  const reparsed = parseStoredTrigger(serializeStoredTrigger(normalized));
  return isTriggerParseFailure(reparsed) ? null : reparsed;
}
function automationConfigFromSpec(spec, args) {
  const name17 = clampAutomationName(spec.name);
  const prompt = normalizeAutomationPrompt(spec.prompt);
  const trigger2 = normalizeAutomationSpecTrigger(spec.trigger, args.minimumIntervalMs);
  if (name17.length === 0 || prompt.length === 0 || trigger2 == null) {
    return null;
  }
  const inSession = args.sessionId != null && args.sessionId.length > 0;
  return {
    name: name17,
    prompt,
    trigger: trigger2,
    triggerPresentation: { version: 1, trigger: trigger2 },
    isEnabled: spec.isEnabled ?? true,
    provenance: args.provenance,
    ...inSession ? { sessionId: args.sessionId } : {},
    ...inSession && args.creatorAuthId != null && args.creatorAuthId.length > 0 ? { creatorAuthId: args.creatorAuthId } : {},
    createdAt: args.createdAt,
    lastRunAt: null,
    pendingNotices: [],
    raisedNotices: []
  };
}
function automationConfigWithSpec(config2, spec, provenance, minimumIntervalMs) {
  const name17 = clampAutomationName(spec.name);
  const prompt = normalizeAutomationPrompt(spec.prompt);
  const trigger2 = normalizeAutomationSpecTrigger(spec.trigger, minimumIntervalMs);
  if (name17.length === 0 || prompt.length === 0 || trigger2 == null) {
    return null;
  }
  return {
    ...config2,
    name: name17,
    prompt,
    trigger: trigger2,
    ...config2.triggerPresentation != null ? { triggerPresentation: { version: 1, trigger: trigger2 } } : {},
    isEnabled: spec.isEnabled ?? config2.isEnabled,
    provenance
  };
}
function migrateAutomationConfigToMinimumInterval(config2, minimumIntervalMs) {
  let changed = false;
  const members = triggerList(config2.trigger).map((member) => {
    if (member.type !== "cron") return member;
    const schedule = clampScheduleToMinimumInterval(member.schedule, minimumIntervalMs);
    if (schedule == null || schedule === normalizeSchedule(member.schedule)) return member;
    changed = true;
    return cronTrigger(schedule);
  });
  if (!changed) return config2;
  const trigger2 = triggerFromList(members);
  if (trigger2 == null) return config2;
  const pendingNotices = config2.pendingNotices.includes(SAND_FIVE_MINUTE_AUTOMATION_FLOOR_NOTICE_ID) ? config2.pendingNotices : [...config2.pendingNotices, SAND_FIVE_MINUTE_AUTOMATION_FLOOR_NOTICE_ID];
  return {
    ...config2,
    trigger: trigger2,
    ...config2.triggerPresentation == null ? {} : { triggerPresentation: { version: 1, trigger: trigger2 } },
    pendingNotices
  };
}
function earliestAutomationNextRunAt(config2, timeZone) {
  const anchor = automationAnchor(config2);
  let earliest = null;
  for (const schedule of triggerCronSchedules(config2.trigger)) {
    const next = computeNextRunAt(schedule, anchor, timeZone);
    if (next != null && (earliest == null || next < earliest)) {
      earliest = next;
    }
  }
  return earliest;
}
function automationRecordFromConfig(args) {
  const { id, config: config2 } = args;
  return {
    id,
    name: config2.name,
    prompt: config2.prompt,
    trigger: config2.trigger,
    schedule: triggerSchedule(config2.trigger) ?? "",
    triggerDescription: describeTrigger(config2.trigger),
    ...config2.triggerPresentation != null ? { triggerPresentation: config2.triggerPresentation } : {},
    isEnabled: config2.isEnabled,
    provenance: config2.provenance,
    ...config2.sessionId != null ? { sessionId: config2.sessionId } : {},
    ...config2.creatorAuthId != null ? { creatorAuthId: config2.creatorAuthId } : {},
    createdAt: config2.createdAt,
    lastRunAt: config2.lastRunAt,
    ...config2.pendingNotices.length > 0 ? { pendingNotices: config2.pendingNotices } : {},
    ...config2.raisedNotices.length > 0 ? { raisedNotices: config2.raisedNotices } : {},
    nextRunAt: args.nextRunAt,
    runs: [...args.runs],
    filePath: args.filePath
  };
}
