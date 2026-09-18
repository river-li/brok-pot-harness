init_unknown_record();
function sameRecord(a, b2) {
  const left = a ?? {};
  const leftKeys = Object.keys(left);
  if (leftKeys.length !== Object.keys(b2).length) return false;
  return leftKeys.every((key) => left[key] === b2[key]);
}
function withOptionalRecords(base, records2) {
  return {
    ...base,
    ...Object.keys(records2.live).length === 0 ? {} : { live: records2.live },
    ...Object.keys(records2.announced).length === 0 ? {} : { announced: records2.announced }
  };
}
function resolveFrozenToolDescriptions(args) {
  const { snapshot, compactionEpoch, live } = args;
  if (snapshot === null || snapshot.compactionEpoch !== compactionEpoch) {
    const descriptions2 = /* @__PURE__ */ new Map();
    const pinned2 = {};
    const schemas2 = {};
    for (const [name17, tool] of live) {
      descriptions2.set(name17, tool.description);
      pinned2[name17] = tool.description;
      schemas2[name17] = tool.schemaSha;
    }
    return {
      descriptions: descriptions2,
      snapshotToPersist: { compactionEpoch, descriptions: pinned2, schemas: schemas2 }
    };
  }
  const descriptions = /* @__PURE__ */ new Map();
  const pinned = { ...snapshot.descriptions };
  const schemas = { ...snapshot.schemas ?? {} };
  const drifted = { ...snapshot.live ?? {} };
  const announced = { ...snapshot.announced ?? {} };
  let pinsChanged = false;
  for (const [name17, tool] of live) {
    const pin = pinned[name17];
    const pinnedSchema = schemas[name17];
    const schemaChanged = pinnedSchema !== void 0 && pinnedSchema !== tool.schemaSha;
    if (pin === void 0 || schemaChanged) {
      descriptions.set(name17, tool.description);
      pinned[name17] = tool.description;
      schemas[name17] = tool.schemaSha;
      delete drifted[name17];
      delete announced[name17];
      pinsChanged = true;
      continue;
    }
    if (pinnedSchema === void 0) {
      schemas[name17] = tool.schemaSha;
      pinsChanged = true;
    }
    descriptions.set(name17, pin);
    if (tool.description === pin) {
      delete drifted[name17];
    } else {
      drifted[name17] = tool.description;
    }
  }
  const driftChanged = !sameRecord(snapshot.live, drifted);
  const announcedChanged = !sameRecord(snapshot.announced, announced);
  if (!pinsChanged && !driftChanged && !announcedChanged) return { descriptions };
  return {
    descriptions,
    snapshotToPersist: withOptionalRecords(
      { compactionEpoch: snapshot.compactionEpoch, descriptions: pinned, schemas },
      { live: drifted, announced }
    )
  };
}
function resolveFrozenToolDescriptionUpdates(args) {
  const { snapshot, compactionEpoch } = args;
  if (snapshot === null || snapshot.compactionEpoch !== compactionEpoch) return { updates: [] };
  const drifted = snapshot.live ?? {};
  const previouslyAnnounced = snapshot.announced ?? {};
  const announced = { ...previouslyAnnounced };
  const updates = [];
  const tools = /* @__PURE__ */ new Set([...Object.keys(drifted), ...Object.keys(previouslyAnnounced)]);
  for (const tool of tools) {
    const pin = snapshot.descriptions[tool];
    if (pin === void 0) continue;
    const current = drifted[tool] ?? pin;
    const lastSeen = previouslyAnnounced[tool] ?? pin;
    if (current === lastSeen) continue;
    updates.push({ tool, lastSeen, live: current });
    if (current === pin) {
      delete announced[tool];
    } else {
      announced[tool] = current;
    }
  }
  if (updates.length === 0) return { updates };
  return {
    updates,
    snapshotToPersist: withOptionalRecords(
      {
        compactionEpoch: snapshot.compactionEpoch,
        descriptions: snapshot.descriptions,
        ...snapshot.schemas === void 0 ? {} : { schemas: snapshot.schemas }
      },
      { live: drifted, announced }
    )
  };
}
var CHANGED_SENTENCES_SUFFIX = " (changed sentences only)";
var SENTENCE_BOUNDARY = /(?<=[.!?])\s+(?=\S)/;
function sentencesOf(text2) {
  return text2.split("\n").flatMap((line) => line.split(SENTENCE_BOUNDARY)).filter((sentence) => sentence.trim().length > 0);
}
function renderToolUpdateBlock(update) {
  const label = `Tool ${update.tool}`;
  if (update.live.length === 0) return `## ${label}
(This tool now has no description.)`;
  const full = `## ${label}
${update.live}`;
  if (update.lastSeen.length === 0) return full;
  const edits = lineEdits(sentencesOf(update.lastSeen), sentencesOf(update.live));
  if (edits === null) return full;
  const diff = [
    `## ${label}${CHANGED_SENTENCES_SUFFIX}`,
    ...edits.map((edit) => `${edit.kind} ${edit.line}`)
  ].join("\n");
  return diff.length < full.length ? diff : full;
}
function renderFrozenToolDescriptionUpdates(updates) {
  if (updates.length === 0) return null;
  return [
    `<${SAND_INSTRUCTIONS_UPDATE_TAG}>`,
    `The descriptions of these tools changed since your tool definitions were rendered. The definitions keep the earlier text until your context is next summarized; follow the text here instead. A tool marked "${CHANGED_SENTENCES_SUFFIX.trim()}" lists only the sentences added (+) or removed (-) relative to the earlier text; any other tool is shown in full and replaces it:`,
    "",
    updates.map(renderToolUpdateBlock).join("\n\n"),
    `</${SAND_INSTRUCTIONS_UPDATE_TAG}>`
  ].join("\n");
}
