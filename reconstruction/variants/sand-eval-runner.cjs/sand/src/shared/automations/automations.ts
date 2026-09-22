/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/automations/automations.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var TRIGGER_ANY_SCOPE = "*";
var GITHUB_EVENT_KINDS = [
  "pr-opened",
  "pr-pushed",
  "pr-merged",
  "pr-closed",
  "review-requested",
  "review-approved",
  "review-changes-requested",
  "review-commented",
  "pr-comment",
  "inline-review-comment",
  "review-thread-resolved",
  "review-thread-unresolved",
  "issue-assigned",
  "ci-passed",
  "ci-failed"
];
function isGithubCiEventKind(kind) {
  return kind === "ci-passed" || kind === "ci-failed";
}
var ORIGIN_EVENT_KINDS = [
  "pr-opened",
  "pr-pushed",
  "pr-merged",
  "review-requested",
  "review-approved",
  "review-changes-requested",
  "review-commented",
  "pr-comment",
  "inline-review-comment",
  "review-thread-resolved",
  "review-thread-unresolved",
  "ci-passed",
  "ci-failed"
];
function isOriginCiEventKind(kind) {
  return kind === "ci-passed" || kind === "ci-failed";
}
var LINEAR_EVENT_CASES = ["issueCreated", "statusChanged", "endOfCycle"];
var LINEAR_EVENT_FILTERS = {
  issueCreated: null,
  statusChanged: "statusIds",
  endOfCycle: "cycleIds"
};
function isSandLinearEventCase(value) {
  return isKeyOf(LINEAR_EVENT_FILTERS, value);
}
var SENTRY_EVENT_CASES = [
  "issueCreated",
  "issueResolved",
  "issueAssigned",
  "issueArchived",
  "issueUnresolved",
  "issueAny"
];
var PAGERDUTY_EVENT_CASES = [
  "incidentTriggered",
  "incidentAcknowledged",
  "incidentResolved",
  "incidentEscalated",
  "incidentAny"
];
var EMAIL_TRIGGER_MAX_ADDRESS_LENGTH = 320;
var EMAIL_TRIGGER_MAX_FROM_ADDRESSES = 50;
function emailTriggerRequiresAuthPass(trigger) {
  return trigger.requireAuthPass !== false;
}
var AUTOMATION_ID_PATTERN = /^[a-z0-9][a-z0-9-]{0,63}$/;
var TRIGGER_MAX_GROUP_LISTENERS = 8;
var TRIGGER_MAX_REACTION_EMOJI = 8;
var REACTION_EMOJI_PATTERN = /^[a-z0-9_+-]+$/;
function normalizeReactionEmoji(raw) {
  const bare = raw.trim().replace(/^:+|:+$/g, "");
  return (bare.split("::")[0] ?? bare).trim().toLowerCase();
}
var GITHUB_REPO_PATTERN = /^[^\s/]+\/[^\s/]+$/;
function isValidGithubRepo(repo) {
  return GITHUB_REPO_PATTERN.test(repo);
}
function isValidOriginRepo(repo) {
  return GITHUB_REPO_PATTERN.test(repo);
}
var GIT_BRANCH_INVALID_PATTERN = /[\s~^:?*[\\]|^[-/]|\/$|\.\.|@\{/;
function isValidGitBranch(branch) {
  return branch.length > 0 && !GIT_BRANCH_INVALID_PATTERN.test(branch);
}
function cronTrigger(schedule) {
  return { type: "cron", schedule };
}
function triggerList(trigger) {
  return trigger.type === "group" ? trigger.listeners : [trigger];
}
function triggerFromList(members) {
  const [first, second, ...rest] = members;
  if (first == null) return null;
  if (second == null) return first;
  return { type: "group", listeners: [first, second, ...rest] };
}
function triggerListeners(trigger) {
  return triggerList(trigger).filter(
    (member) => member.type === "slack" || member.type === "github" || member.type === "origin"
  );
}
function hasTriggerOfType(trigger, type2) {
  return triggerList(trigger).some((member) => member.type === type2);
}
function triggerCronSchedules(trigger) {
  return triggerList(trigger).flatMap(
    (member) => member.type === "cron" ? [member.schedule] : []
  );
}
function triggerSchedule(trigger) {
  return triggerCronSchedules(trigger)[0] ?? null;
}
function describeSlackScope(channel) {
  if (channel === TRIGGER_ANY_SCOPE) return "anywhere on Slack";
  return `in ${channel}`;
}
function describeSlackListener(listener) {
  const scope = describeSlackScope(listener.channel);
  switch (listener.match.kind) {
    case "mention":
      return `When @mentioned ${scope}`;
    case "keyword":
      return `When "${listener.match.keyword}" is mentioned ${scope}`;
    case "reaction": {
      const emoji2 = listener.match.emoji ?? [];
      const names3 = joinWithOr(emoji2.map((name17) => `:${name17}:`));
      if (listener.match.bySelf === true) {
        return `When you react${emoji2.length > 0 ? ` ${names3}` : ""} ${scope}`;
      }
      return `On ${emoji2.length > 0 ? names3 : "a reaction"} ${scope}`;
    }
    case "message":
      return `On any message ${scope}`;
  }
}
var GITHUB_EVENT_PHRASES = [
  "a PR opens",
  "a PR is updated",
  "a PR merges",
  "a PR closes",
  "a review is requested",
  "a review approves a PR",
  "a review requests changes",
  "a review comments on a PR",
  "a PR comment lands",
  "an inline review comment lands",
  "a review thread is resolved",
  "a review thread is reopened",
  "an issue is assigned",
  "CI passes",
  "CI fails"
];
function githubEventPhrase(kind) {
  return GITHUB_EVENT_PHRASES[GITHUB_EVENT_KINDS.indexOf(kind)] ?? "";
}
var ORIGIN_EVENT_PHRASES = {
  "pr-opened": "a PR opens",
  "pr-pushed": "a PR is updated",
  "pr-merged": "a PR merges",
  "review-requested": "a review is requested",
  "review-approved": "a review approves a PR",
  "review-changes-requested": "a review requests changes",
  "review-commented": "a review comments on a PR",
  "pr-comment": "a PR comment lands",
  "inline-review-comment": "an inline review comment lands",
  "review-thread-resolved": "a review thread is resolved",
  "review-thread-unresolved": "a review thread is reopened",
  "ci-passed": "CI passes",
  "ci-failed": "CI fails"
};
function joinWithOr(parts) {
  if (parts.length <= 1) return parts[0] ?? "";
  if (parts.length === 2) return `${parts[0]} or ${parts[1]}`;
  return `${parts.slice(0, -1).join(", ")}, or ${parts[parts.length - 1]}`;
}
function describeGithubListener(listener) {
  const phrases = listener.events.map((kind) => {
    const phrase = githubEventPhrase(kind);
    return isGithubCiEventKind(kind) && listener.ciBranch != null ? `${phrase} on ${listener.ciBranch}` : phrase;
  });
  const base = `When ${joinWithOr(phrases)} in ${listener.repo}${listener.pr != null ? ` on PR #${listener.pr}` : ""}`;
  if (listener.userAllowlist == null || listener.userAllowlist.length === 0) {
    return base;
  }
  const logins = joinWithOr(
    listener.userAllowlist.map((login) => login.startsWith("@") ? login : `@${login}`)
  );
  return `${base} (by ${logins})`;
}
function describeOriginListener(listener) {
  const phrases = listener.events.map((kind) => ORIGIN_EVENT_PHRASES[kind]);
  const base = `When ${joinWithOr(phrases)} in ${listener.repo}${listener.pr != null ? ` on PR #${listener.pr}` : ""}`;
  if (listener.userAllowlist == null || listener.userAllowlist.length === 0) {
    return base;
  }
  return `${base} (by ${joinWithOr(listener.userAllowlist)})`;
}
var LINEAR_EVENT_PHRASES = {
  issueCreated: "a Linear issue is created",
  statusChanged: "a Linear issue changes status",
  endOfCycle: "a Linear cycle ends"
};
var SENTRY_EVENT_PHRASES = {
  issueCreated: "a Sentry issue is created",
  issueResolved: "a Sentry issue is resolved",
  issueAssigned: "a Sentry issue is assigned",
  issueArchived: "a Sentry issue is archived",
  issueUnresolved: "a Sentry issue becomes unresolved",
  issueAny: "a Sentry issue changes"
};
var PAGERDUTY_EVENT_PHRASES = {
  incidentTriggered: "a PagerDuty incident is triggered",
  incidentAcknowledged: "a PagerDuty incident is acknowledged",
  incidentResolved: "a PagerDuty incident is resolved",
  incidentEscalated: "a PagerDuty incident is escalated",
  incidentAny: "a PagerDuty incident changes"
};
function describeListener(listener) {
  switch (listener.type) {
    case "slack":
      return describeSlackListener(listener);
    case "github":
      return describeGithubListener(listener);
    case "origin":
      return describeOriginListener(listener);
    case "microsoftTeams":
      return listener.messageContains === "" ? "On a Microsoft Teams message" : `When a Microsoft Teams message matches "${listener.messageContains}"`;
    case "linear":
      return `When ${LINEAR_EVENT_PHRASES[listener.event.case]}`;
    case "sentry":
      return `When ${SENTRY_EVENT_PHRASES[listener.event.case]}`;
    case "pagerduty":
      return `When ${PAGERDUTY_EVENT_PHRASES[listener.event.case]}`;
    case "email": {
      const from2 = listener.from ?? [];
      const base = from2.length === 0 ? `When email arrives at ${listener.inbox}` : `When email from ${joinWithOr(from2)} arrives at ${listener.inbox}`;
      return emailTriggerRequiresAuthPass(listener) ? base : `${base}, including unauthenticated senders`;
    }
    case "webhook":
      return "When a webhook fires";
  }
}
var LISTENER_INTEGRATION_PLATFORMS = ["github", "origin", "slack"];
var SCM_CONNECT_ONLY_PLATFORMS = ["gitlab", "bitbucket", "azure-devops"];
var CONNECT_CARD_PLATFORMS = [
  ...LISTENER_INTEGRATION_PLATFORMS,
  ...SCM_CONNECT_ONLY_PLATFORMS
];
var AUTOMATION_WAKE_CUE = "[routine]";

