/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/frozen-prompt-section.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_unknown_record();
var SAND_FROZEN_PROMPT_SECTIONS = [
  "timezone",
  "memory",
  "automations",
  "agent_directory",
  "mcp_instructions",
  "tool_notes"
];
var SAND_FROZEN_PROMPT_SECTIONS_WITH_TURN_NOTES = [
  "timezone",
  "memory",
  "automations",
  "agent_directory",
  "tool_notes"
];
var SAND_FROZEN_PROMPT_SECTIONS_ABSENT_IS_UNRESOLVED = [
  "timezone"
];
function isFrozenPromptSectionName(value) {
  return SAND_FROZEN_PROMPT_SECTIONS.some((name17) => name17 === value);
}
function isFrozenPromptSectionAbsenceUnresolved(name17) {
  return SAND_FROZEN_PROMPT_SECTIONS_ABSENT_IS_UNRESOLVED.some((entry) => entry === name17);
}
function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}
function parsePromptSectionSnapshot(raw) {
  if (!isUnknownRecord(raw)) return null;
  const { render: render2, compactionEpoch, announcedRender } = raw;
  if (typeof render2 !== "string" || !isFiniteNumber(compactionEpoch)) return null;
  if (announcedRender !== void 0 && typeof announcedRender !== "string") return null;
  return announcedRender === void 0 ? { render: render2, compactionEpoch } : { render: render2, compactionEpoch, announcedRender };
}
function parsePromptSectionSnapshots(raw) {
  const snapshots = {};
  if (!isUnknownRecord(raw)) return snapshots;
  for (const [name17, value] of Object.entries(raw)) {
    if (!isFrozenPromptSectionName(name17)) continue;
    const snapshot = parsePromptSectionSnapshot(value);
    if (snapshot !== null) snapshots[name17] = snapshot;
  }
  return snapshots;
}
function parsePromptSectionSnapshotsJson(raw) {
  if (raw == null) return {};
  let parsed2;
  try {
    parsed2 = JSON.parse(raw);
  } catch {
    return {};
  }
  return parsePromptSectionSnapshots(parsed2);
}
function resolveFrozenPromptSection(args) {
  const { snapshot, compactionEpoch, renderLive } = args;
  if (snapshot !== null && snapshot.compactionEpoch === compactionEpoch) {
    return { render: snapshot.render.length > 0 ? snapshot.render : null };
  }
  const live = renderLive() ?? "";
  if (args.absentIsUnresolved === true && live.length === 0) {
    const lastSeen = snapshot?.announcedRender ?? snapshot?.render ?? "";
    return {
      render: lastSeen.length > 0 ? lastSeen : null,
      snapshotToPersist: { render: lastSeen, compactionEpoch }
    };
  }
  return {
    render: live.length > 0 ? live : null,
    snapshotToPersist: { render: live, compactionEpoch }
  };
}
function resolveFrozenPromptSectionUpdate(args) {
  const { name: name17, snapshot, compactionEpoch } = args;
  if (snapshot === null || snapshot.compactionEpoch !== compactionEpoch) return null;
  const live = args.live ?? "";
  if (live.length === 0 && isFrozenPromptSectionAbsenceUnresolved(name17)) return null;
  const lastSeen = snapshot.announcedRender ?? snapshot.render;
  if (live === lastSeen) return null;
  return {
    name: name17,
    lastSeen,
    live,
    snapshotToPersist: { ...snapshot, announcedRender: live }
  };
}
var SECTION_LABELS = {
  timezone: "Time",
  memory: "Memory",
  automations: "Routines",
  agent_directory: "Teammates and groups",
  mcp_instructions: "Connector instructions",
  tool_notes: "Tool notes"
};
var MAX_LINE_DIFF_CELLS = 25e4;
function lineEdits(before, after) {
  const n = before.length;
  const m2 = after.length;
  if (n * m2 > MAX_LINE_DIFF_CELLS) return null;
  const lcs = Array.from({ length: n + 1 }, () => new Uint32Array(m2 + 1));
  for (let i2 = n - 1; i2 >= 0; i2--) {
    for (let j3 = m2 - 1; j3 >= 0; j3--) {
      lcs[i2][j3] = before[i2] === after[j3] ? lcs[i2 + 1][j3 + 1] + 1 : Math.max(lcs[i2 + 1][j3], lcs[i2][j3 + 1]);
    }
  }
  const edits = [];
  let i = 0;
  let j2 = 0;
  while (i < n && j2 < m2) {
    if (before[i] === after[j2]) {
      i += 1;
      j2 += 1;
    } else if (lcs[i + 1][j2] >= lcs[i][j2 + 1]) {
      edits.push({ kind: "-", line: before[i] });
      i += 1;
    } else {
      edits.push({ kind: "+", line: after[j2] });
      j2 += 1;
    }
  }
  for (; i < n; i++) edits.push({ kind: "-", line: before[i] });
  for (; j2 < m2; j2++) edits.push({ kind: "+", line: after[j2] });
  return edits;
}
var CHANGED_LINES_SUFFIX = " (changed lines only)";
function renderSectionUpdateBlock(update) {
  const label = SECTION_LABELS[update.name];
  if (update.live.length === 0) return `## ${label}
(This section is now empty.)`;
  if (update.lastSeen.length === 0) return `## ${label}
${update.live}`;
  const after = update.live.split("\n");
  const edits = lineEdits(update.lastSeen.split("\n"), after);
  if (edits === null || edits.length >= after.length) {
    return `## ${label}
${update.live}`;
  }
  return [
    `## ${label}${CHANGED_LINES_SUFFIX}`,
    ...edits.map((edit) => `${edit.kind} ${edit.line}`)
  ].join("\n");
}
var SAND_INSTRUCTIONS_UPDATE_TAG = "instructions_update";
var INSTRUCTIONS_UPDATE_BLOCK_RE = new RegExp(
  `<${SAND_INSTRUCTIONS_UPDATE_TAG}>(?:(?!<${SAND_INSTRUCTIONS_UPDATE_TAG}>)[\\s\\S])*?</${SAND_INSTRUCTIONS_UPDATE_TAG}>`,
  "g"
);
function stripInstructionsUpdates(text2) {
  if (!text2.includes(`<${SAND_INSTRUCTIONS_UPDATE_TAG}>`)) return text2;
  const stripped = text2.replace(INSTRUCTIONS_UPDATE_BLOCK_RE, "");
  if (stripped === text2) return text2;
  return stripped.replace(/\n{3,}/g, "\n\n").trim();
}
function renderFrozenPromptSectionUpdates(updates) {
  if (updates.length === 0) return null;
  return [
    `<${SAND_INSTRUCTIONS_UPDATE_TAG}>`,
    `These parts of your instructions changed since they were rendered. The copy above keeps the earlier version until your context is next summarized. A section marked "${CHANGED_LINES_SUFFIX.trim()}" lists only the lines added (+) or removed (-) relative to that earlier version; any other section is shown in full and replaces it:`,
    "",
    updates.map(renderSectionUpdateBlock).join("\n\n"),
    `</${SAND_INSTRUCTIONS_UPDATE_TAG}>`
  ].join("\n");
}

