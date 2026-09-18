var EPISODE_TURN_TEXT_CAP = 2e3;
var EPISODE_PENDING_MAX = 64;
function parsePendingEpisodeTurns(raw) {
  if (raw == null) return [];
  let parsed2;
  try {
    parsed2 = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed2)) return [];
  const entries = parsed2;
  const turns = [];
  for (const item of entries) {
    if (item == null || typeof item !== "object") continue;
    const entry = item;
    const ts2 = typeof entry.ts === "number" && Number.isFinite(entry.ts) ? entry.ts : 0;
    const user = typeof entry.user === "string" ? entry.user : "";
    const agent = typeof entry.agent === "string" ? entry.agent : "";
    if (user.length === 0 && agent.length === 0) continue;
    turns.push({ ts: ts2, user, agent });
  }
  return turns;
}
function appendPendingEpisodeTurn(pending, turn) {
  const capped = {
    ts: turn.ts,
    user: turn.user.slice(0, EPISODE_TURN_TEXT_CAP),
    agent: turn.agent.slice(0, EPISODE_TURN_TEXT_CAP)
  };
  return [...pending, capped].slice(-EPISODE_PENDING_MAX);
}
