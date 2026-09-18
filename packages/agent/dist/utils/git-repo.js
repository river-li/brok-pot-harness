var UNKNOWN_REPO_LABEL = "unknown-repo";
var UNKNOWN_BRANCH_NAME = "unknown-branch";
function getPathFromBranchInfo(repo) {
  return "path" in repo ? repo.path : repo.repoPath;
}
function getGitRepoBranchDisplayInfo(gitRepos) {
  return getBranchDisplayInfo(gitRepos);
}
function getDesignatedBranchDisplayInfo(designatedBranches) {
  return getBranchDisplayInfo(designatedBranches);
}
function getBranchDisplayInfo(repos) {
  const displays = repos.map((repo) => ({
    repoLabel: repoLabelForPrompt(repo),
    branchName: branchNameForPrompt(repo.branchName),
    baseBranch: "baseBranch" in repo ? branchNameForPrompt(repo.baseBranch) : void 0
  }));
  const hasUnknownBranch = displays.some((display) => display.branchName === UNKNOWN_BRANCH_NAME);
  return { displays, hasUnknownBranch };
}
function branchNameForPrompt(branchName) {
  const trimmed = branchName?.trim() ?? "";
  if (trimmed === "" || trimmed === "HEAD") {
    return UNKNOWN_BRANCH_NAME;
  }
  return trimmed;
}
function basenameFromPath(path31) {
  const raw = path31?.trim() ?? "";
  if (raw === "") {
    return void 0;
  }
  const parts = raw.split(/[/\\]/).filter(Boolean);
  return parts.length > 0 ? parts[parts.length - 1] : void 0;
}
function repoLabelForPrompt(repo) {
  return extractRepoNameFromGitUrl(repo.remoteUrl) ?? basenameFromPath(getPathFromBranchInfo(repo)) ?? UNKNOWN_REPO_LABEL;
}
function buildRepoPathLookup(gitRepos) {
  const lookup3 = /* @__PURE__ */ new Map();
  for (const repo of gitRepos) {
    if (repo.path) {
      const label = repoLabelForPrompt(repo);
      lookup3.set(label, repo.path);
    }
  }
  return lookup3;
}
