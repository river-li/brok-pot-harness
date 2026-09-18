init_dist3();
init_zod();
var logger76 = createLogger("tools/read-bugbot");
var parametersSchema5 = external_exports.object({
  path: external_exports.string().describe("The repository-relative path of the file to read (as shown in the diff)."),
  offset: external_exports.number().optional().describe("The 1-indexed line number to start reading from. Only provide if the file is too large to read at once."),
  limit: external_exports.number().optional().describe("The number of lines to read. Only provide if the file is too large to read at once.")
});
