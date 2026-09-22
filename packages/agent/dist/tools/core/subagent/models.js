var DEFAULT_SUBAGENT_SLUG = SubagentComposerModelId.standard;
function createSubagentModels(models, isModelBlocked, description9) {
  const modelsBySlug = /* @__PURE__ */ new Map();
  for (const def of Object.values(models)) {
    if (isModelBlocked?.(def.slug)) {
      continue;
    }
    modelsBySlug.set(def.slug, def);
  }
  return { modelsBySlug, description: description9 };
}
function buildAvailableModelsDescription(subagentModels, includeInheritOption = false) {
  if (subagentModels.modelsBySlug.size === 0) {
    return "No alternative models are available. Subagents will inherit the parent model.";
  }
  if (subagentModels.description !== void 0) {
    return subagentModels.description;
  }
  const inheritOption = includeInheritOption ? "- inherit (default; required unless the user explicitly requested another model)\n" : "";
  const slugList = [...subagentModels.modelsBySlug.keys()].sort().map((slug) => `- ${slug}`).join("\n");
  return `If the user explicitly asks for the model of a subagent/task, you may ONLY use model slugs from this list:
${inheritOption}${slugList}

If the user isn't asking for a specific version, prefer the latest version of the model family. As an example, if the user just says "gpt" or "claude", use the latest available version of GPT or Claude.

IMPORTANT: If the user requests a model that is NOT in the list above, do NOT substitute a different model or guess. Instead, skip launching the subagent with that model and tell the user which model was unavailable and which models are available.

When speaking to the USER about which model you selected for a subagent, do NOT use the kebab-case model names unless the user requested the model using that format. Ue the same naming scheme the user used to discuss the model when they requested it.`;
}
