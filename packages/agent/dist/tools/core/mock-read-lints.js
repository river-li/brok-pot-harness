init_zod();
var parametersSchema22 = external_exports.object({
  paths: lenientArray(external_exports.array(external_exports.string()), {
    field: "paths",
    primitiveItems: true
  }).optional().describe("Optional. An array of paths to files or directories to read linter errors for. You can use either relative paths in the workspace or absolute paths. If provided, returns diagnostics for the specified files/directories only. If not provided, returns diagnostics for all files in the workspace.")
});
