/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/ports/agent-activity.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var GROK_BOT_AGENT_ACTIVITY_MAX_AGENTS = 20;
var GROK_BOT_AGENT_ACTIVITY_MAX_EXCERPT_CHARS = 4e3;
var GROK_BOT_AGENT_ACTIVITY_MAX_SINCE_HOURS = 168;
var GROK_BOT_AGENT_ACTIVITY_DEFAULT_SINCE_HOURS = 72;
var GROK_BOT_AGENT_ACTIVITY_DEFAULT_MAX_AGENTS = 10;
var GROK_BOT_AGENT_ACTIVITY_DEFAULT_EXCERPT_CHARS = 1500;
function clampPositiveInt(value, fallback2, cap) {
  const floored = typeof value === "number" ? Math.floor(value) : Number.NaN;
  return Number.isFinite(floored) && floored >= 1 ? Math.min(floored, cap) : fallback2;
}
function clampAgentActivityRequest(request3) {
  return {
    sinceHours: clampPositiveInt(
      request3?.sinceHours,
      GROK_BOT_AGENT_ACTIVITY_DEFAULT_SINCE_HOURS,
      GROK_BOT_AGENT_ACTIVITY_MAX_SINCE_HOURS
    ),
    maxAgents: clampPositiveInt(
      request3?.maxAgents,
      GROK_BOT_AGENT_ACTIVITY_DEFAULT_MAX_AGENTS,
      GROK_BOT_AGENT_ACTIVITY_MAX_AGENTS
    ),
    excerptChars: clampPositiveInt(
      request3?.excerptChars,
      GROK_BOT_AGENT_ACTIVITY_DEFAULT_EXCERPT_CHARS,
      GROK_BOT_AGENT_ACTIVITY_MAX_EXCERPT_CHARS
    )
  };
}

