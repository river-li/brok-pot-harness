var parametersSchema14 = external_exports.object({
  path: external_exports.string().describe("The absolute path to the file to modify"),
  contents: external_exports.string().describe("The contents to write to the file")
});
var parametersSchema08192 = external_exports.object({
  file_path: external_exports.string().describe("The path to the file to modify. Always specify the target file as the first argument. You can use either a relative path in the workspace or an absolute path."),
  contents: external_exports.string().describe("The contents of the file to write")
});
