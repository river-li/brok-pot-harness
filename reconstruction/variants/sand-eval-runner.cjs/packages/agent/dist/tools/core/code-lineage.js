/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/core/code-lineage.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_dist();
init_zod();
var logger79 = createLogger("agent/tools/ai-attribution");
var parametersSchema9 = external_exports.object({
  file_paths: external_exports.array(external_exports.string()).min(1).optional().describe("File paths to get AI attribution for. Use repository-relative git paths (for example: backend/server/src/app.ts), not absolute workspace paths."),
  start_line: external_exports.number().int().positive().optional().describe("Optional start line (1-indexed). If not provided, gets AI attribution for entire file. Applies to all files."),
  end_line: external_exports.number().int().positive().optional().describe("Optional end line (1-indexed). If not provided, gets AI attribution to end of file. Applies to all files."),
  commit_hashes: external_exports.array(external_exports.string()).min(1).optional().describe("Commit hashes to get AI attribution for. Returns AI conversation summaries for each commit."),
  output_mode: external_exports.enum(["summary", "detailed"]).optional().describe('Controls output shape and verbosity. Use "summary" for conversation-level rollups and "detailed" for per-commit/per-range output.'),
  max_commits: external_exports.number().int().positive().max(200).optional().describe("Optional cap on commits returned after filtering/de-duplication. Must be between 1 and 200."),
  include_line_ranges: external_exports.boolean().optional().describe("When false, omit detailed line ranges from attribution output.")
}).refine((data) => {
  const hasFile = (data.file_paths?.length ?? 0) > 0;
  const hasCommit = (data.commit_hashes?.length ?? 0) > 0;
  return hasFile || hasCommit;
}, {
  message: "Either file_paths or commit_hashes must be provided"
});

