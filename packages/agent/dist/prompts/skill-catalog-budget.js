/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/prompts/skill-catalog-budget.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var INITIAL_SKILL_CATALOG_CONTEXT_FRACTION = 0.02;
var FALLBACK_AGENT_TOKEN_LIMIT = 2e5;
var TRUNCATED_DESCRIPTION_SUFFIX2 = "...";
var MIN_TRUNCATED_DESCRIPTION_LENGTH = 24;
var MAX_TRUNCATED_DESCRIPTION_LENGTH = 480;
var SHORT_DESCRIPTION_PATH_ONLY_THRESHOLD = 80;
var MAX_OMITTED_DIRECTORY_COUNT = 5;
var PROTECTED_SKILL_NAMES = /* @__PURE__ */ new Set(["canvas", "env-setup", "visualize"]);
var LOOP_PROTECTED_SKILL_NAMES = /* @__PURE__ */ new Set(["loop"]);
function applySkillCatalogBudget({ skills, agentTokenLimit, renderSection: renderSection2, renderOmittedNotice, protectLoopSkill }) {
  const uncappedSection = renderSection2(skills);
  const uncappedEstimatedTokens = estimateStringTokenCount(renderContent(uncappedSection));
  const isProtected = protectLoopSkill === true ? (skill) => isProtectedSkill(skill) || LOOP_PROTECTED_SKILL_NAMES.has(getSkillName(skill.fullPath)) : isProtectedSkill;
  const effectiveTokenLimit = agentTokenLimit !== void 0 && agentTokenLimit > 0 ? agentTokenLimit : FALLBACK_AGENT_TOKEN_LIMIT;
  const budgetTokens = Math.floor(effectiveTokenLimit * INITIAL_SKILL_CATALOG_CONTEXT_FRACTION);
  if (uncappedEstimatedTokens <= budgetTokens) {
    return {
      section: uncappedSection,
      skillItems: skills,
      retainedCount: skills.length,
      omittedCount: 0,
      omittedDirectories: [],
      renderedEstimatedTokens: uncappedEstimatedTokens,
      uncappedEstimatedTokens,
      strategy: "under_budget"
    };
  }
  const truncatedDescriptions = truncateDescriptionsToFit({
    skills,
    budgetTokens,
    renderSection: renderSection2,
    isProtected
  });
  if (truncatedDescriptions !== void 0) {
    return {
      section: truncatedDescriptions.section,
      skillItems: truncatedDescriptions.skillItems,
      retainedCount: truncatedDescriptions.skillItems.length,
      omittedCount: 0,
      omittedDirectories: [],
      renderedEstimatedTokens: truncatedDescriptions.renderedEstimatedTokens,
      uncappedEstimatedTokens,
      strategy: "shortened_descriptions"
    };
  }
  const pathOnlySkills = skills.map((skill) => isProtected(skill) ? skill : { fullPath: skill.fullPath, description: void 0 });
  const pathOnlySection = renderSection2(pathOnlySkills);
  const pathOnlyEstimatedTokens = estimateStringTokenCount(renderContent(pathOnlySection));
  if (pathOnlyEstimatedTokens <= budgetTokens) {
    return {
      section: pathOnlySection,
      skillItems: pathOnlySkills,
      retainedCount: pathOnlySkills.length,
      omittedCount: 0,
      omittedDirectories: [],
      renderedEstimatedTokens: pathOnlyEstimatedTokens,
      uncappedEstimatedTokens,
      strategy: "dropped_descriptions"
    };
  }
  return omitSkillsToFit({
    pathOnlySkills,
    allSkills: skills,
    budgetTokens,
    uncappedEstimatedTokens,
    renderSection: renderSection2,
    renderOmittedNotice,
    isProtected
  });
}
function truncateDescriptionsToFit({ skills, budgetTokens, renderSection: renderSection2, isProtected }) {
  const maxDescriptionLength = skills.reduce((longest, skill) => {
    if (isProtected(skill)) {
      return longest;
    }
    return Math.max(longest, skill.description?.length ?? 0);
  }, 0);
  if (maxDescriptionLength <= SHORT_DESCRIPTION_PATH_ONLY_THRESHOLD) {
    return void 0;
  }
  let bestFit;
  let lowerBound = MIN_TRUNCATED_DESCRIPTION_LENGTH;
  let upperBound = Math.min(maxDescriptionLength - 1, MAX_TRUNCATED_DESCRIPTION_LENGTH);
  while (lowerBound <= upperBound) {
    const midpoint = Math.floor((lowerBound + upperBound) / 2);
    const candidate = skills.map((skill) => isProtected(skill) ? skill : {
      fullPath: skill.fullPath,
      description: truncateDescription(skill.description, midpoint)
    });
    const section = renderSection2(candidate);
    const renderedEstimatedTokens = estimateStringTokenCount(renderContent(section));
    if (renderedEstimatedTokens <= budgetTokens) {
      bestFit = { section, skillItems: candidate, renderedEstimatedTokens };
      lowerBound = midpoint + 1;
    } else {
      upperBound = midpoint - 1;
    }
  }
  return bestFit;
}
function omitSkillsToFit({ pathOnlySkills, allSkills, budgetTokens, uncappedEstimatedTokens, renderSection: renderSection2, renderOmittedNotice, isProtected }) {
  const droppableIndices = [];
  for (let i = 0; i < allSkills.length; i++) {
    if (!isProtected(allSkills[i])) {
      droppableIndices.push(i);
    }
  }
  for (let retainedDroppableCount = droppableIndices.length; retainedDroppableCount >= 0; retainedDroppableCount--) {
    const retainedDroppable = new Set(droppableIndices.slice(0, retainedDroppableCount));
    const retainedSkills = [];
    const omittedSkills = [];
    for (let i = 0; i < allSkills.length; i++) {
      if (isProtected(allSkills[i]) || retainedDroppable.has(i)) {
        retainedSkills.push(pathOnlySkills[i]);
      } else {
        omittedSkills.push(allSkills[i]);
      }
    }
    const omittedDirectories = getOmittedSkillDirectories(omittedSkills);
    const cappedDirectories = omittedDirectories.slice(0, MAX_OMITTED_DIRECTORY_COUNT);
    const omittedNotice = renderOmittedNotice !== void 0 && omittedSkills.length > 0 ? renderOmittedNotice(cappedDirectories, omittedSkills.length) : void 0;
    const section = renderSection2(retainedSkills, omittedNotice);
    const renderedEstimatedTokens = estimateStringTokenCount(renderContent(section));
    if (renderedEstimatedTokens <= budgetTokens || retainedDroppableCount === 0) {
      return {
        section,
        skillItems: retainedSkills,
        retainedCount: retainedSkills.length,
        omittedCount: omittedSkills.length,
        omittedDirectories: cappedDirectories,
        renderedEstimatedTokens,
        uncappedEstimatedTokens,
        strategy: "omitted_skills"
      };
    }
  }
  throw new Error("omitSkillsToFit: loop ended without returning");
}
function getSkillName(fullPath) {
  const parts = fullPath.replace(/\\/g, "/").split("/");
  const last = parts[parts.length - 1] ?? "";
  if (last === "SKILL.md" && parts.length >= 2) {
    return parts[parts.length - 2] ?? "";
  }
  return last;
}
function isProtectedSkill(skill) {
  return PROTECTED_SKILL_NAMES.has(getSkillName(skill.fullPath));
}
function truncateDescription(description9, maxLength) {
  if (description9 === void 0 || description9.length <= maxLength) {
    return description9;
  }
  const contentLength = Math.max(0, maxLength - TRUNCATED_DESCRIPTION_SUFFIX2.length);
  return `${description9.slice(0, contentLength).trimEnd()}${TRUNCATED_DESCRIPTION_SUFFIX2}`;
}
function getOmittedSkillDirectories(skills) {
  const directories = /* @__PURE__ */ new Set();
  for (const skill of skills) {
    directories.add(getSkillDirectoryHint(skill.fullPath));
  }
  return [...directories];
}
function getSkillDirectoryHint(fullPath) {
  const normalizedPath = fullPath.replace(/\\/g, "/");
  const skillPathMarkers = [
    "/.cursor/skills/",
    "/.cursor/skills-cursor/",
    "/.agents/skills/",
    "/.claude/skills/",
    "/.codex/skills/",
    "/.grok/skills/",
    "/.claude/plugins/"
  ];
  for (const marker17 of skillPathMarkers) {
    const markerIndex = normalizedPath.indexOf(marker17);
    if (markerIndex !== -1) {
      return normalizedPath.slice(0, markerIndex + marker17.length - 1);
    }
  }
  const pluginSkillsMarker = "/.cursor/plugins/cache/";
  const pluginSkillsIndex = normalizedPath.indexOf(pluginSkillsMarker);
  if (pluginSkillsIndex !== -1) {
    const skillsIndex = normalizedPath.indexOf("/skills/", pluginSkillsIndex);
    if (skillsIndex !== -1) {
      return normalizedPath.slice(0, skillsIndex + "/skills".length);
    }
  }
  const lastSlashIndex = normalizedPath.lastIndexOf("/");
  return lastSlashIndex === -1 ? normalizedPath : normalizedPath.slice(0, lastSlashIndex);
}

