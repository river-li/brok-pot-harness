var LEGACY_SUBAGENT_COMPOSER_SLUG = "composer-1.5";
var BUILT_IN_COMPOSER_MODEL_ID_PATTERN = /^composer-\d+(?:\.\d+)?(?:-fast)?$/;
function isBuiltInComposerSubagentSlug(modelId) {
  return BUILT_IN_COMPOSER_MODEL_ID_PATTERN.test(canonicalSubagentComposerSlug(modelId));
}
function canonicalSubagentComposerSlug(slug) {
  return slug === LEGACY_SUBAGENT_COMPOSER_SLUG ? SubagentComposerModelId.standard : slug;
}
function isComposerSubagentDefaultId(modelId) {
  return BUILT_IN_COMPOSER_MODEL_ID_PATTERN.test(canonicalSubagentComposerSlug(modelId));
}
function orderedExploreSubagentComposerIds(defaultModelIds, parentModelId, compareModelCosts) {
  const [fastModelId, standardModelId, ...restModelIds] = defaultModelIds;
  if (fastModelId !== void 0 && standardModelId !== void 0 && compareModelCosts(fastModelId, parentModelId) > 0) {
    return [standardModelId, fastModelId, ...restModelIds];
  }
  return defaultModelIds;
}
function taskArgSelectsFastComposerTier(alias) {
  const t = alias.trim().toLowerCase();
  return t.endsWith("-fast");
}
function shouldNormalizeTaskArgModelInput(modelsBySlug) {
  return ![...modelsBySlug.keys()].some((slug) => slug !== slug.toLowerCase() || slug.includes("_"));
}
function normalizeTaskArgModelInput(requestedModel, modelsBySlug) {
  const trimmedRequestedModel = requestedModel.trim();
  if (!shouldNormalizeTaskArgModelInput(modelsBySlug)) {
    return trimmedRequestedModel;
  }
  return trimmedRequestedModel.toLowerCase().replaceAll("_", "-");
}
function lookupSlugAlias(normalizedRequestedModel, modelsBySlug, normalizeSlugAlias) {
  if (normalizeSlugAlias === void 0) {
    return void 0;
  }
  const canonicalSlug = normalizeSlugAlias(normalizedRequestedModel);
  if (canonicalSlug === normalizedRequestedModel) {
    return void 0;
  }
  return modelsBySlug.get(canonicalSlug)?.slug;
}
function resolveTaskArgToSubagentComposerSlug(requestedModel, modelsBySlug, normalizeSlugAlias) {
  const normalizedRequestedModel = normalizeTaskArgModelInput(requestedModel, modelsBySlug);
  const mapped = modelsBySlug.get(normalizedRequestedModel)?.slug ?? lookupSlugAlias(normalizedRequestedModel, modelsBySlug, normalizeSlugAlias);
  if (mapped !== void 0) {
    return canonicalSubagentComposerSlug(mapped);
  }
  const t = normalizedRequestedModel.toLowerCase();
  if (taskArgSelectsFastComposerTier(normalizedRequestedModel)) {
    return SubagentComposerModelId.fast;
  }
  if (t === "default" || t === "auto") {
    return SubagentComposerModelId.standard;
  }
  return void 0;
}
