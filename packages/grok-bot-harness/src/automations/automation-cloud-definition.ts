/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/automations/automation-cloud-definition.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function originServerHosted(listener, options2) {
  return listener.type === "origin" && options2?.originHost !== void 0 && originServerShape(listener) === "supported";
}
function originAsGithubShape(listener) {
  return { type: "github", repo: listener.repo, events: [...listener.events] };
}
var SAND_SHADOW_MARKER_PREFIX = "sand-shadow:";
function isServerSchedulable(automation, options2) {
  return !includesLocalOnlyListener(automation.trigger, options2);
}
function remoteShadowAutomationsById(response) {
  return new Map(
    response.workflows.flatMap((entry) => {
      const automation = entry.workflow;
      return !automation?.description?.startsWith(SAND_SHADOW_MARKER_PREFIX) ? [] : [[automation.automationId, automation]];
    })
  );
}
function enabledRemoteAutomationIds(response) {
  return new Set(
    response.workflows.flatMap((entry) => {
      const automation = entry.workflow;
      return automation?.enabled ? [automation.automationId] : [];
    })
  );
}
function isConverged(remoteByAutomationId, desiredByAutomationId, retainUndesired) {
  for (const [automationId, desired] of desiredByAutomationId) {
    const remote = remoteByAutomationId.get(automationId);
    if (remote === void 0 || remote.description !== desired.marker || remote.enabled !== desired.enabled) {
      return false;
    }
  }
  for (const [automationId, remote] of remoteByAutomationId) {
    if (desiredByAutomationId.has(automationId)) continue;
    if (!retainUndesired || remote.enabled) return false;
  }
  return true;
}
function slackTrigger(listener, emojiName) {
  const channels = [listener.channel];
  switch (listener.match.kind) {
    case "mention":
      return new Trigger({
        trigger: {
          case: "slackMention",
          value: new SlackMentionTrigger({ channels })
        }
      });
    case "reaction": {
      const onlyOwnerReactions = listener.match.bySelf === true;
      return emojiName === void 0 ? new Trigger({
        trigger: {
          case: "slackAnyReactionAdded",
          value: new SlackAnyReactionAddedTrigger({
            channels,
            onlyOwnerReactions
          })
        }
      }) : new Trigger({
        trigger: {
          case: "slackReactionAdded",
          value: new SlackReactionAddedTrigger({
            channels,
            emojiName,
            onlyOwnerReactions
          })
        }
      });
    }
    case "keyword":
      return new Trigger({
        trigger: {
          case: "slackTrigger",
          value: new SlackTrigger({
            channels,
            messageContains: listener.match.keyword,
            topLevelOnly: false
          })
        }
      });
    case "message":
      return new Trigger({
        trigger: {
          case: "slackTrigger",
          value: new SlackTrigger({ channels, topLevelOnly: false })
        }
      });
  }
}
function githubTrigger(listener, event, repoUrl = `https://github.com/${listener.repo}`) {
  const repos = [repoUrl];
  const userAllowlist = [...listener.userAllowlist ?? []];
  let value;
  switch (event) {
    case "pr-opened":
      value = {
        case: "pullRequest",
        value: new GitPullRequestEvent({
          repos,
          prAction: GitPullRequestAction.OPENED
        })
      };
      break;
    case "pr-pushed":
      value = {
        case: "pullRequest",
        value: new GitPullRequestEvent({
          repos,
          prAction: GitPullRequestAction.PUSHED
        })
      };
      break;
    case "pr-merged":
      value = {
        case: "pullRequest",
        value: new GitPullRequestEvent({
          repos,
          prAction: GitPullRequestAction.MERGED
        })
      };
      break;
    case "pr-closed":
      value = {
        case: "pullRequest",
        value: new GitPullRequestEvent({
          repos,
          prAction: GitPullRequestAction.CLOSED
        })
      };
      break;
    case "pr-comment":
      value = {
        case: "pullRequest",
        value: new GitPullRequestEvent({
          repos,
          prAction: GitPullRequestAction.COMMENTED
        })
      };
      break;
    case "review-requested":
      value = {
        case: "pullRequestReviewRequested",
        value: new GitPullRequestReviewRequestedEvent({ repos })
      };
      break;
    case "review-approved":
      value = {
        case: "pullRequestReview",
        value: new GitPullRequestReviewEvent({ repos, onApproved: true })
      };
      break;
    case "review-changes-requested":
      value = {
        case: "pullRequestReview",
        value: new GitPullRequestReviewEvent({
          repos,
          onChangesRequested: true
        })
      };
      break;
    case "review-commented":
      value = {
        case: "pullRequestReview",
        value: new GitPullRequestReviewEvent({ repos, onCommented: true })
      };
      break;
    case "inline-review-comment":
      value = {
        case: "pullRequestReviewComment",
        value: new GitPullRequestReviewCommentEvent({ repos })
      };
      break;
    case "review-thread-resolved":
      value = {
        case: "reviewThread",
        value: new GitReviewThreadEvent({ repos, onResolved: true })
      };
      break;
    case "review-thread-unresolved":
      value = {
        case: "reviewThread",
        value: new GitReviewThreadEvent({ repos, onUnresolved: true })
      };
      break;
    case "issue-assigned":
      value = {
        case: "issueAssigned",
        value: new GitIssueAssignedEvent({ repos })
      };
      break;
  }
  return new Trigger({
    trigger: {
      case: "git",
      value: new GitTrigger({ event: value, userAllowlist, prNumber: listener.pr })
    }
  });
}
function githubCiTrigger({
  repo,
  branch,
  prNumber,
  condition
}) {
  return new Trigger({
    trigger: {
      case: "git",
      value: new GitTrigger({
        event: {
          case: "ciCompleted",
          value: new GitCICompletedEvent({
            repos: [`https://github.com/${repo}`],
            condition,
            branch,
            prNumber
          })
        }
      })
    }
  });
}
function ciCompletionCondition(events) {
  const passed = events.includes("ci-passed");
  const failed2 = events.includes("ci-failed");
  if (passed && failed2) {
    return GitCICompletionCondition.GIT_CI_COMPLETION_CONDITION_ANY;
  }
  if (passed) return GitCICompletionCondition.GIT_CI_COMPLETION_CONDITION_SUCCESS;
  if (failed2) return GitCICompletionCondition.GIT_CI_COMPLETION_CONDITION_FAILURE;
  return null;
}
function githubCiTriggers(listener) {
  const condition = ciCompletionCondition(listener.events);
  const branch = listener.pr === void 0 ? listener.ciBranch : "";
  if (branch === void 0 || condition === null) return [];
  return [githubCiTrigger({ repo: listener.repo, branch, prNumber: listener.pr, condition })];
}
function nonCiEvents(listener) {
  return listener.events.filter(
    (event) => !isGithubCiEventKind(event)
  );
}
function listenerTriggers(listener, options2) {
  switch (listener.type) {
    case "slack": {
      const emoji3 = listener.match.kind === "reaction" ? listener.match.emoji ?? [] : [];
      return emoji3.length === 0 ? [slackTrigger(listener)] : emoji3.map((emojiName) => slackTrigger(listener, emojiName));
    }
    case "github":
      return [...githubNonCiTriggers(listener), ...githubCiTriggers(listener)];
    case "origin":
      return options2?.originHost !== void 0 && originServerHosted(listener, options2) ? originTriggers(listener, options2.originHost) : [];
    case "microsoftTeams":
    case "linear":
    case "sentry":
    case "pagerduty":
    case "email":
    case "webhook":
      return [backendCloudTrigger(listener)];
  }
}
function githubNonCiTriggers(listener, allowlistForEvent, repoUrl) {
  return nonCiEvents(listener).map(
    (event) => githubTrigger(
      allowlistForEvent === void 0 ? listener : { ...listener, userAllowlist: [...allowlistForEvent(event)] },
      event,
      repoUrl
    )
  );
}
function originTriggers(listener, originHost) {
  return githubNonCiTriggers(
    originAsGithubShape(listener),
    void 0,
    originRepoUrl({ host: originHost, repo: listener.repo })
  );
}
function unionAllowlists(existing, addition) {
  if (existing === null || addition === null) return null;
  const merged = [...existing];
  const seen = new Set(merged.map((entry) => entry.toLowerCase()));
  for (const login of addition) {
    const key = login.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(login);
  }
  return merged;
}
function groupListenerTriggers(listeners2, options2) {
  const mergedListeners = [];
  const originEventsByRepo = /* @__PURE__ */ new Map();
  const githubEventsByScope = /* @__PURE__ */ new Map();
  const githubAllowlistsByScope = /* @__PURE__ */ new Map();
  const ciEventsByRepoBranch = /* @__PURE__ */ new Map();
  for (const listener of listeners2) {
    if (originServerHosted(listener, options2)) {
      const repoKey2 = listener.repo.toLowerCase();
      const existing = originEventsByRepo.get(repoKey2);
      originEventsByRepo.set(
        repoKey2,
        existing === void 0 ? listener : {
          ...existing,
          events: [
            ...existing.events,
            ...listener.events.filter((event) => !existing.events.includes(event))
          ]
        }
      );
      continue;
    }
    if (listener.type !== "github") {
      mergedListeners.push(listener);
      continue;
    }
    const repoKey = listener.repo.toLowerCase();
    const branch = listener.pr === void 0 ? listener.ciBranch : "";
    const ciEvents = listener.events.filter(isGithubCiEventKind);
    if (branch !== void 0 && ciEvents.length > 0) {
      const branchKey = `${repoKey}\0${branch}\0${listener.pr ?? 0}`;
      const entry = ciEventsByRepoBranch.get(branchKey) ?? {
        repo: listener.repo,
        branch,
        prNumber: listener.pr,
        events: /* @__PURE__ */ new Set()
      };
      for (const event of ciEvents) {
        entry.events.add(event);
      }
      ciEventsByRepoBranch.set(branchKey, entry);
    }
    const scopeKey = `${repoKey}\0${listener.pr ?? 0}`;
    const restriction = listener.userAllowlist !== void 0 && listener.userAllowlist.length > 0 ? [...listener.userAllowlist] : null;
    const allowlistByEvent = githubAllowlistsByScope.get(scopeKey) ?? /* @__PURE__ */ new Map();
    githubAllowlistsByScope.set(scopeKey, allowlistByEvent);
    const listenerEvents = nonCiEvents(listener);
    for (const event of listenerEvents) {
      allowlistByEvent.set(
        event,
        allowlistByEvent.has(event) ? unionAllowlists(allowlistByEvent.get(event) ?? null, restriction) : restriction
      );
    }
    const existingEvents = githubEventsByScope.get(scopeKey);
    if (existingEvents !== void 0) {
      for (const event of listenerEvents) {
        existingEvents.add(event);
      }
      continue;
    }
    githubEventsByScope.set(scopeKey, new Set(listenerEvents));
    mergedListeners.push(listener);
  }
  const ciTriggers = [];
  for (const { repo, branch, prNumber, events } of ciEventsByRepoBranch.values()) {
    const condition = ciCompletionCondition([...events]);
    if (condition !== null) {
      ciTriggers.push(githubCiTrigger({ repo, branch, prNumber, condition }));
    }
  }
  const originHost = options2?.originHost;
  return [
    ...mergedListeners.flatMap((listener) => {
      if (listener.type !== "github") {
        return listenerTriggers(listener, options2);
      }
      const repoKey = listener.repo.toLowerCase();
      const scopeKey = `${repoKey}\0${listener.pr ?? 0}`;
      const allowlistByEvent = githubAllowlistsByScope.get(scopeKey);
      const merged = { ...listener, events: [...githubEventsByScope.get(scopeKey) ?? []] };
      return githubNonCiTriggers(merged, (event) => allowlistByEvent?.get(event) ?? []);
    }),
    ...ciTriggers,
    ...originHost === void 0 ? [] : [...originEventsByRepo.values()].flatMap(
      (listener) => originTriggers(listener, originHost)
    )
  ];
}
function isDirectMessageListener(listener) {
  return listener.type === "slack" && listener.channel.startsWith("@");
}
function includesDm(trigger2) {
  return triggerListeners(trigger2).some(isDirectMessageListener);
}
function localOnlyListenerKind(trigger2, options2) {
  if (includesDm(trigger2)) return "slack_dm";
  if (triggerListeners(trigger2).some(
    (listener) => listener.type === "origin" && !originServerHosted(listener, options2)
  )) {
    return "origin";
  }
  return null;
}
function includesLocalOnlyListener(trigger2, options2) {
  return localOnlyListenerKind(trigger2, options2) !== null;
}
function cronCloudTrigger({
  createdAt,
  schedule,
  timeZone
}) {
  const { schedule: expression, timeZone: pinnedZone } = splitScheduleTimeZone(schedule);
  const zone = pinnedZone ?? timeZone;
  const wall = wallClockOfInstant(createdAt, zone ?? "UTC");
  const expanded = (() => {
    switch (expression.toLowerCase()) {
      case "@hourly":
        return `${wall.minute} * * * *`;
      case "@daily":
        return `${wall.minute} ${wall.hour} * * *`;
      case "@weekly":
        return `${wall.minute} ${wall.hour} * * 0`;
      case "@monthly":
        return `${wall.minute} ${wall.hour} 1 * *`;
      case "@yearly":
      case "@annually":
        return `${wall.minute} ${wall.hour} 1 1 *`;
      default: {
        const normalized = expandAlias(expression).replace(/^@every\b/i, "@every");
        const intervalMs = parseEveryIntervalMs(normalized);
        if (intervalMs == null || normalized.includes("/")) return normalized;
        const phaseMs = intervalMs % 1e3 === 0 ? Math.floor(createdAt / 1e3) % (intervalMs / 1e3) * 1e3 : Math.floor(createdAt) % intervalMs;
        if (phaseMs === 0) return normalized;
        return intervalMs % 1e3 === 0 ? `${normalized}/${phaseMs / 1e3}s` : `${normalized}/${phaseMs}ms`;
      }
    }
  })();
  const cron = zone !== void 0 && !expanded.startsWith("@every") ? `CRON_TZ=${zone} ${expanded}` : expanded;
  return new Trigger({
    trigger: { case: "cron", value: new CronTrigger({ cron }) }
  });
}
function listenerCloudTriggers(listeners2, options2) {
  const [onlyListener] = listeners2;
  if (onlyListener === void 0) return [];
  if (listeners2.length === 1) return listenerTriggers(onlyListener, options2);
  return groupListenerTriggers(listeners2, options2);
}
function cloudTriggers(trigger2, timeZone, createdAt, options2) {
  const triggers = [
    ...triggerCronSchedules(trigger2).map(
      (schedule) => cronCloudTrigger({ createdAt, schedule, timeZone })
    ),
    ...listenerCloudTriggers(
      triggerEventTriggers(trigger2).filter((listener) => !isDirectMessageListener(listener)),
      options2
    )
  ];
  return includesLocalOnlyListener(trigger2, options2) && triggers.length === 0 ? null : triggers;
}
function sandCloudDefinition({
  agentId,
  automation,
  timeZone,
  options: options2
}) {
  const triggers = cloudTriggers(automation.trigger, timeZone, automation.createdAt, options2);
  if (triggers === null) {
    return null;
  }
  const workflow = new Workflow({
    triggers: [...triggers],
    prompts: [new Prompt({ prompt: automation.prompt })],
    ...automation.sessionId != null && automation.sessionId.length > 0 ? { grokBotSessionId: automation.sessionId } : {},
    ...automation.creatorAuthId != null && automation.creatorAuthId.length > 0 ? { grokBotCreatorAuthId: automation.creatorAuthId } : {}
  });
  const githubSubscriptionVersion = triggers.some((trigger2) => trigger2.trigger?.case === "git") ? "github-subscriptions-v1\0" : "";
  const prefix = Buffer.from(
    `${githubSubscriptionVersion}${automation.id}\0${automation.name}\0${String(automation.isEnabled)}\0`
  );
  const hash = sha256Hex(Buffer.concat([prefix, Buffer.from(workflow.toBinary())]));
  return {
    automationId: stableAutomationId({
      agentId,
      localId: automation.id
    }),
    enabled: automation.isEnabled && isServerSchedulable(automation, options2),
    hash,
    localId: automation.id,
    marker: `${SAND_SHADOW_MARKER_PREFIX}${hash}`,
    name: automation.name,
    workflow
  };
}

