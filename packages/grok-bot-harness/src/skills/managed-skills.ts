function managedSkillRoots(dataRoots) {
  return dataRoots.map((root) => import_node_path114.posix.join(root, "managed-skills", "skills"));
}
var BOX_MANAGED_SKILL_ROOTS = managedSkillRoots([
  SAND_BOX_MODEL_VISIBLE_DATA_ROOT,
  SAND_BOX_DATA_ROOT
]);
function managedSkillIdFromPath(path31, roots = BOX_MANAGED_SKILL_ROOTS) {
  if (!import_node_path114.posix.isAbsolute(path31)) return void 0;
  const normalized = import_node_path114.posix.normalize(path31);
  for (const root of roots) {
    if (!normalized.startsWith(`${root}/`)) continue;
    const [id, file2, ...rest] = normalized.slice(root.length + 1).split("/");
    if (id !== void 0 && file2 === "SKILL.md" && rest.length === 0 && isSafeFolderId(id)) {
      return id;
    }
  }
  return void 0;
}
