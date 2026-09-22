/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/utils/event-tracking.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_dist();
var skillApplied = createCounter("skill.applied", {
  description: "Skill applications (e.g. SKILL.md reads), tagged by the catalog truncation that ran for the current turn, the skill source, and the entrypoint that triggered the application",
  labelNames: ["truncation", "skill_source", "entrypoint"]
});
function skillCatalogBudgetStrategyToTruncation(strategy) {
  if (strategy === void 0) {
    return "none";
  }
  return strategy;
}
var agentEventTrackerKey = createKey(/* @__PURE__ */ Symbol("agentEventTracker"), {
  trackUnfinishedTodos: () => {
  },
  trackUnfinishedTodosWhenCreatedTodos: () => {
  },
  trackUnfinishedTodosWhenHadUnfinishedTodosAtStart: () => {
  },
  trackSummarizationTriggered: () => {
  },
  trackSummaryLifecycle: () => {
  },
  trackPromptTokens: () => {
  },
  trackNumberOfToolCalls: () => {
  },
  trackToolCallStarted: () => {
  },
  trackToolCallResult: () => {
  },
  trackComputerUseExecution: () => {
  },
  trackRecordScreenExecution: () => {
  },
  trackLoopDetected: () => {
  },
  trackSubagentCreated: () => {
  },
  trackSubagentCompleted: () => {
  },
  trackShellSandboxResult: () => {
  },
  trackSkillUsed: () => {
  },
  trackSkillApplied: () => {
  },
  trackHookExecuted: () => {
  },
  trackSmartModeClassifierCall: () => {
  },
  trackPlanModeModelFinished: () => {
  },
  trackMcpToolCall: () => {
  },
  trackMcpToolCallResult: () => {
  }
});
var getAgentEventTracker = (ctx) => {
  return ctx.get(agentEventTrackerKey);
};
async function resolveCurrentTurnUserMessageText(ctx, stateHandler) {
  const turnRef = stateHandler?.turns.at(-1);
  if (turnRef === void 0) {
    return void 0;
  }
  const turn = await turnRef.get(ctx);
  if (turn.userMessage === void 0) {
    return void 0;
  }
  const userMessage = await turn.userMessage.get(ctx);
  if (userMessage.isSimulatedMsg === true) {
    return void 0;
  }
  return userMessage.text.unwrap(PrivacyCapability.UNSAFE_ALWAYS_ALLOWED);
}
function userMessageMentionsSkill(args) {
  const skillName2 = args.skillId.toLowerCase();
  return args.userMessageText.length > 0 && skillName2.length > 0 && args.userMessageText.toLowerCase().includes(skillName2);
}
function recordSkillApplied(ctx, input) {
  const truncation = input.entrypoint === "manually_attached" ? "bypassed" : skillCatalogBudgetStrategyToTruncation(input.stateHandler?.lastSkillCatalogBudgetStrategy);
  const tracker = getAgentEventTracker(ctx);
  tracker.trackSkillApplied(ctx, {
    skillId: input.skillId,
    skillSource: input.skillSource,
    entrypoint: input.entrypoint,
    userMessageMentionsSkill: input.entrypoint === "agent_read" && input.userMessageText !== void 0 ? userMessageMentionsSkill({
      userMessageText: input.userMessageText,
      skillId: input.skillId
    }) : void 0,
    plugin: input.plugin,
    marketplace: input.marketplace,
    pluginId: input.pluginId,
    marketplaceId: input.marketplaceId
  });
  skillApplied.increment(ctx, 1, {
    truncation,
    skill_source: input.skillSource,
    entrypoint: input.entrypoint
  });
}

