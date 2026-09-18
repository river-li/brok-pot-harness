var import_node_path166 = require("node:path");
init_read_exec_pb();
function createBoxDesktopSkillReader(options2) {
  let combinedContent;
  return (args) => {
    if (options2.combined() && import_node_path166.posix.isAbsolute(args.path)) {
      const path31 = import_node_path166.posix.normalize(args.path);
      const skill = options2.skills()?.list().find(
        (skill2) => skill2.source === "managed" && skill2.id === SKILLIFY_SKILL_IDS.boxDesktop && skill2.filePath === path31
      );
      if (skill !== void 0) {
        const content = combinedContent ??= serializeSkillifyHarnessSkill(boxDesktopSkill(true));
        return new ReadResult({
          result: {
            case: "success",
            value: new ReadSuccess({
              path: args.path,
              output: { case: "content", value: content },
              totalLines: content.split("\n").length,
              fileSize: BigInt(Buffer.byteLength(content, "utf8"))
            })
          }
        });
      }
    }
    return options2.fallback?.(args);
  };
}
