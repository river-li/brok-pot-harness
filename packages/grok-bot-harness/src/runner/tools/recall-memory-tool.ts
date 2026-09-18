init_zod();
var RECALL_MEMORY_DEFAULT_LIMIT = 20;
var RECALL_MEMORY_MAX_LIMIT = 50;
var RECALL_MEMORY_CHAR_BUDGET = 4e3;
var RECALL_MEMORY_SCOPES = ["agent", "user", "all"];
var recallMemoryParameters = external_exports.object({
  query: external_exports.string().trim().min(1).describe(
    "What to look for. Facts sharing distinctive words with the query rank first; when nothing overlaps (short identifiers like a ticket id or an acronym) a literal case-insensitive substring match is used instead."
  ),
  scope: external_exports.enum(RECALL_MEMORY_SCOPES).optional().catch(void 0).describe(
    'Which memory to search: "agent" is your own memory, "user" is the shared user memory every assistant of this user contributes to, "all" (default) is both.'
  ),
  limit: external_exports.number().int().min(1).max(RECALL_MEMORY_MAX_LIMIT).optional().catch(void 0).describe(
    `Maximum facts to return (default ${RECALL_MEMORY_DEFAULT_LIMIT}, max ${RECALL_MEMORY_MAX_LIMIT}).`
  )
});
var description8 = [
  "Search your durable memory for facts that are not in the memory section of your prompt: older log entries, notes that have aged out of the recent slice, and shared user facts recorded by any of this user's assistants.",
  "Read-only. Results list each fact with its date, tier (profile | log) and, for shared facts, which assistant learned it.",
  `To add or drop a fact use update_state (target "memory"). Prefer this tool over grepping memory folders.`
].join("\n");
function collectRecallMemoryCandidates(deps, scope) {
  const candidates = [];
  if (scope !== "user") {
    const store = deps.memoryStore();
    if (store != null) {
      for (const record2 of store.listMemories(MEMORY_SCAN_ALL)) {
        candidates.push({ ...record2, scope: "agent" });
      }
    }
  }
  if (scope !== "agent") {
    const userMemory = deps.userMemory();
    if (userMemory != null) {
      for (const record2 of userMemory.listAll()) {
        candidates.push({ ...record2, scope: "user" });
      }
    }
  }
  return candidates;
}
function scopeLabel(scope) {
  switch (scope) {
    case "agent":
      return "your memory";
    case "user":
      return "the shared user memory";
    case "all":
      return "your memory and the shared user memory";
  }
}
function candidateProvenance(candidate) {
  if (candidate.scope === "user") {
    const via = candidate.via?.trim() ?? "";
    return `, shared${via.length > 0 ? ` via ${via}` : ""}`;
  }
  const tag = candidate.source === void 0 ? null : agentMemorySourceTag(candidate.source);
  return tag === null ? "" : `, ${tag}`;
}
function candidateLine(candidate) {
  const tier = candidate.kind === "profile" ? "profile" : "log";
  return `- (${formatMemoryDate(candidate.createdAt)}) [${tier}${candidateProvenance(candidate)}] ${candidate.content}`;
}
function renderRecallMemoryResult(args) {
  const { query, scope, matches, searched } = args;
  if (matches.length === 0) {
    return `No facts in ${scopeLabel(scope)} match "${query}" (${searched} searched). Try different words, or a shorter literal fragment.`;
  }
  const lines2 = [
    `Top ${matches.length} ${matches.length === 1 ? "match" : "matches"} for "${query}" in ${scopeLabel(scope)} (${searched} ${searched === 1 ? "fact" : "facts"} searched):`
  ];
  let budget = RECALL_MEMORY_CHAR_BUDGET;
  let shown = 0;
  for (const match2 of matches) {
    const line = candidateLine(match2);
    if (shown > 0 && line.length > budget) break;
    lines2.push(line);
    budget -= line.length;
    shown += 1;
  }
  const omitted = matches.length - shown;
  if (omitted > 0) {
    lines2.push(`(${omitted} more matches not shown \u2014 narrow the query.)`);
  }
  return lines2.join("\n");
}
function recallMemory(deps, args) {
  const scope = args.scope ?? "all";
  const limit = Math.min(args.limit ?? RECALL_MEMORY_DEFAULT_LIMIT, RECALL_MEMORY_MAX_LIMIT);
  const candidates = collectRecallMemoryCandidates(deps, scope);
  const matches = searchMemoryRecords(args.query, candidates, limit);
  return renderRecallMemoryResult({
    query: args.query.trim(),
    scope,
    matches,
    searched: candidates.length
  });
}
function createRecallMemoryTool(deps) {
  return defineCommunicateTool(deps, {
    id: "PLATFORM_ACTION",
    name: SAND_RECALL_MEMORY_TOOL_NAME,
    description: description8,
    parameters: recallMemoryParameters,
    describeActivity: (args) => ({ detail: args.query }),
    execute: async (_ctx, args, d) => recallMemory(d, args)
  });
}
