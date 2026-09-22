/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-summarization/dist/prompt-truncation.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var MAX_SUMMARIZATION_PROMPT_CHARS = 32e5;
var computeMaxMinFairAllocationsDurationMs = createHistogram("agent.summarization.compute_maxmin_fair_allocations_duration_ms", {
  description: "Wall time to compute max-min fair character allocations during prompt truncation"
});
var DEFAULT_MIN_USEFUL_CHARS = 200;
function formatOmittedMessagesPreamble(omittedCount) {
  return `[${omittedCount} message(s) omitted due to size limits; omitted content may appear anywhere in the conversation. See transcript file for full history.]

`;
}
function computeMaxMinFairAllocations(sizes, totalBudget) {
  const n = sizes.length;
  if (n === 0)
    return [];
  const allocations = new Array(n).fill(0);
  const sortedIndices = Array.from({ length: n }, (_2, i) => i);
  sortedIndices.sort((a, b2) => sizes[a] - sizes[b2]);
  let remainingBudget = totalBudget;
  let remainingCount = n;
  for (const idx of sortedIndices) {
    const fairShare = Math.floor(remainingBudget / remainingCount);
    const actualSize = sizes[idx];
    if (actualSize <= fairShare) {
      allocations[idx] = actualSize;
      remainingBudget -= actualSize;
    } else {
      allocations[idx] = fairShare;
      remainingBudget -= fairShare;
    }
    remainingCount--;
  }
  return allocations;
}
function truncatePreservingUserQuery(entry, maxChars) {
  const regex = /<user_query>[\s\S]*?<\/user_query>/g;
  const matches = [...entry.matchAll(regex)];
  if (matches.length === 0) {
    return entry.slice(0, maxChars);
  }
  const queryBlocks = matches.map((m2) => m2[0]).join("\n");
  if (queryBlocks.length >= maxChars) {
    return queryBlocks.slice(0, maxChars);
  }
  const rest = entry.replace(regex, "").replace(/\n{3,}/g, "\n\n").trim();
  if (rest.length === 0)
    return queryBlocks;
  const sep6 = "\n";
  const restBudget = maxChars - queryBlocks.length - sep6.length;
  if (restBudget <= 0)
    return queryBlocks;
  return rest.slice(0, restBudget) + sep6 + queryBlocks;
}
function truncatePromptFairly(params) {
  const { ctx, serialized, roles, suffix, charBudget, minUsefulChars = DEFAULT_MIN_USEFUL_CHARS } = params;
  const separator = "\n\n";
  const separatorOverhead = serialized.length > 1 ? (serialized.length - 1) * separator.length : 0;
  const maxPreambleText = formatOmittedMessagesPreamble(serialized.length);
  const contentBudget = Math.max(0, charBudget - suffix.length - separatorOverhead - maxPreambleText.length);
  const sizes = serialized.map((s3) => s3.length);
  const maxMinStartMs = performance.now();
  const allocations = computeMaxMinFairAllocations(sizes, contentBudget);
  computeMaxMinFairAllocationsDurationMs.histogram(ctx, performance.now() - maxMinStartMs);
  const resultParts = [];
  let droppedCount = 0;
  let truncatedCount = 0;
  let fullCount = 0;
  for (let i = 0; i < serialized.length; i++) {
    const allocation = allocations[i];
    const actualSize = sizes[i];
    if (allocation >= actualSize) {
      resultParts.push(serialized[i]);
      fullCount++;
    } else if (allocation < minUsefulChars) {
      droppedCount++;
      resultParts.push(`[omitted ${roles[i]} message, ${actualSize} chars]`);
    } else {
      const entry = serialized[i];
      const note = `
[... truncated, ${entry.length} chars]`;
      const contentAlloc = Math.max(0, allocation - note.length);
      const truncated = roles[i] === "user" ? truncatePreservingUserQuery(entry, contentAlloc) : entry.slice(0, contentAlloc);
      resultParts.push(truncated + note);
      truncatedCount++;
    }
  }
  if (fullCount + truncatedCount === 0) {
    return null;
  }
  return { resultParts, droppedCount, truncatedCount, fullCount };
}

