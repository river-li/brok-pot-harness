var SAND_READ_AGENT_ACTIVITY_TOOL_NAME = "read_agent_activity";
var READ_AGENT_ACTIVITY_DESCRIPTION = "Read a bounded summary of what this user's other bots have been doing recently: per bot, when the user and the bot last spoke, its open todos, questions it asked the user that got no reply, and a short excerpt of the recent conversation, newest last. It sees only bots this user owns (team-shared and group bots are out of scope), only each bot's main conversation (never DM or Slack threads), and never this bot itself. It is read-only: nothing on the other bots is marked seen, answered, or touched. Use it to decide whether anything across the user's bots is worth raising.";
var readAgentActivityParameters = external_exports.object({
  since_hours: external_exports.number().optional().describe(
    `Only bots with a user or assistant message in the last N hours (default ${GROK_BOT_AGENT_ACTIVITY_DEFAULT_SINCE_HOURS}, capped at ${GROK_BOT_AGENT_ACTIVITY_MAX_SINCE_HOURS}).`
  ),
  max_agents: external_exports.number().optional().describe(
    `Most bots to summarize, most recently active first (default ${GROK_BOT_AGENT_ACTIVITY_DEFAULT_MAX_AGENTS}, capped at ${GROK_BOT_AGENT_ACTIVITY_MAX_AGENTS}).`
  ),
  excerpt_chars: external_exports.number().optional().describe(
    `Most characters of conversation excerpt per bot (default ${GROK_BOT_AGENT_ACTIVITY_DEFAULT_EXCERPT_CHARS}, capped at ${GROK_BOT_AGENT_ACTIVITY_MAX_EXCERPT_CHARS}).`
  )
});
function formatAgentActivityAge(iso, nowMs2) {
  const atMs = Date.parse(iso);
  if (Number.isNaN(atMs)) return iso;
  const elapsed = nowMs2 - atMs;
  if (elapsed < 6e4) return "just now";
  return `${formatDurationMs(elapsed, { alwaysShowSeconds: false }) ?? "0s"} ago`;
}
function renderSummary(summary, nowMs2) {
  const lines2 = [`## ${summary.name} (agent ${summary.agentId})`];
  const description9 = summary.description?.trim() ?? "";
  if (description9.length > 0) lines2.push(description9);
  const lastUser = summary.lastUserMessageAt === null ? "none" : formatAgentActivityAge(summary.lastUserMessageAt, nowMs2);
  const lastAssistant = summary.lastAssistantMessageAt === null ? "none" : formatAgentActivityAge(summary.lastAssistantMessageAt, nowMs2);
  lines2.push(`Last user message: ${lastUser}. Last assistant message: ${lastAssistant}.`);
  if (summary.openTodos.length > 0) {
    lines2.push(`Open todos (${summary.openTodos.length}):`);
    for (const todo of summary.openTodos) {
      lines2.push(`- [${todo.status}] ${todo.content}`);
    }
  }
  if (summary.pendingQuestions.length > 0) {
    lines2.push(`Pending questions (${summary.pendingQuestions.length}):`);
    for (const question of summary.pendingQuestions) {
      lines2.push(`- ${formatAgentActivityAge(question.askedAt, nowMs2)}: ${question.text}`);
    }
  }
  lines2.push(
    "Recent excerpt:",
    summary.recentExcerpt.length > 0 ? summary.recentExcerpt : "(no recent messages)"
  );
  return lines2.join("\n");
}
function renderAgentActivity(result, bounds, nowMs2) {
  if (result.kind === "unavailable") {
    return "This user owns no other bots to read.";
  }
  const scope = `last ${bounds.sinceHours}h, up to ${bounds.maxAgents} bots, ${bounds.excerptChars} excerpt chars each`;
  if (result.agents.length === 0) {
    return result.truncated ? `No activity on the ${bounds.maxAgents} bots read (${scope}). Truncated: more bots were left unread; raise max_agents (up to ${GROK_BOT_AGENT_ACTIVITY_MAX_AGENTS}) to read them.` : `No activity on the user's other bots (${scope}).`;
  }
  const count = `${result.agents.length} bot${result.agents.length === 1 ? "" : "s"}`;
  const header = `Other bots' recent activity, ${count} (${scope}). ${result.truncated ? "Truncated: more qualifying activity than shown." : "Complete."}`;
  return [header, ...result.agents.map((summary) => renderSummary(summary, nowMs2))].join("\n\n");
}
function createReadAgentActivityTool(deps) {
  return defineCommunicateTool(deps, {
    id: "READ_AGENT_ACTIVITY",
    name: SAND_READ_AGENT_ACTIVITY_TOOL_NAME,
    description: READ_AGENT_ACTIVITY_DESCRIPTION,
    parameters: readAgentActivityParameters,
    execute: async (_ctx, args) => {
      const bounds = clampAgentActivityRequest({
        sinceHours: args.since_hours,
        maxAgents: args.max_agents,
        excerptChars: args.excerpt_chars
      });
      const result = await deps.agentActivity.readOwnedAgentActivity(bounds);
      return renderAgentActivity(result, bounds, (deps.now ?? Date.now)());
    }
  });
}
