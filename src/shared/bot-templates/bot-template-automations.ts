init_unknown_record();
var BOT_TEMPLATE_AUTOMATION_FILENAME = "automation.json";
var SLACK_USER_ID2 = /\bU[A-Z0-9]{6,13}\b/g;
var SLACK_CHANNEL_ID = /\bC[A-Z0-9]{6,13}\b/g;
var SLACK_CHANNEL_NAME = /#[A-Za-z0-9][A-Za-z0-9_-]{0,79}/g;
function automationFileName(filePath) {
  const normalized = filePath.replaceAll("\\", "/");
  const slash = normalized.lastIndexOf("/");
  return slash === -1 ? normalized : normalized.slice(slash + 1);
}
function normalizeAutomationRef(value) {
  return value.trim().toLowerCase();
}
function isPackableAutomation(source) {
  return automationFileName(source.filePath) === BOT_TEMPLATE_AUTOMATION_FILENAME;
}
function automationMatchesRef(source, ref) {
  const key = normalizeAutomationRef(ref.slug);
  if (key.length === 0) return false;
  return normalizeAutomationRef(source.id) === key || normalizeAutomationRef(source.name) === key;
}
function nextFillInId(collector, prefix) {
  const n = (collector.counts.get(prefix) ?? 0) + 1;
  collector.counts.set(prefix, n);
  return n === 1 ? prefix : `${prefix}_${n}`;
}
function rememberReplacement(collector, from2, to3) {
  if (from2.length === 0 || collector.values.has(from2)) return;
  collector.values.set(from2, to3);
  collector.replacements.push({ from: from2, to: to3 });
}
function addFillIn(collector, prefix, label, values) {
  const unique = [
    ...new Set(values.map((value) => value.trim()).filter((value) => value.length > 0))
  ];
  if (unique.length === 0 || unique.every((value) => collector.values.has(value))) return;
  const placeholder = `{${nextFillInId(collector, prefix)}}`;
  collector.fillIns.push({ id: placeholder.slice(1, -1), label });
  for (const value of unique) {
    rememberReplacement(collector, value, placeholder);
    if (value.startsWith("@") || value.startsWith("#")) {
      rememberReplacement(collector, value.slice(1), placeholder);
    } else {
      rememberReplacement(collector, `@${value}`, placeholder);
      rememberReplacement(collector, `#${value}`, placeholder);
    }
  }
}
function addFillInEach(collector, prefix, label, values) {
  for (const value of values) {
    addFillIn(collector, prefix, label, [value]);
  }
}
function applyReplacements(text2, replacements) {
  const ordered = [...replacements].sort((a, b2) => b2.from.length - a.from.length);
  let result = text2;
  for (const { from: from2, to: to3 } of ordered) {
    if (from2.length === 0 || !result.includes(from2)) continue;
    result = result.split(from2).join(to3);
  }
  return result;
}
function addPromptIds(collector, prompt) {
  addFillInEach(collector, "slack_user", "Slack user", prompt.match(SLACK_USER_ID2) ?? []);
  addFillInEach(
    collector,
    "slack_channel_id",
    "Slack channel id",
    prompt.match(SLACK_CHANNEL_ID) ?? []
  );
  addFillInEach(
    collector,
    "slack_channel",
    "Slack channel",
    prompt.match(SLACK_CHANNEL_NAME) ?? []
  );
}
function uniqueFillInLabels(fillIns) {
  const labels = [];
  const seen = /* @__PURE__ */ new Set();
  for (const fillIn of fillIns) {
    if (seen.has(fillIn.label)) continue;
    seen.add(fillIn.label);
    labels.push(fillIn.label);
  }
  return labels;
}
function slackTriggerLine(kind) {
  if (kind === "mention") return "Slack mention";
  if (kind === "keyword") return "Slack keyword";
  if (kind === "reaction") return "Slack reaction";
  return "Slack message";
}
function formatPackedContent(job, triggerLines, fillIns) {
  const parts = [job];
  if (triggerLines.length > 0) {
    parts.push("", "Fires on:", ...triggerLines.map((line) => `- ${line}`));
  }
  const askFor = uniqueFillInLabels(fillIns);
  if (askFor.length > 0) {
    parts.push("", "Ask the importing user for:", ...askFor.map((label) => `- ${label}`));
  }
  return parts.join("\n");
}
function generalizeTrigger(trigger2) {
  const collector = {
    fillIns: [],
    replacements: [],
    counts: /* @__PURE__ */ new Map(),
    values: /* @__PURE__ */ new Map()
  };
  const triggerLines = [];
  let hasCron = false;
  for (const member of triggerList(trigger2)) {
    switch (member.type) {
      case "cron":
        hasCron = true;
        triggerLines.push(`cron \`${member.schedule}\``);
        break;
      case "slack": {
        if (member.channel !== TRIGGER_ANY_SCOPE) {
          addFillIn(collector, "slack_channel", "Slack channel", [member.channel]);
        }
        if (member.match.kind === "keyword") {
          addFillIn(collector, "slack_keyword", "Slack keyword", [member.match.keyword]);
        }
        if (member.match.kind === "reaction") {
          addFillIn(collector, "slack_emoji", "Slack reaction emoji", member.match.emoji ?? []);
        }
        triggerLines.push(slackTriggerLine(member.match.kind));
        break;
      }
      case "github":
        addFillIn(collector, "github_repo", "GitHub repository", [member.repo]);
        if (member.ciBranch != null && member.ciBranch.length > 0) {
          addFillIn(collector, "github_branch", "GitHub default branch", [member.ciBranch]);
        }
        if (member.userAllowlist != null && member.userAllowlist.length > 0) {
          addFillIn(
            collector,
            "github_author_allowlist",
            "GitHub author allowlist",
            member.userAllowlist
          );
        }
        triggerLines.push(`GitHub ${member.events.join(", ")}`);
        break;
      case "microsoftTeams":
        addFillIn(collector, "teams_tenant", "Microsoft Teams tenant", [member.tenantId]);
        addFillIn(collector, "teams_team", "Microsoft Teams team", member.teamIds);
        addFillIn(collector, "teams_channel", "Microsoft Teams channel", member.channelIds);
        if (member.messageContains.length > 0) {
          addFillIn(collector, "teams_message_filter", "Microsoft Teams message filter", [
            member.messageContains
          ]);
        }
        if (member.messageContains.length > 0) {
          triggerLines.push("Microsoft Teams with message filter");
        } else {
          triggerLines.push("Microsoft Teams");
        }
        break;
      case "linear":
        addFillIn(collector, "linear_project", "Linear project", member.projectIds);
        addFillIn(collector, "linear_team", "Linear team", member.teamIds);
        if (member.event.case === "statusChanged") {
          addFillIn(collector, "linear_status", "Linear status", member.event.statusIds);
        }
        if (member.event.case === "endOfCycle") {
          addFillIn(collector, "linear_cycle", "Linear cycle", member.event.cycleIds);
        }
        triggerLines.push(`Linear ${member.event.case}`);
        break;
      case "sentry":
        addFillIn(collector, "sentry_project", "Sentry project", member.projectIds);
        triggerLines.push(`Sentry ${member.event.case}`);
        break;
      case "pagerduty":
        addFillIn(collector, "pagerduty_service", "PagerDuty service", member.serviceIds);
        triggerLines.push(`PagerDuty ${member.event.case}`);
        break;
      case "email":
        addFillIn(collector, "email_inbox", "Email inbox", [member.inbox]);
        triggerLines.push("email received");
        break;
      case "webhook":
        triggerLines.push("webhook");
        break;
    }
  }
  if (hasCron) {
    collector.fillIns.push({ id: "timezone", label: "Timezone" });
  }
  return { triggerLines, collector };
}
function overrideOrFallback(override, fallback2) {
  const trimmed = override?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : fallback2;
}
var RAW_AUTOMATION_FILE_KEYS = [
  "prompt",
  "schedule",
  "trigger",
  "triggerPresentation",
  "enabled",
  "createdAt",
  "lastRunAt"
];
function isRawAutomationFileCopy(value) {
  const parsed2 = parseJsonOrUndefined(value);
  return isUnknownRecord(parsed2) && RAW_AUTOMATION_FILE_KEYS.some((key) => key in parsed2);
}
function toPackedAutomation(source, ref) {
  const sourceName = source.name.trim().length > 0 ? source.name.trim() : source.id.trim();
  const name17 = overrideOrFallback(ref.name, sourceName);
  const slug = source.id.trim();
  const refContent = ref.content?.trim() ?? "";
  if (refContent.length === 0 || isRawAutomationFileCopy(refContent)) return null;
  const prompt = refContent;
  if (name17.length === 0 || slug.length === 0 || prompt.length === 0) return null;
  const { triggerLines, collector } = generalizeTrigger(source.trigger);
  if (triggerLines.length === 0) return null;
  addPromptIds(collector, prompt);
  const job = applyReplacements(prompt, collector.replacements).trim();
  if (job.length === 0) return null;
  const content = formatPackedContent(job, triggerLines, collector.fillIns);
  if (content.length === 0) return null;
  const fileDescription = overrideOrFallback(
    ref.description,
    overrideOrFallback(source.description, source.triggerDescription?.trim() ?? "")
  );
  const description9 = fileDescription.length > 0 ? applyReplacements(fileDescription, collector.replacements) : name17;
  return { name: name17, slug, description: description9, content };
}
function packAutomationsFromDefinitions(automations, selected) {
  const packable = automations.filter(isPackableAutomation);
  const used = /* @__PURE__ */ new Set();
  const packed = [];
  for (const ref of selected) {
    const match2 = packable.find((source) => !used.has(source) && automationMatchesRef(source, ref));
    if (match2 == null) continue;
    const entry = toPackedAutomation(match2, ref);
    if (entry == null) continue;
    used.add(match2);
    packed.push(entry);
  }
  return packed;
}
function packAutomationsIntoRecipe(recipe, automations) {
  return { ...recipe, routines: packAutomationsFromDefinitions(automations, recipe.routines) };
}
