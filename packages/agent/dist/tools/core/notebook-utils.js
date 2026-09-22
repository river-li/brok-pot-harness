/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/core/notebook-utils.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_zod();
var notebookCellOutputSchema = external_exports.object({
  output_type: external_exports.string().optional(),
  text: external_exports.union([external_exports.string(), external_exports.array(external_exports.string())]).optional(),
  data: external_exports.record(external_exports.unknown()).optional(),
  ename: external_exports.string().optional(),
  evalue: external_exports.string().optional(),
  traceback: external_exports.array(external_exports.string()).optional()
});
var notebookCellSchema = external_exports.object({
  cell_type: external_exports.enum(["code", "markdown", "raw"]),
  metadata: external_exports.record(external_exports.unknown()).optional().default({}),
  source: external_exports.union([external_exports.string(), external_exports.array(external_exports.string())]),
  execution_count: external_exports.union([external_exports.number(), external_exports.null()]).optional(),
  outputs: external_exports.array(notebookCellOutputSchema).optional(),
  id: external_exports.string().optional()
  // Cell ID required for nbformat 4.5+
});
var notebookSchema = external_exports.object({
  cells: external_exports.array(notebookCellSchema),
  metadata: external_exports.record(external_exports.unknown()).optional().default({}),
  nbformat: external_exports.number().optional(),
  nbformat_minor: external_exports.number().optional()
});
function parseNotebook(rawContent) {
  let notebookData;
  try {
    notebookData = JSON.parse(rawContent);
  } catch (_parseError) {
    return {
      success: false,
      error: "Failed to parse notebook as JSON",
      errorDetails: "The notebook file is not valid JSON"
    };
  }
  const parseResult = notebookSchema.safeParse(notebookData);
  if (!parseResult.success) {
    const errorMessages = parseResult.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ");
    return {
      success: false,
      error: `Invalid notebook structure: ${errorMessages}`,
      errorDetails: `The notebook file does not match the expected Jupyter notebook format: ${errorMessages}`
    };
  }
  return {
    success: true,
    notebook: parseResult.data
  };
}
function tryParseNotebook(rawContent) {
  const result = parseNotebook(rawContent);
  return result.success ? result.notebook : void 0;
}
function extractCellSource(cell) {
  const source = cell.source;
  if (Array.isArray(source)) {
    return source.join("");
  }
  return source || "";
}
function isJupyterNotebook(filePath) {
  return filePath.endsWith(".ipynb");
}

