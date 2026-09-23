var SandCloudAgentCustomModeError = class extends SandCloudAgentLaunchError {
  name = "SandCloudAgentCustomModeError";
};
function isRepoSkillDescriptor(skill) {
  return (skill.sourcePath?.trim().length ?? 0) === 0;
}
function cloudAgentCustomModeCandidates(response) {
  const nonRepo = /* @__PURE__ */ new Set();
  for (const skill of response.skills) {
    const key = normalizeCustomModeName(skill.name);
    if (key.length > 0 && !isRepoSkillDescriptor(skill)) {
      nonRepo.add(key);
    }
  }
  const seen = /* @__PURE__ */ new Set();
  const candidates = [];
  for (const rawName of response.skillNames) {
    const name17 = rawName.trim();
    const key = normalizeCustomModeName(name17);
    if (key.length === 0 || nonRepo.has(key) || seen.has(key)) continue;
    seen.add(key);
    candidates.push(name17);
  }
  return candidates;
}
var CUSTOM_MODE_ID_PREFIX3 = getCustomModeId("");
var SLASH_NAME_RE = /^[A-Za-z0-9_-]+$/;
function stripCustomModePrefixes(value) {
  let name17 = value.trim();
  if (name17.startsWith(CUSTOM_MODE_ID_PREFIX3)) {
    name17 = name17.slice(CUSTOM_MODE_ID_PREFIX3.length);
  }
  if (name17.startsWith("/")) {
    name17 = name17.slice(1);
  }
  return name17.trim();
}
function customModeSlashName(value) {
  const name17 = stripCustomModePrefixes(value);
  return SLASH_NAME_RE.test(name17) ? name17 : void 0;
}
function normalizeCustomModeName(value) {
  return stripCustomModePrefixes(value).toLowerCase();
}
var REPO_SKILL_LISTING_PROVIDERS = /* @__PURE__ */ new Set(["github", "origin"]);
function canListRepoSkillsForCustomMode(repoUrl) {
  const provider = detectScmProviderForRepoUrl(repoUrl);
  return provider !== null && REPO_SKILL_LISTING_PROVIDERS.has(provider);
}
function resolveCloudAgentCustomMode(requested, candidates) {
  const key = normalizeCustomModeName(requested);
  if (key.length === 0) return void 0;
  return candidates.find((candidate) => normalizeCustomModeName(candidate) === key);
}
function describeUnknownCloudAgentCustomMode(args) {
  return `Unknown custom mode '${args.requested}'. Custom modes are the repo's skills; ${args.scope} has: ${args.candidates.join(", ")}.`;
}
function buildCloudAgentCustomModeMessageFields(slashName) {
  const name17 = slashName.trim();
  return {
    mode: AgentMode.CUSTOM,
    customModeIntent: new CustomModeIntent({
      intent: {
        case: "enter",
        value: new SubmittedCustomMode({
          id: getCustomModeId(name17.toLowerCase()),
          label: name17,
          source: CustomModeSource.REPO_SKILL,
          sourcePath: encodeUnhydratedCustomModeSourcePath(name17)
        })
      }
    })
  };
}
