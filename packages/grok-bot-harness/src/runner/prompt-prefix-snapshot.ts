/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/prompt-prefix-snapshot.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_unknown_record();
var SHA256_HEX = /^[0-9a-f]{64}$/;
function isSha256Hex(value) {
  return typeof value === "string" && SHA256_HEX.test(value);
}
function isFiniteNumber2(value) {
  return typeof value === "number" && Number.isFinite(value);
}
function parseSectionSha(value) {
  if (!isUnknownRecord(value)) return null;
  const { name: name17, sha } = value;
  if (typeof name17 !== "string" || !isSha256Hex(sha)) return null;
  return { name: name17, sha };
}
function parseSectionShas(value) {
  if (!Array.isArray(value)) return null;
  const sections = [];
  for (const entry of value) {
    const section = parseSectionSha(entry);
    if (section === null) return null;
    sections.push(section);
  }
  return sections;
}
function parseStrings(value) {
  if (!Array.isArray(value)) return null;
  const strings = [];
  for (const entry of value) {
    if (typeof entry !== "string") return null;
    strings.push(entry);
  }
  return strings;
}
var REQUEST_SOURCES = [
  "turn",
  "automation",
  "connector",
  "agent",
  "broadcast",
  "event",
  "handoff-resume",
  "voice-call",
  "background-revival",
  "web-search",
  "web-fetch",
  "generate-image",
  "idle-compaction"
];
function isRequestSource(value) {
  return REQUEST_SOURCES.some((source) => source === value);
}
function parseRequestSource(value) {
  return typeof value === "string" && isRequestSource(value) ? value : void 0;
}
function parsePromptPrefixSnapshot(raw) {
  if (!isUnknownRecord(raw)) return null;
  const { systemSha, toolsSha, toolCount, userInfoSha, compactionEpoch, recordedAtMs } = raw;
  const sections = parseSectionShas(raw.sections);
  if (!isSha256Hex(systemSha) || !isSha256Hex(toolsSha) || !isFiniteNumber2(toolCount) || !isFiniteNumber2(compactionEpoch) || !isFiniteNumber2(recordedAtMs) || sections === null) {
    return null;
  }
  if (userInfoSha !== void 0 && !isSha256Hex(userInfoSha)) return null;
  const tools = raw.tools === void 0 ? void 0 : parseSectionShas(raw.tools);
  if (tools === null) return null;
  const dynamicTools = raw.dynamicTools === void 0 ? void 0 : parseStrings(raw.dynamicTools);
  if (dynamicTools === null) return null;
  return {
    systemSha,
    toolsSha,
    toolCount,
    ...tools !== void 0 ? { tools } : {},
    ...dynamicTools !== void 0 ? { dynamicTools } : {},
    userInfoSha,
    sections,
    compactionEpoch,
    requestSource: parseRequestSource(raw.requestSource),
    recordedAtMs
  };
}
function parsePromptPrefixSnapshotJson(raw) {
  if (raw == null) return null;
  let parsed2;
  try {
    parsed2 = JSON.parse(raw);
  } catch {
    return null;
  }
  return parsePromptPrefixSnapshot(parsed2);
}

