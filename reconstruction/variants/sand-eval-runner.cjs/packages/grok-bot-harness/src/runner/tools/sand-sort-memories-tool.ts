/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/tools/sand-sort-memories-tool.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
var import_node_crypto40 = require("node:crypto");
init_zod();

// @recovered-fragment 2/2
var SAND_SORT_MEMORIES_TOOL_NAME = "sort_memories";
var SAND_SORT_MEMORIES_SUBAGENT_TYPE = "sortMemories";
function isSortMemoriesSubagentType(subagentType) {
  return subagentType === SAND_SORT_MEMORIES_SUBAGENT_TYPE;
}
var LIST_LIMIT = 5e3;
var SORT_MEMORIES_TEAM_BATCH = 20;
var SORT_MEMORIES_TITLE_CHARS = 60;
var SORT_MEMORIES_THEME_CHARS = 40;
var SORT_MEMORIES_THEMES = 5;
var EXAMPLES_PER_BUCKET = 3;
var EXAMPLE_CHARS = 80;
var factText = external_exports.string().trim().min(1);
var factList = external_exports.array(factText).max(500).default([]);
var teamFactList = external_exports.array(
  external_exports.object({
    text: factText,
    title: external_exports.string().trim().optional().describe(
      `What the fact is, in a few words (under ${SORT_MEMORIES_TITLE_CHARS} characters); the card shows it above the full text.`
    ),
    theme: external_exports.string().trim().optional().describe(
      `The topic this fact belongs to, in two or three words such as "Deploy process" or "Team and roles", the same spelling for every fact in it; at most ${SORT_MEMORIES_THEMES} themes in one proposal. The card shows one row per theme.`
    ),
    borderline: external_exports.boolean().optional().describe(
      "True when you are unsure the team needs this fact; the card then leaves it unticked for the owner to tick."
    )
  })
).max(500).default([]);
var sortMemoriesParameters = external_exports.object({
  toTeam: teamFactList.describe(
    `Private facts (scope conversation) the whole team should know, the most useful for the team first and at most ${SORT_MEMORIES_TEAM_BATCH}, each as its text reads in your memory; they move into team memory (scope agent). Facts not listed stay where they are.`
  ),
  moreForTeam: factList.describe(
    `Private facts the team should also know that did not fit in the ${SORT_MEMORIES_TEAM_BATCH} most useful, each as its text reads in your memory; they stay put for now and the card says how many wait for a later review.`
  ),
  toPrivate: factList.describe(
    "Team facts (scope agent) that are really about the owner, each as its text reads in your memory; they move back into the owner's private memory."
  ),
  confirmation: external_exports.string().trim().min(1).optional().describe(
    "The code from the owner's answer to the question this tool asked. Omit to propose; pass it, with the same two lists, to apply."
  )
});
function sortMemoriesConfirmationCode({
  toTeam,
  toPrivate
}) {
  const ids = (records2) => records2.map((r) => r.id).sort();
  return (0, import_node_crypto40.createHash)("sha1").update(JSON.stringify([ids(toTeam), ids(toPrivate)])).digest("hex").slice(0, 10);
}
function annotated(found, named) {
  const byName = new Map(
    named.flatMap((fact) => [[memoryIdFor(fact.text), fact], [fact.text, fact]])
  );
  const spellings = themesOf(named);
  return found.map((record2) => {
    const fact = byName.get(record2.id);
    const title = fact?.title ?? "";
    const theme = fact?.theme ?? "";
    return {
      ...record2,
      title: clampLine(title.length > 0 ? title : record2.content, SORT_MEMORIES_TITLE_CHARS),
      theme: clampLine(spellings.get(theme.toLowerCase()) ?? theme, SORT_MEMORIES_THEME_CHARS),
      borderline: fact?.borderline === true
    };
  });
}
function themesOf(named) {
  const spellings = /* @__PURE__ */ new Map();
  for (const fact of named) {
    const theme = fact.theme ?? "";
    if (theme.length > 0 && !spellings.has(theme.toLowerCase())) {
      spellings.set(theme.toLowerCase(), theme);
    }
  }
  return spellings;
}
function quote(record2) {
  return `\u201C${clampLine(record2.content, EXAMPLE_CHARS)}\u201D`;
}
function bucketLine(heading, records2, shown) {
  if (records2.length === 0) return void 0;
  const examples = records2.slice(0, shown).map(quote);
  const more = records2.length - examples.length;
  return `${heading} (${records2.length}): ${examples.join(" \xB7 ")}${more > 0 ? ` and ${more} more` : ""}`;
}
function indexFacts(store) {
  return new Map(store.listMemories(LIST_LIMIT).map((record2) => [record2.id, record2]));
}
function resolve11({
  facts,
  from: from2,
  settledIn
}) {
  const source = indexFacts(from2);
  const destination = settledIn === void 0 ? void 0 : indexFacts(settledIn);
  const found = /* @__PURE__ */ new Map();
  const settled = /* @__PURE__ */ new Map();
  const missing = [];
  for (const fact of facts) {
    const byText = memoryIdFor(fact);
    const id = source.has(byText) || destination?.has(byText) === true ? byText : fact;
    const record2 = source.get(id);
    const moved = destination?.get(id);
    if (record2 !== void 0) found.set(id, record2);
    else if (moved !== void 0) settled.set(id, moved);
    else missing.push(fact);
  }
  return { found: [...found.values()], settled: [...settled.values()], missing };
}
async function move({
  records: records2,
  from: from2,
  to: to3
}) {
  const held = new Set(to3.listMemories(LIST_LIMIT).map((record2) => record2.id));
  const copied = [];
  for (const record2 of records2) {
    if (held.has(record2.id) || to3.addMemory(record2.content, record2.createdAt, record2.kind) !== null) {
      copied.push(record2);
    }
  }
  try {
    await to3.flush?.();
  } catch (error3) {
    return {
      moved: 0,
      refused: records2.length,
      duplicated: 0,
      failure: errorMessage(error3)
    };
  }
  for (const record2 of copied) from2.removeMemoryByContent(record2.content);
  const outcome = { moved: copied.length, refused: records2.length - copied.length };
  try {
    await from2.flush?.();
  } catch (error3) {
    return { ...outcome, duplicated: copied.length, failure: errorMessage(error3) };
  }
  return { ...outcome, duplicated: 0 };
}
function createSortMemoriesTool(deps) {
  return defineCommunicateTool(deps, {
    id: "PLATFORM_ACTION",
    name: SAND_SORT_MEMORIES_TOOL_NAME,
    description: "Propose which of your memories should move between the owner's private memory (scope conversation, read on this conversation alone) and team memory (scope agent, read by every teammate's session), then apply it once the owner agrees. Name each fact by its text as it reads in your memory or in RecallMemory. Call it first with toTeam and/or toPrivate and no confirmation: it puts a card in the chat with the facts and Share and Keep private buttons, and ends your turn. The card is the whole proposal, so send no message describing it before or after. Their answer arrives as the next message; if it carries a confirmation code, call again with the same lists and that code to move the facts. If they keep things private, leave memory alone and don't re-ask. Nothing moves without the code, so never guess it.",
    parameters: sortMemoriesParameters,
    describeActivity: (args) => ({
      detail: args.confirmation === void 0 ? "propose" : "apply"
    }),
    execute: async (_ctx, args, d) => {
      const scopes = d.memoryScopes();
      if (scopes?.conversation == null || scopes.agentWide == null) {
        return "Memory scopes are not available on this turn, so nothing can be sorted.";
      }
      const sink = d.onProposal;
      if (sink !== void 0 && args.confirmation !== void 0) {
        return "Applying is the owner's call from the card, so nothing moved; this turn only proposes.";
      }
      if (sink !== void 0 && args.toTeam.length === 0) {
        return "Nothing to propose: every fact is already private, so only toTeam counts here. List the facts that should become team memory, each as its text reads in your memory, or end the turn if none should.";
      }
      if (args.toTeam.length === 0 && args.toPrivate.length === 0) {
        return "Nothing to sort: list the facts to move to team memory in toTeam and the facts to move back to private memory in toPrivate, each as its text reads in your memory.";
      }
      if (args.toTeam.length > SORT_MEMORIES_TEAM_BATCH) {
        return `Propose at most ${SORT_MEMORIES_TEAM_BATCH} facts for team memory at a time, the most useful for the team first, so the owner sees each one before agreeing; list the rest in moreForTeam so the card can say how many wait for a later review.`;
      }
      if (themesOf(args.toTeam).size > SORT_MEMORIES_THEMES) {
        return `Use at most ${SORT_MEMORIES_THEMES} themes across the proposal, spelled the same way for every fact in them, so the card stays short; merge the smaller ones and propose again.`;
      }
      const promote = resolve11({
        facts: args.toTeam.map((fact) => fact.text),
        from: scopes.conversation,
        settledIn: scopes.agentWide
      });
      const later = resolve11({
        facts: args.confirmation === void 0 ? args.moreForTeam : [],
        from: scopes.conversation,
        settledIn: scopes.agentWide
      });
      const demote = resolve11({
        facts: sink === void 0 ? args.toPrivate : [],
        from: scopes.agentWide,
        settledIn: scopes.conversation
      });
      const missing = [...promote.missing, ...later.missing, ...demote.missing];
      if (missing.length > 0) {
        return `These facts are not where you said they are, so nothing was proposed or moved: ${missing.map((fact) => `\u201C${fact}\u201D`).join(", ")}. toTeam takes private facts and toPrivate team facts, each as its text reads in your memory; check them with RecallMemory.`;
      }
      if (args.confirmation === void 0 && promote.found.length + demote.found.length === 0) {
        return `Nothing to propose: ${promote.settled.length > 0 ? "these facts are already team memory" : "these facts are already private"}, so the owner has nothing to decide. Leave memory alone and don't re-ask.`;
      }
      const code = sortMemoriesConfirmationCode({
        toTeam: sink === void 0 ? [...promote.found, ...promote.settled] : promote.found,
        toPrivate: [...demote.found, ...demote.settled]
      });
      const onCard = new Set(promote.found.map((record2) => record2.id));
      const moreForTeam = later.found.filter((record2) => !onCard.has(record2.id)).length;
      if (sink !== void 0) {
        return await sink({
          toTeam: annotated(promote.found, args.toTeam),
          moreForTeam,
          keptPrivate: scopes.conversation.listMemories(LIST_LIMIT).length - promote.found.length - moreForTeam,
          code
        });
      }
      if (args.confirmation === void 0) {
        if (d.isAwaitingUserSelection()) {
          return "This turn is already waiting on the owner's answer to a question, so the split was not shown. Wait for their reply, then propose it again.";
        }
        const summary = [
          bucketLine("Team", promote.found, SORT_MEMORIES_TEAM_BATCH),
          bucketLine("Just you", demote.found, EXAMPLES_PER_BUCKET),
          moreForTeam > 0 ? `${moreForTeam} more for the team wait for a later pass` : void 0
        ].filter((line) => line !== void 0);
        d.onSendMessage(
          {
            type: "widget",
            widget: {
              prompt: "Share these with the team?",
              helpText: summary.join(" \u2014 "),
              options: [
                { label: "Share", value: `Share these with the team ${code}`, style: "primary" },
                { label: "Keep private", value: "Keep them private" }
              ]
            }
          },
          Date.now()
        );
        return "The card is in the chat for the owner to answer, so this turn ends here with no message about it; their answer arrives as the next message. If it carries a confirmation code, call this tool again with the same lists and that code to apply; if they keep things private, leave memory alone.";
      }
      if (args.confirmation !== code) {
        return "That confirmation code does not match these lists, so nothing moved. Propose the split again and use the code from the owner's new answer.";
      }
      const promoted = await move({
        records: promote.found,
        from: scopes.conversation,
        to: scopes.agentWide
      });
      const demoted = await move({
        records: demote.found,
        from: scopes.agentWide,
        to: scopes.conversation
      });
      const refused = promoted.refused + demoted.refused;
      const duplicated = promoted.duplicated + demoted.duplicated;
      const settled = promote.settled.length + demote.settled.length;
      const failure = promoted.failure ?? demoted.failure;
      return `Moved ${promoted.moved} fact${promoted.moved === 1 ? "" : "s"} to team memory and ${demoted.moved} back to private memory${settled > 0 ? `; ${settled} had already moved` : ""}${refused > 0 ? `; ${refused} could not be written and stayed put` : ""}${duplicated > 0 ? `; ${duplicated} still also show where they were until that removal is retried` : ""}${failure === void 0 ? "" : ` (${failure})`}. ${refused + duplicated > 0 ? "Tell the owner in one line which facts did not settle." : "The card already told the owner, so send no message about the memories."}`;
    }
  });
}

