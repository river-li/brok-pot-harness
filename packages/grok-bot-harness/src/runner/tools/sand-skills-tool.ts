init_zod();
var SAND_SKILLS_TOOL_NAME = "propose_skills";
var SAND_SKILLS_SUBAGENT_TYPE = "skills";
function isSkillsSubagentType(subagentType) {
  return subagentType === SAND_SKILLS_SUBAGENT_TYPE;
}
var SAND_SKILLS_MAX = 5;
var SAND_SKILLS_SUGGESTIONS_MAX = 2;
var SAND_SKILL_DESCRIPTION_MAX_CHARS = 120;
var SAND_SKILL_BODY_MAX_CHARS = 4e3;
var ITEM_MAX = 20;
var skillName = external_exports.string().trim().min(1).max(64).describe(
  "The skill's name in kebab-case, for example roadmap-upkeep; for a copy, exactly the name listed in your instructions."
);
var skillItem = external_exports.object({
  name: skillName,
  description: external_exports.string().trim().max(SAND_SKILL_DESCRIPTION_MAX_CHARS).optional().describe(
    'One short line on what it is for, under 80 characters, no trailing period, for example "Keep roadmap items current". Leave it out for a copy.'
  ),
  body: external_exports.string().trim().max(SAND_SKILL_BODY_MAX_CHARS).optional().describe(
    "The SKILL.md body for a new skill: a few short paragraphs or steps on how to do the job, no frontmatter. Leave it out for a copy of one of the owner's skills."
  )
});
var skillItemList = external_exports.array(skillItem).max(ITEM_MAX).default([]);
var skillsParameters = external_exports.object({
  skills: skillItemList.describe(
    `Skills the team bot should have, up to ${SAND_SKILLS_MAX.toString()}: copies of the owner's skills named exactly as listed, or new skills each with a description and a body; they come ticked on the card.`
  ),
  suggestions: skillItemList.describe(
    `Up to ${SAND_SKILLS_SUGGESTIONS_MAX.toString()} more skills the team bot may want, copies or new; they come unticked under the picks, and none is fine.`
  )
});
function slugOf(name17) {
  return name17.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function resolveItems(items, library, taken) {
  const drafts = [];
  for (const item of items) {
    const slug = slugOf(item.name);
    if (slug.length === 0) return { unusable: item.name };
    if (taken.has(slug)) continue;
    const copy = library.find((skill) => slugOf(skill.name) === slug);
    if (copy !== void 0) {
      taken.add(slug);
      drafts.push({
        name: copy.name,
        description: item.description?.length ? item.description : copy.description,
        body: copy.body
      });
      continue;
    }
    if (item.body === void 0 || item.body.length === 0) return { unknown: item.name };
    taken.add(slug);
    drafts.push({ name: slug, description: item.description ?? "", body: item.body });
  }
  return { drafts };
}
function skillsProposalOf(args, library) {
  const taken = /* @__PURE__ */ new Set();
  const skills = resolveItems(args.skills, library, taken);
  if (!("drafts" in skills)) return skills;
  const suggestions = resolveItems(args.suggestions, library, taken);
  if (!("drafts" in suggestions)) return suggestions;
  return {
    skills: skills.drafts.slice(0, SAND_SKILLS_MAX),
    suggestions: suggestions.drafts.slice(0, SAND_SKILLS_SUGGESTIONS_MAX)
  };
}
function unknownSkillMessage(name17, library) {
  const names3 = library.map((skill) => skill.name).join(", ");
  return `Nothing was proposed: "${name17}" is not one of the owner's skills${names3.length > 0 ? ` (${names3})` : ""}, so it needs a body to be a new skill. Call propose_skills again with the body, or leave it out.`;
}
function unusableSkillMessage(name17) {
  return `Nothing was proposed: "${name17}" has no letters or digits the team bot can store a skill under (a-z, 0-9, hyphens). Call propose_skills again with an ASCII name for a new skill, or leave it out.`;
}
function createSkillsTool(deps) {
  return defineCommunicateTool(deps, {
    id: "PLATFORM_ACTION",
    name: SAND_SKILLS_TOOL_NAME,
    description: `Propose the skills the team bot should have: copies of the owner's skills (by name, from the list in your instructions) and new skills (name, one-line description, SKILL.md body). The skills come ticked on the owner's card and up to ${SAND_SKILLS_SUGGESTIONS_MAX.toString()} suggestions come unticked; the owner decides on the card and their desktop writes what they tick, so this call writes nothing.`,
    parameters: skillsParameters,
    describeActivity: () => ({ detail: "propose" }),
    execute: async (_ctx, args, d) => {
      const library = d.library();
      const proposal = skillsProposalOf(args, library);
      if ("unknown" in proposal) return unknownSkillMessage(proposal.unknown, library);
      if ("unusable" in proposal) return unusableSkillMessage(proposal.unusable);
      return await d.onProposal(proposal);
    }
  });
}
