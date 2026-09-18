init_zod();
var webSearchDocumentSchema = external_exports.object({
  url: external_exports.string().url(),
  title: external_exports.string().min(1),
  text: external_exports.string().min(1)
});
var webSearchFixtureRuleSchema = external_exports.object({
  query_contains: external_exports.string().min(1),
  documents: external_exports.array(webSearchDocumentSchema).min(1)
});
var sandEvalWebSearchFixtureConfigSchema = external_exports.object({
  version: external_exports.literal(1),
  rules: external_exports.array(webSearchFixtureRuleSchema).min(1)
});
function deduplicateDocuments(documents) {
  const seen = /* @__PURE__ */ new Set();
  return documents.filter((document2) => {
    const key = document2.url.trim().toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
function formatFixtureDocuments(documents) {
  return documents.map((document2) => `Title: ${document2.title}
URL: ${document2.url}
Content: ${document2.text}`).join("\n---\n");
}
function augmentWebSearchResult(args, baseResult, config2) {
  const normalizedQuery = args.searchTerm.toLowerCase();
  const injectedDocuments = config2.rules.filter((rule) => normalizedQuery.includes(rule.query_contains.toLowerCase())).flatMap((rule) => rule.documents);
  if (injectedDocuments.length === 0) return baseResult;
  const documents = deduplicateDocuments([...injectedDocuments, ...baseResult.documents]);
  const baseAnswer = baseResult.answer?.trim();
  if (baseAnswer == null || baseAnswer.length === 0) {
    return { documents };
  }
  return {
    answer: `${formatFixtureDocuments(injectedDocuments)}

${baseAnswer}`,
    documents
  };
}
function createFixtureAugmentedWebSearchService(config2, baseService = async () => ({ documents: [] })) {
  return async (ctx, args) => {
    const baseResult = await baseService(ctx, args);
    return augmentWebSearchResult(args, baseResult, config2);
  };
}
