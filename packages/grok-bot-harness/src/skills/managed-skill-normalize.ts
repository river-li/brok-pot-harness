function normalizeManagedSkill({
  skill
}) {
  if (!skill.enabled) return null;
  const id = skill.id.trim();
  if (!isSafeFolderId(id)) return null;
  const parsed2 = parseSkillFile(skill.content);
  const body = clampSkillBody(parsed2?.body ?? skill.content);
  if (body.trim().length === 0) return null;
  const name17 = clampSkillName(parsed2?.name != null && parsed2.name.length > 0 ? parsed2.name : id);
  if (name17.length === 0) return null;
  return {
    id,
    name: name17,
    description: clampSkillDescription(
      parsed2?.description != null && parsed2.description.length > 0 ? parsed2.description : skill.description
    ),
    body
  };
}
