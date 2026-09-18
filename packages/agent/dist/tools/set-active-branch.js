init_zod();
var parametersSchema28 = external_exports.object({
  path: external_exports.string().describe("Absolute repository path for this branch update."),
  branchName: external_exports.string().describe("New active branch name.")
});
