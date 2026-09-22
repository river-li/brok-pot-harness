/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/core/edit/edit-notebook.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_zod();

// @recovered-fragment 2/2
var parametersSchema11 = external_exports.object({
  target_notebook: external_exports.string().describe("The path to the notebook file you want to edit. You can use either a relative path in the workspace or an absolute path. If an absolute path is provided, it will be preserved as is."),
  cell_idx: lenientNumber().describe("The index of the cell to edit (0-based)"),
  is_new_cell: lenientBoolean().describe("If true, a new cell will be created at the specified cell index. If false, the cell at the specified cell index will be edited."),
  cell_language: external_exports.string().describe("The language of the cell to edit. Should be STRICTLY one of these: 'python', 'markdown', 'javascript', 'typescript', 'r', 'sql', 'shell', 'raw' or 'other'."),
  old_string: external_exports.string().describe("The text to replace (must be unique within the cell, and must match the cell contents exactly, including all whitespace and indentation)."),
  new_string: external_exports.string().describe("The edited text to replace the old_string or the content for the new cell.")
});

