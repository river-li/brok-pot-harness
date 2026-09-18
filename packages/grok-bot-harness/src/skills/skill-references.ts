var TEACH_QUEUE_SCOPE_PATTERN = /^[a-f0-9]{64}$/;
function expandSkillReferences({
  prompt,
  richText,
  getSkill,
  timeZone
}) {
  const references = collectSkillReferences(richText);
  if (references.length === 0) return prompt;
  const blocks = [];
  for (const reference of references) {
    const skill = getSkill(reference.id);
    if (skill == null) continue;
    const block = buildSkillRunPrompt(skill, { trigger: "reference" }, timeZone);
    blocks.push(
      skill.id === LEARN_FROM_DEMONSTRATION_SKILL_ID && reference.teachQueueScope != null && TEACH_QUEUE_SCOPE_PATTERN.test(reference.teachQueueScope) ? `${block}

Teach recording queue scope: ${reference.teachQueueScope}` : block
    );
  }
  if (blocks.length === 0) return prompt;
  return prompt.length > 0 ? `${blocks.join("\n\n")}

${prompt}` : blocks.join("\n\n");
}
