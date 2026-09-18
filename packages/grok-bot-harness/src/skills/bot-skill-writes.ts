function botSkillSlugFromPath(filePath) {
  const match2 = /\/skills\/([^/]+)\/SKILL\.md$/.exec(filePath);
  return match2?.[1];
}
function stripSkillFile(path31) {
  return path31.replace(/\/SKILL\.md$/, "").replace(/\/+$/, "");
}
function botSkillMatchesLooseId(skill, id) {
  const wanted = stripSkillFile(id.trim());
  if (wanted.length === 0) return false;
  const folder = stripSkillFile(skill.filePath);
  if (folder === wanted || folder.endsWith(`/${wanted}`)) return true;
  const slug = botSkillSlugFromPath(skill.filePath);
  return wanted === slug || wanted === skill.name || slugifySkillName(wanted) === slug || slugifySkillName(wanted) === slugifySkillName(skill.name);
}
function resolveBotSkillWriteTarget(store, id) {
  if (id === void 0 || store === void 0) return { kind: "unlisted" };
  const skills = store.list();
  const exact = skills.find((entry) => entry.id === id);
  if (exact !== void 0 && exact.source === "plugin") {
    return isBotSkillsPluginSkill(exact) ? { kind: "bot-skill", skill: exact } : { kind: "other-plugin", skill: exact };
  }
  const loose = skills.find(
    (entry) => isBotSkillsPluginSkill(entry) && botSkillMatchesLooseId(entry, id)
  );
  if (loose !== void 0) {
    return exact?.source === "workflow" ? { kind: "bot-skill", skill: loose, personalTwin: exact } : { kind: "bot-skill", skill: loose };
  }
  if (exact !== void 0) return { kind: "unlisted" };
  const wanted = stripSkillFile(id.trim());
  const personal = skills.find(
    (entry) => entry.source === "workflow" && wanted.length > 0 && (stripSkillFile(entry.filePath) === wanted || stripSkillFile(entry.filePath).endsWith(`/${wanted}`))
  );
  return personal === void 0 ? { kind: "unlisted" } : { kind: "personal", skill: personal };
}
function otherPluginSkillRefusal(skillId) {
  return `"${skillId}" is the id of another plugin's skill, which cannot be edited, deleted, or shadowed here; only this bot's own bot-skills entries can. Save yours under a different name.`;
}
var BOT_SKILLS_IDENTITY_PATTERN = new RegExp(
  `/${PLUGIN_SKILLS_DIRNAME2}/(bot-skills(?:@[^/]*)?)/`
);
