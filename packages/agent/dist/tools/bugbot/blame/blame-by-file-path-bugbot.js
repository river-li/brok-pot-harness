init_zod();
var blameByFilePathDuration = createHistogram("bugbot.context.get_blame_by_file_path.duration_ms", {
  description: "Latency of CursorBlame file path lookups in milliseconds",
  labelNames: []
});
var parametersSchema2 = external_exports.object({
  file_path: external_exports.string().describe("The repository-relative path of the file to look up Cursor Blame data for (as shown in the diff)."),
  start_line: external_exports.number().int().positive().optional().describe("Optional start line number to narrow the blame lookup to a specific range within the file."),
  end_line: external_exports.number().int().positive().optional().describe("Optional end line number to narrow the blame lookup to a specific range within the file. Defaults to start_line if start_line is provided.")
});
