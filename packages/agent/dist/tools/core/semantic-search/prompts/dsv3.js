/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/core/semantic-search/prompts/dsv3.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_zod();
var EXPLANATION_DESCRIPTION = "One sentence explanation as to why this tool is being used, and how it contributes to the goal.";
var createParametersSchema = (options2) => {
  const baseSchema = external_exports.object({
    explanation: options2.explanationRequired ? external_exports.string().describe(EXPLANATION_DESCRIPTION) : external_exports.string().optional().describe(EXPLANATION_DESCRIPTION),
    query: external_exports.string().describe("A complete question about what you want to understand. Ask as if talking to a colleague: 'How does X work?', 'What happens when Y?', 'Where is Z handled?'"),
    target_directories: external_exports.array(external_exports.string()).describe("Prefix directory paths to limit search scope (single directory only, no glob patterns)"),
    search_only_prs: external_exports.boolean().optional().describe("If true, only search pull requests and return no code results.")
  });
  if (options2.numResultsConfig?.enabled) {
    const topK = options2.numResultsConfig.topK;
    const numResultsSchema = external_exports.number().int().min(1).max(topK).describe(options2.numResultsConfig.required ? `The number of results to return. Must be between 1 and ${topK}.` : `The number of results to return. Defaults to ${topK}. Do not specify a value larger than ${topK}.`);
    return baseSchema.extend({
      num_results: options2.numResultsConfig.required ? numResultsSchema : numResultsSchema.optional()
    });
  }
  return baseSchema;
};
var createParametersSchemaForModelDsv3 = (numResultsConfig) => createParametersSchema({ explanationRequired: true, numResultsConfig });
var createParametersSchemaDsv32 = (numResultsConfig) => createParametersSchema({ explanationRequired: false, numResultsConfig });
var parametersSchemaForModelDsv3 = createParametersSchemaForModelDsv3();
var parametersSchemaDsv33 = createParametersSchemaDsv32();

