var MEDIA_REVIEW_SUBAGENT_NAMES = ["videoReview", "watchVideo"];
var BOX_DRIVER_SUBAGENT_NAMES = ["computerUse", "browserUse", "browserUseJev"];
function subagentKind(raw) {
  const mediaReview = MEDIA_REVIEW_SUBAGENT_NAMES.find((name17) => name17 === raw);
  if (mediaReview !== void 0) return { kind: "builtin", name: mediaReview };
  const normalized = normalizeSubagentTypeName(raw);
  const boxDriver = BOX_DRIVER_SUBAGENT_NAMES.find(
    (name17) => normalizeSubagentTypeName(name17) === normalized
  );
  if (boxDriver !== void 0) return { kind: "builtin", name: boxDriver };
  return { kind: "custom", name: raw };
}
function isBuiltinSubagent(subagentType, ...names3) {
  if (subagentType == null) return false;
  const kind = subagentKind(subagentType);
  return kind.kind === "builtin" && names3.includes(kind.name);
}
function isMediaReviewSubagent(subagentType) {
  return isBuiltinSubagent(subagentType, ...MEDIA_REVIEW_SUBAGENT_NAMES);
}
