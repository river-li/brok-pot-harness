var SAND_AUTO_REVIEW_INSTRUCTION_MAX_ENTRIES = 20;
var SAND_AUTO_REVIEW_INSTRUCTION_MAX_CHARS = 1e3;
var DEFAULT_SAND_AUTO_REVIEW_INSTRUCTIONS = {
  isEnabled: true,
  allowInstructions: [],
  blockInstructions: []
};
function clampInstruction(value) {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return "";
  }
  return trimmed.length <= SAND_AUTO_REVIEW_INSTRUCTION_MAX_CHARS ? trimmed : trimmed.slice(0, SAND_AUTO_REVIEW_INSTRUCTION_MAX_CHARS);
}
function normalizeInstructionList(raw) {
  if (!Array.isArray(raw)) {
    return [];
  }
  const result = [];
  const seen = /* @__PURE__ */ new Set();
  for (const item of raw) {
    if (typeof item !== "string") {
      continue;
    }
    const clamped = clampInstruction(item);
    if (clamped.length === 0 || seen.has(clamped)) {
      continue;
    }
    seen.add(clamped);
    result.push(clamped);
    if (result.length >= SAND_AUTO_REVIEW_INSTRUCTION_MAX_ENTRIES) {
      break;
    }
  }
  return result;
}
function normalizeSandAutoReviewInstructions(partial2) {
  return {
    isEnabled: partial2?.isEnabled !== false,
    allowInstructions: normalizeInstructionList(partial2?.allowInstructions),
    blockInstructions: normalizeInstructionList(partial2?.blockInstructions)
  };
}
