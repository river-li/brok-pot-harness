/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/utils/cursor-rule-matching.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_path81 = require("node:path");
init_cursor_rules_pb();
init_dist3();
var SEP2 = "/";
var normalizePath2 = (value) => {
  const normalized = import_node_path81.posix.normalize(normalizeToUnixPath(value));
  if (normalized === SEP2) {
    return SEP2;
  }
  return normalized.replace(/\/+$/, "");
};
function getRuleDir(mdcPath) {
  const normalizedPath = normalizeToUnixPath(mdcPath);
  const literalRuleDir = import_node_path81.posix.normalize(import_node_path81.posix.dirname(normalizedPath));
  const segments = literalRuleDir.split(SEP2);
  for (let i = segments.length - 2; i >= 0; i--) {
    if (segments[i] === ".cursor" && segments[i + 1] === "rules") {
      const parentSegments = segments.slice(0, i);
      if (parentSegments.length === 0) {
        return SEP2;
      }
      return parentSegments.join(SEP2);
    }
  }
  return literalRuleDir;
}
function normalizeWorkspaceRoot(workspaceRoot) {
  return normalizePath2(workspaceRoot);
}
function isNestedGlobalRule(rule, workspacePaths) {
  if (rule.type?.type.case !== "global" || !rule.fullPath) {
    return false;
  }
  const ruleDir = normalizePath2(getRuleDir(rule.fullPath));
  const containingWorkspaceRoot = workspacePaths.map(normalizeWorkspaceRoot).find((workspaceRoot) => isPathWithinDir(ruleDir, workspaceRoot));
  if (!containingWorkspaceRoot) {
    return false;
  }
  return ruleDir !== containingWorkspaceRoot;
}
function isFileScopedCursorRule(rule, workspacePaths) {
  if (rule.type?.type.case === "fileGlobbed") {
    return true;
  }
  if (rule.type?.type.case !== "global") {
    return false;
  }
  return isNestedGlobalRule(rule, workspacePaths);
}
function isPathWithinDir(pathValue, dir) {
  const normalizedDir = normalizePath2(dir);
  if (normalizedDir === SEP2) {
    return pathValue.startsWith(SEP2);
  }
  return pathValue === normalizedDir || pathValue.startsWith(`${normalizedDir}/`);
}
function getWorkspaceRelativeCandidates(normalizedReadPath, workspacePaths) {
  const candidates = /* @__PURE__ */ new Set();
  for (const workspacePath of workspacePaths) {
    const workspaceRoot = normalizeWorkspaceRoot(workspacePath);
    if (!isPathWithinDir(normalizedReadPath, workspaceRoot)) {
      continue;
    }
    if (workspaceRoot === SEP2) {
      candidates.add(normalizedReadPath.slice(1));
      continue;
    }
    candidates.add(normalizedReadPath.slice(workspaceRoot.length + 1));
  }
  return Array.from(candidates);
}
function doesTeamRuleMatchPath(rule, normalizedReadPath, workspacePaths) {
  if (rule.type?.type.case !== "fileGlobbed") {
    return false;
  }
  const globs = rule.type.type.value.globs;
  const workspaceRelativeCandidates = getWorkspaceRelativeCandidates(normalizedReadPath, workspacePaths);
  return globs.some((globPattern) => {
    const normalizedGlob = normalizeToUnixPath(globPattern);
    if (isAbsolutePath(normalizedGlob)) {
      return minimatch(normalizedReadPath, normalizedGlob, { dot: true });
    }
    return workspaceRelativeCandidates.some((candidate) => minimatch(candidate, normalizedGlob, { dot: true, matchBase: true }));
  });
}
function doesRuleMatchPath(rule, readPath, workspacePaths) {
  const ruleType = rule.type?.type.case;
  const normalizedReadPath = normalizePath2(readPath);
  if (rule.source === CursorRuleSource.TEAM) {
    return doesTeamRuleMatchPath(rule, normalizedReadPath, workspacePaths);
  }
  if (ruleType === "fileGlobbed") {
    const globs = rule.type?.type.value.globs ?? [];
    const ruleDir = normalizePath2(getRuleDir(rule.fullPath));
    const relativeCandidate = isPathWithinDir(normalizedReadPath, ruleDir) ? normalizedReadPath.slice(ruleDir.length + 1) : void 0;
    return globs.some((globPattern) => {
      const normalizedGlob = normalizeToUnixPath(globPattern);
      if (isAbsolutePath(normalizedGlob)) {
        return minimatch(normalizedReadPath, normalizedGlob, { dot: true });
      }
      return relativeCandidate ? minimatch(relativeCandidate, normalizedGlob, { dot: true }) : false;
    });
  }
  if (ruleType === "global" && rule.fullPath) {
    const ruleDir = normalizePath2(getRuleDir(rule.fullPath));
    return isPathWithinDir(normalizedReadPath, ruleDir);
  }
  return false;
}
function matchFileScopedRulesToReadPaths({ readPaths, rules, workspacePaths }) {
  const matches = /* @__PURE__ */ new Map();
  for (const readPath of readPaths) {
    for (const rule of rules) {
      if (!isFileScopedCursorRule(rule, workspacePaths)) {
        continue;
      }
      if (!rule.fullPath) {
        continue;
      }
      if (!doesRuleMatchPath(rule, readPath, workspacePaths)) {
        continue;
      }
      const existing = matches.get(rule.fullPath);
      if (existing) {
        existing.push(readPath);
      } else {
        matches.set(rule.fullPath, [readPath]);
      }
    }
  }
  return matches;
}
var SKILL_DIR_SEGMENTS = [
  [".cursor", "skills"],
  [".cursor", "skills-cursor"],
  [".agents", "skills"],
  [".claude", "skills"],
  [".codex", "skills"],
  [".grok", "skills"]
];
function getSkillScopeRoot(skillPath) {
  const normalizedPath = normalizeToUnixPath(skillPath);
  const segments = import_node_path81.posix.normalize(import_node_path81.posix.dirname(normalizedPath)).split(SEP2);
  for (let i = segments.length - 2; i >= 0; i--) {
    for (const [configDir, subDir] of SKILL_DIR_SEGMENTS) {
      if (segments[i] === configDir && segments[i + 1] === subDir) {
        const parentSegments = segments.slice(0, i);
        if (parentSegments.length === 0 || parentSegments.length === 1 && parentSegments[0] === "") {
          return SEP2;
        }
        return parentSegments.join(SEP2);
      }
    }
  }
  return import_node_path81.posix.normalize(import_node_path81.posix.dirname(normalizedPath));
}
function isFileScopedSkill(skill, workspacePaths) {
  const globs = skill.globs ?? [];
  if (globs.length > 0) {
    return true;
  }
  if (!skill.fullPath) {
    return false;
  }
  const scopeRoot = normalizePath2(getSkillScopeRoot(skill.fullPath));
  const normalizedWorkspaceRoots = workspacePaths.map(normalizeWorkspaceRoot);
  const containingWorkspaceRoot = normalizedWorkspaceRoots.find((workspaceRoot) => isPathWithinDir(scopeRoot, workspaceRoot));
  if (!containingWorkspaceRoot) {
    return false;
  }
  return scopeRoot !== containingWorkspaceRoot;
}
function doesSkillMatchPath(skill, readPath, workspacePaths) {
  if (!isFileScopedSkill(skill, workspacePaths)) {
    return false;
  }
  const normalizedReadPath = normalizePath2(readPath);
  const scopeRoot = normalizePath2(getSkillScopeRoot(skill.fullPath));
  const globs = skill.globs ?? [];
  if (globs.length > 0) {
    const scopeRootWithinAnyWorkspace = workspacePaths.some((workspacePath) => isPathWithinDir(scopeRoot, normalizeWorkspaceRoot(workspacePath)));
    if (scopeRootWithinAnyWorkspace && !isPathWithinDir(normalizedReadPath, scopeRoot)) {
      return false;
    }
    const relativeCandidate = isPathWithinDir(normalizedReadPath, scopeRoot) ? scopeRoot === SEP2 ? normalizedReadPath.slice(1) : normalizedReadPath.slice(scopeRoot.length + 1) : void 0;
    const workspaceRelativeCandidates = scopeRootWithinAnyWorkspace ? [] : getWorkspaceRelativeCandidates(normalizedReadPath, workspacePaths);
    return globs.some((globPattern) => {
      const normalizedGlob = normalizeToUnixPath(globPattern);
      if (isAbsolutePath(normalizedGlob)) {
        return minimatch(normalizedReadPath, normalizedGlob, { dot: true });
      }
      if (relativeCandidate) {
        return minimatch(relativeCandidate, normalizedGlob, { dot: true });
      }
      return workspaceRelativeCandidates.some((candidate) => minimatch(candidate, normalizedGlob, { dot: true }));
    });
  }
  return isPathWithinDir(normalizedReadPath, scopeRoot);
}
function matchFileScopedSkillsToReadPaths({ readPaths, skills, workspacePaths }) {
  const matches = /* @__PURE__ */ new Map();
  for (const readPath of readPaths) {
    for (const skill of skills) {
      if (skill.disableModelInvocation || skill.parseError) {
        continue;
      }
      if (!skill.fullPath) {
        continue;
      }
      if (matches.has(skill.fullPath)) {
        continue;
      }
      if (!doesSkillMatchPath(skill, readPath, workspacePaths)) {
        continue;
      }
      matches.set(skill.fullPath, skill);
    }
  }
  return matches;
}

