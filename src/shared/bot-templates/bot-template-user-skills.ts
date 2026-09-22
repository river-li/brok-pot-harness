init_errors();
function skillFileName(filePath) {
  const normalized = filePath.replaceAll("\\", "/");
  const slash = normalized.lastIndexOf("/");
  return slash === -1 ? normalized : normalized.slice(slash + 1);
}
function normalizeSkillRef(value) {
  return value.trim().toLowerCase();
}
function isPackableUserSkill(skill) {
  return skill.source === "workflow" && skillFileName(skill.filePath) === SKILL_FILENAME;
}
function skillMatchesRef(skill, ref) {
  const key = normalizeSkillRef(ref);
  if (key.length === 0) return false;
  return normalizeSkillRef(skill.id) === key || normalizeSkillRef(skill.name) === key;
}
function packedSkillName(skill) {
  return skill.name.trim().length > 0 ? skill.name.trim() : skill.id.trim();
}
function overrideOrFallback2(override, fallback2) {
  const trimmed = override?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : fallback2;
}
function isRawSkillFileCopy(value) {
  return value.trimStart().startsWith("---");
}
function isUnsafeUserSkill(skill) {
  const sourceRef = skill.sourceRef?.trim() ?? "";
  return sourceRef.length > 0;
}
function toPackedSkill(skill, ref) {
  if (isUnsafeUserSkill(skill)) return null;
  const name17 = packedSkillName(skill);
  const body = ref.content?.trim() ?? "";
  if (name17.length === 0 || body.length === 0 || isRawSkillFileCopy(body)) return null;
  const fileDescription = overrideOrFallback2(ref.description, skill.description.trim());
  const description9 = fileDescription.length > 0 ? fileDescription : name17;
  const content = serializeSkillFile({
    name: name17,
    description: fileDescription,
    body,
    trigger: skill.trigger ?? null
  });
  if (content.trim().length === 0) return null;
  return { name: name17, description: description9, content };
}
function packSelectedUserSkillsWithRefNames(skills, selected) {
  const packable = skills.filter(isPackableUserSkill);
  const used = /* @__PURE__ */ new Set();
  const packed = [];
  const packedNameByRefName = /* @__PURE__ */ new Map();
  for (const ref of selected) {
    const match2 = packable.find((skill) => !used.has(skill) && skillMatchesRef(skill, ref.name));
    if (match2 == null) continue;
    const packedSkill = toPackedSkill(match2, ref);
    if (packedSkill == null) continue;
    used.add(match2);
    packed.push(packedSkill);
    if (!packedNameByRefName.has(ref.name)) {
      packedNameByRefName.set(ref.name, packedSkill.name);
    }
  }
  return { packed, packedNameByRefName };
}
var BOT_TEMPLATE_GETTING_STARTED_NOT_PACKED_MESSAGE = "This template names a gettingStarted skill that was not packed. The getting-started skill must exist as one of this bot's own skills, and its skills entry must carry that skill's prose job text. Create or fix the skill, include it in skills, and call create_bot_share_json again \u2014 or omit gettingStarted to share without onboarding.";
var BotTemplateGettingStartedNotPackedError = class extends SandDomainError {
  name = "BotTemplateGettingStartedNotPackedError";
  constructor() {
    super(BOT_TEMPLATE_GETTING_STARTED_NOT_PACKED_MESSAGE);
  }
};
function packUserSkillsIntoRecipe(recipe, skills) {
  const { packed, packedNameByRefName } = packSelectedUserSkillsWithRefNames(skills, recipe.skills);
  const packedGettingStartedName = recipe.gettingStarted === void 0 ? void 0 : packedNameByRefName.get(recipe.gettingStarted.skill);
  if (recipe.gettingStarted !== void 0 && packedGettingStartedName === void 0) {
    throw new BotTemplateGettingStartedNotPackedError();
  }
  const { gettingStarted, ...withoutGettingStarted } = recipe;
  return {
    ...withoutGettingStarted,
    skills: packed,
    ...packedGettingStartedName === void 0 ? {} : { gettingStarted: { skill: packedGettingStartedName } }
  };
}
