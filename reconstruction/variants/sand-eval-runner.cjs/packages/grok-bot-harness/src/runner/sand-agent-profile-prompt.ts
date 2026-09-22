/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/sand-agent-profile-prompt.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_buffer5 = require("node:buffer");
var SAND_AGENT_PROFILE_UPDATE_MARKER = "<<SAND_AGENT_PROFILE_UPDATE:v1:";
var AGENT_PROFILE_UPDATE_BODY = "Your agent profile changed. This full update is authoritative and supersedes the Agent profile section in the system prompt and every earlier profile update in this conversation.";
function normalizeAgentProfileIdentity(profile) {
  return { name: profile.name.trim(), description: profile.description.trim() };
}
function promptedAgentProfileIdentity(profile, isDescriptionPrompted) {
  const identity = normalizeAgentProfileIdentity(profile);
  return isDescriptionPrompted ? identity : { name: identity.name, description: "" };
}
function agentProfileIdentitiesEqual(left, right) {
  return left.name === right.name && left.description === right.description;
}
function resolveAgentProfilePromptSnapshot(args) {
  if (args.snapshot != null && args.snapshot.compactionEpoch === args.compactionEpoch) {
    return args.snapshot;
  }
  return {
    version: 1,
    profileSection: args.profileSection,
    systemIdentity: args.identity,
    announcedIdentity: args.identity,
    compactionEpoch: args.compactionEpoch
  };
}
function renderAgentProfileUpdate(identity) {
  const encoded = import_node_buffer5.Buffer.from(JSON.stringify(identity)).toString("base64url");
  const name17 = identity.name.length > 0 ? identity.name : "(no name)";
  return [
    `${SAND_HIDDEN_PROMPT_MARKER}${SAND_AGENT_PROFILE_UPDATE_MARKER}${encoded}>>`,
    "<agent_profile_update>",
    AGENT_PROFILE_UPDATE_BODY,
    `Current name: ${name17}`,
    ...identity.description.length > 0 ? [`Current description: ${identity.description}`] : [],
    "Use this identity until a future conversation summary folds it into the Agent profile section.",
    "</agent_profile_update>"
  ].join("\n");
}
var AGENT_PROFILE_UPDATE_BLOCK_RE = new RegExp(
  `(?:${escapeRegExp4(SAND_HIDDEN_PROMPT_MARKER)})?${escapeRegExp4(
    SAND_AGENT_PROFILE_UPDATE_MARKER
  )}[A-Za-z0-9_-]*>>\\n?<agent_profile_update>[\\s\\S]*?</agent_profile_update>`,
  "g"
);
var AGENT_PROFILE_UPDATE_XML_RE = new RegExp(
  `<agent_profile_update>\\s*${escapeRegExp4(AGENT_PROFILE_UPDATE_BODY)}[\\s\\S]*?</agent_profile_update>`,
  "g"
);
function escapeRegExp4(text2) {
  return text2.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function stripAgentProfileUpdates(text2) {
  if (!text2.includes(SAND_AGENT_PROFILE_UPDATE_MARKER) && !text2.includes("<agent_profile_update>")) {
    return text2;
  }
  const stripped = text2.replace(AGENT_PROFILE_UPDATE_BLOCK_RE, "").replace(AGENT_PROFILE_UPDATE_XML_RE, "");
  if (stripped === text2) return text2;
  return stripped.replace(/\n{3,}/g, "\n\n").trim();
}
function parseLatestAgentProfileUpdate(text2) {
  let latest = null;
  let searchFrom = 0;
  while (true) {
    const markerAt = text2.indexOf(SAND_AGENT_PROFILE_UPDATE_MARKER, searchFrom);
    if (markerAt === -1) return latest;
    const encodedAt = markerAt + SAND_AGENT_PROFILE_UPDATE_MARKER.length;
    const markerEnd = text2.indexOf(">>", encodedAt);
    if (markerEnd === -1) return latest;
    try {
      const parsed = JSON.parse(
        import_node_buffer5.Buffer.from(text2.slice(encodedAt, markerEnd), "base64url").toString("utf8")
      );
      if (parsed !== null && typeof parsed === "object" && "name" in parsed && typeof parsed.name === "string" && "description" in parsed && typeof parsed.description === "string") {
        latest = normalizeAgentProfileIdentity({
          name: parsed.name,
          description: parsed.description
        });
      }
    } catch (error3) {
      process.stderr.write(
        `sand.agent.profile_update_marker_unparseable error_class=${errorLogTag(error3)}
`
      );
    }
    searchFrom = markerEnd + 2;
  }
}

