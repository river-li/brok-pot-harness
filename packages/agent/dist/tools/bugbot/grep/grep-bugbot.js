init_dist3();
init_zod();
var logger75 = createLogger("tools/grep-bugbot");
var parametersSchema3 = external_exports.object({
  pattern: external_exports.string().describe("The regular expression pattern to search for in file contents"),
  path: external_exports.string().optional().describe("File or directory to search in. Defaults to repository root.")
});
