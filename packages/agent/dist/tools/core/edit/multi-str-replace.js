init_zod();
var parametersSchema12 = external_exports.object({
  file_path: external_exports.string().describe("The absolute path to the file to modify"),
  edits: external_exports.array(external_exports.object({
    old_string: external_exports.string().describe("The text to replace"),
    new_string: external_exports.string().describe("The text to replace it with"),
    replace_all: external_exports.boolean().optional().describe("Replace all occurences of old_string (default false)")
  })).describe("Array of edit operations to perform sequentially on the file")
});
var parametersSchema0819 = external_exports.object({
  file_path: external_exports.string().describe("The path to the file to modify. Always specify the target file as the first argument. You can use either a relative path in the workspace or an absolute path."),
  edits: external_exports.array(external_exports.object({
    old_string: external_exports.string().describe("The text to replace"),
    new_string: external_exports.string().describe("The text to replace it with"),
    replace_all: external_exports.boolean().optional().describe("Replace all occurences of old_string (default false)")
  })).describe("Array of edit operations to perform sequentially on the file")
});
