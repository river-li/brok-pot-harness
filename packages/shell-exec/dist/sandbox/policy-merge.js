function getSandboxPolicyType(policy) {
  return policy.teamAdmin?.type ?? policy.perRepo?.type ?? policy.perUser?.type ?? "insecure_none";
}
function mergeRestrictiveBoolean(...values) {
  return values.some((v2) => v2 === true);
}
function mergePathsIntersection(...sources) {
  const definedSources = sources.filter((s3) => s3 !== void 0);
  if (definedSources.length === 0) {
    return [];
  }
  if (definedSources.some((s3) => s3.length === 0)) {
    return [];
  }
  if (definedSources.length === 1) {
    return deduplicatePaths(definedSources[0]).map(normalizePath);
  }
  let result = new Set(definedSources[0].map(normalizePath));
  for (let i = 1; i < definedSources.length; i++) {
    const sourceSet = new Set(definedSources[i].map(normalizePath));
    result = new Set([...result].filter((path30) => sourceSet.has(path30)));
  }
  return [...result];
}
function mergePathsUnion(...sources) {
  const allPaths = /* @__PURE__ */ new Set();
  for (const source of sources) {
    if (source) {
      for (const path30 of source) {
        allPaths.add(normalizePath(path30));
      }
    }
  }
  return [...allPaths];
}
function rankedPolicyField({ defaultValue, rank }) {
  return {
    defaultValue,
    merge: (...sources) => {
      const definedSources = sources.filter((source) => source !== void 0);
      if (definedSources.length === 0) {
        return defaultValue;
      }
      return definedSources.reduce((strictest, source) => rank[source] < rank[strictest] ? source : strictest);
    }
  };
}
function intersectingPathPolicyField() {
  return {
    defaultValue: [],
    merge: (...sources) => mergePathsIntersection(...sources)
  };
}
function mergeReadBoundary(...sources) {
  return readBoundaryPolicyField.merge(...sources);
}
function mergeAdditionalReadPaths(...sources) {
  return additionalReadPathsPolicyField.merge(...sources);
}
function normalizePath(path30) {
  const normalized = path30.replace(/\\/g, "/").replace(/\/+$/, "");
  if (normalized === "") {
    return "/";
  }
  if (/^[a-zA-Z]:$/.test(normalized)) {
    return `${normalized}/`;
  }
  return normalized;
}
function deduplicatePaths(paths) {
  const seen = /* @__PURE__ */ new Set();
  const result = [];
  for (const path30 of paths) {
    const normalized = normalizePath(path30);
    if (!seen.has(normalized)) {
      seen.add(normalized);
      result.push(path30);
    }
  }
  return result;
}
function mergeNetworkPolicies(...sources) {
  const definedSources = sources.filter((s3) => s3 !== void 0);
  if (definedSources.length === 0) {
    return void 0;
  }
  let mergedDefault;
  for (const source of definedSources) {
    if (source.default === "deny") {
      mergedDefault = "deny";
      break;
    } else if (source.default === "allow" && mergedDefault === void 0) {
      mergedDefault = "allow";
    }
  }
  const mergedDeny = /* @__PURE__ */ new Set();
  for (const source of definedSources) {
    if (source.deny) {
      for (const pattern of source.deny) {
        mergedDeny.add(pattern);
      }
    }
  }
  const mergedAllowSet = /* @__PURE__ */ new Set();
  for (const source of definedSources) {
    if (source.allow) {
      for (const pattern of source.allow) {
        mergedAllowSet.add(pattern);
      }
    }
  }
  const mergedAllow = mergedAllowSet.size > 0 ? [...mergedAllowSet] : void 0;
  let mergedLogging;
  for (let i = definedSources.length - 1; i >= 0; i--) {
    if (definedSources[i].logging !== void 0) {
      mergedLogging = definedSources[i].logging;
      break;
    }
  }
  const merged = {
    version: 1
  };
  if (mergedDefault !== void 0) {
    merged.default = mergedDefault;
  }
  if (mergedAllow !== void 0) {
    merged.allow = mergedAllow;
  }
  if (mergedDeny.size > 0) {
    merged.deny = [...mergedDeny];
  }
  if (mergedLogging !== void 0) {
    merged.logging = mergedLogging;
  }
  if (merged.default === void 0 && (merged.allow === void 0 || merged.allow.length === 0) && (merged.deny === void 0 || merged.deny.length === 0) && merged.logging === void 0) {
    return void 0;
  }
  return merged;
}
function mergeIgnoreMappings(...sources) {
  const definedSources = sources.filter((s3) => s3 !== void 0);
  if (definedSources.length === 0) {
    return void 0;
  }
  const merged = {};
  for (const source of definedSources) {
    for (const [path30, patterns] of Object.entries(source)) {
      const existing = merged[path30];
      if (existing) {
        const patternSet = new Set(existing);
        for (const pattern of patterns) {
          if (patternSet.has(pattern)) {
            patternSet.delete(pattern);
          }
          patternSet.add(pattern);
        }
        merged[path30] = [...patternSet];
      } else {
        merged[path30] = [...patterns];
      }
    }
  }
  if (Object.keys(merged).length === 0) {
    return void 0;
  }
  return merged;
}
function takeHighestPriorityDefined(...sources) {
  for (let i = sources.length - 1; i >= 0; i--) {
    if (sources[i] !== void 0) {
      return sources[i];
    }
  }
  return void 0;
}
async function resolveSandboxPolicyForWorkspace(workspaceDir, sources) {
  if (!sources)
    return { policy: { type: "insecure_none" } };
  const dotGitStat = await (0, import_promises4.stat)((0, import_node_path6.join)(workspaceDir, ".git")).then((s3) => s3, () => null);
  const isWorktree = dotGitStat?.isFile() ?? false;
  const isGitRepo = dotGitStat !== null;
  if (getSandboxPolicyType(sources) === "workspace_readwrite") {
    let gitDirParent = workspaceDir;
    if (isWorktree) {
      const commonDir = await spawnPromise("git", ["rev-parse", "--git-common-dir"], { cwd: workspaceDir }).then((x) => (0, import_node_path6.resolve)(workspaceDir, x.trim()), () => null);
      if (commonDir) {
        gitDirParent = (0, import_node_path6.dirname)(commonDir);
        const p2 = sources.perRepo;
        const ig = p2?.ignoreMapping;
        sources = {
          ...sources,
          perRepo: {
            ...p2,
            type: "workspace_readwrite",
            additionalReadwritePaths: [
              ...p2?.additionalReadwritePaths ?? [],
              commonDir
            ],
            ignoreMapping: ig,
            writeProtectionMapping: mergeIgnoreMappings(p2?.writeProtectionMapping, getWorktreeWriteProtectionMapping(workspaceDir))
          }
        };
      }
    }
    if (isGitRepo) {
      return mergeSandboxPolicies(sources, {
        workspaceDir,
        gitDirParent
      });
    }
  }
  return mergeSandboxPolicies(sources, { workspaceDir });
}
function validateAndGetPolicyType(sources) {
  const { perUser, perRepo, teamAdmin } = sources;
  const definedPolicies = [perUser, perRepo, teamAdmin].filter((p2) => p2 !== void 0);
  if (definedPolicies.length === 0) {
    return void 0;
  }
  const firstType = definedPolicies[0].type;
  for (const policy of definedPolicies) {
    if (policy.type !== firstType) {
      throw new Error(`Cannot merge policies of different types: found "${firstType}" and "${policy.type}". All policies must be of the same type (all workspace_readwrite, all workspace_readonly, or all insecure_none).`);
    }
  }
  return firstType;
}
function mergeSandboxPolicies(sources, options2) {
  const policyType = validateAndGetPolicyType(sources);
  if (policyType === void 0) {
    return mergeWorkspaceReadWritePolicies(sources, options2);
  }
  switch (policyType) {
    case "workspace_readwrite":
      return mergeWorkspaceReadWritePolicies(sources, options2);
    case "workspace_readonly":
      return mergeWorkspaceReadOnlyPolicies(sources, options2);
    case "insecure_none":
      return mergeInsecureNonePolicies(sources, options2);
    default: {
      const _exhaustive = policyType;
      throw new Error(`Unknown policy type: ${policyType}`);
    }
  }
}
function mergeCommonWorkspaceFields(sources, options2) {
  const debug = options2?.debug;
  const { perUser, perRepo, teamAdmin } = sources;
  const workspaceDir = options2?.workspaceDir ?? process.cwd();
  const hardcoded = getHardcodedSandboxPolicy(workspaceDir);
  const fieldSources = {};
  const orderedSources = [perUser, perRepo, teamAdmin];
  const sourceNames = ["perUser", "perRepo", "teamAdmin", "hardcoded"];
  const recordSource = (field, sourceIndex) => {
    if (debug) {
      fieldSources[field] = sourceNames[sourceIndex] ?? "unknown";
    }
  };
  const disableTmpWrite = mergeRestrictiveBoolean(perUser?.disableTmpWrite, perRepo?.disableTmpWrite, teamAdmin?.disableTmpWrite);
  for (let i = orderedSources.length - 1; i >= 0; i--) {
    if (orderedSources[i]?.disableTmpWrite === true) {
      recordSource("disableTmpWrite", i);
      break;
    }
  }
  const networkPolicyStrict = mergeRestrictiveBoolean(perUser?.networkPolicyStrict, perRepo?.networkPolicyStrict, teamAdmin?.networkPolicyStrict, hardcoded.networkPolicyStrict);
  if (hardcoded.networkPolicyStrict) {
    recordSource("networkPolicyStrict", 3);
  }
  const readBoundary = takeHighestPriorityDefined(perUser?.readBoundary, perRepo?.readBoundary, teamAdmin?.readBoundary) ?? "system";
  const additionalReadPaths = takeHighestPriorityDefined(perUser?.additionalReadPaths, perRepo?.additionalReadPaths, teamAdmin?.additionalReadPaths);
  const mergedReadPaths = readBoundary === "workspace" ? additionalReadPaths ?? [] : void 0;
  const additionalReadonlyPaths = mergePathsUnion(perUser?.additionalReadonlyPaths, perRepo?.additionalReadonlyPaths, teamAdmin?.additionalReadonlyPaths, hardcoded.additionalReadonlyPaths);
  const mergedReadonlyPaths = additionalReadonlyPaths.length > 0 ? additionalReadonlyPaths : void 0;
  let mergedNetworkPolicy = mergeNetworkPolicies(perUser?.networkPolicy, perRepo?.networkPolicy, teamAdmin?.networkPolicy, hardcoded.networkPolicy);
  const teamAdminAllow = teamAdmin?.networkPolicy?.allow;
  if (teamAdminAllow !== void 0 && teamAdminAllow.length > 0 && mergedNetworkPolicy !== void 0) {
    mergedNetworkPolicy = {
      ...mergedNetworkPolicy,
      allow: [...teamAdminAllow]
    };
    if (debug) {
      fieldSources["networkPolicy.allow"] = "teamAdmin (replace)";
    }
  }
  const networkPolicy = getEffectiveNetworkPolicy(mergedNetworkPolicy);
  const debugOutputDir = takeHighestPriorityDefined(perUser?.debugOutputDir, perRepo?.debugOutputDir, teamAdmin?.debugOutputDir);
  const captureDenies = mergeRestrictiveBoolean(perUser?.captureDenies, perRepo?.captureDenies, teamAdmin?.captureDenies);
  const enableSharedBuildCache = takeHighestPriorityDefined(perUser?.enableSharedBuildCache, perRepo?.enableSharedBuildCache, teamAdmin?.enableSharedBuildCache);
  const ignoreMapping = mergeIgnoreMappings(perUser?.ignoreMapping, perRepo?.ignoreMapping, teamAdmin?.ignoreMapping, hardcoded.ignoreMapping);
  const gitDirParent = options2?.gitDirParent ?? workspaceDir;
  const gitWriteProtection = getGitWriteProtectionMapping(gitDirParent);
  const writeProtectionMapping = mergeIgnoreMappings(perUser?.writeProtectionMapping, perRepo?.writeProtectionMapping, teamAdmin?.writeProtectionMapping, hardcoded.writeProtectionMapping, gitWriteProtection);
  return {
    disableTmpWrite: disableTmpWrite || void 0,
    networkPolicyStrict,
    readBoundary,
    additionalReadPaths: mergedReadPaths,
    additionalReadonlyPaths: mergedReadonlyPaths,
    networkPolicy,
    debugOutputDir,
    captureDenies: captureDenies || void 0,
    enableSharedBuildCache,
    ignoreMapping,
    writeProtectionMapping,
    fieldSources
  };
}
function cleanPolicy(policy, type2) {
  const clean = Object.fromEntries(Object.entries(policy).filter(([_2, v2]) => v2 !== void 0));
  clean.type = type2;
  return clean;
}
function mergeWorkspaceReadWritePolicies(sources, options2) {
  const { perUser, perRepo, teamAdmin } = sources;
  const debug = options2?.debug;
  const common2 = mergeCommonWorkspaceFields(sources, options2);
  const orderedSources = [perUser, perRepo, teamAdmin];
  const sourceNames = ["perUser", "perRepo", "teamAdmin", "hardcoded"];
  const additionalReadwritePaths = mergePathsUnion(perUser?.additionalReadwritePaths, perRepo?.additionalReadwritePaths, teamAdmin?.additionalReadwritePaths);
  const policy = {
    type: "workspace_readwrite",
    disableTmpWrite: common2.disableTmpWrite,
    networkPolicyStrict: common2.networkPolicyStrict,
    readBoundary: common2.readBoundary,
    additionalReadPaths: common2.additionalReadPaths,
    additionalReadwritePaths: additionalReadwritePaths.length > 0 ? additionalReadwritePaths : void 0,
    additionalReadonlyPaths: common2.additionalReadonlyPaths,
    networkPolicy: common2.networkPolicy,
    debugOutputDir: common2.debugOutputDir,
    captureDenies: common2.captureDenies,
    enableSharedBuildCache: common2.enableSharedBuildCache,
    ignoreMapping: common2.ignoreMapping,
    writeProtectionMapping: common2.writeProtectionMapping
  };
  const result = {
    policy: cleanPolicy(policy, "workspace_readwrite")
  };
  if (debug) {
    result.debug = { fieldSources: common2.fieldSources };
  }
  return result;
}
function mergeWorkspaceReadOnlyPolicies(sources, options2) {
  const debug = options2?.debug;
  const common2 = mergeCommonWorkspaceFields(sources, options2);
  const policy = {
    type: "workspace_readonly",
    disableTmpWrite: common2.disableTmpWrite,
    networkPolicyStrict: common2.networkPolicyStrict,
    readBoundary: common2.readBoundary,
    additionalReadPaths: common2.additionalReadPaths,
    additionalReadonlyPaths: common2.additionalReadonlyPaths,
    networkPolicy: common2.networkPolicy,
    debugOutputDir: common2.debugOutputDir,
    captureDenies: common2.captureDenies,
    enableSharedBuildCache: common2.enableSharedBuildCache,
    ignoreMapping: common2.ignoreMapping,
    writeProtectionMapping: common2.writeProtectionMapping
  };
  const result = {
    policy: cleanPolicy(policy, "workspace_readonly")
  };
  if (debug) {
    result.debug = { fieldSources: common2.fieldSources };
  }
  return result;
}
function mergeInsecureNonePolicies(sources, options2) {
  const { perUser, perRepo, teamAdmin } = sources;
  const debug = options2?.debug;
  const fieldSources = {};
  const allowlistEscalated = mergeRestrictiveBoolean(perUser?.allowlistEscalated, perRepo?.allowlistEscalated, teamAdmin?.allowlistEscalated);
  const debugOutputDir = takeHighestPriorityDefined(perUser?.debugOutputDir, perRepo?.debugOutputDir, teamAdmin?.debugOutputDir);
  const captureDenies = mergeRestrictiveBoolean(perUser?.captureDenies, perRepo?.captureDenies, teamAdmin?.captureDenies);
  const enableSharedBuildCache = takeHighestPriorityDefined(perUser?.enableSharedBuildCache, perRepo?.enableSharedBuildCache, teamAdmin?.enableSharedBuildCache);
  const policy = {
    type: "insecure_none",
    allowlistEscalated: allowlistEscalated || void 0,
    debugOutputDir,
    captureDenies: captureDenies || void 0,
    enableSharedBuildCache
  };
  const cleanPolicy2 = Object.fromEntries(Object.entries(policy).filter(([_2, v2]) => v2 !== void 0));
  cleanPolicy2.type = "insecure_none";
  const result = {
    policy: cleanPolicy2
  };
  if (debug) {
    result.debug = { fieldSources };
  }
  return result;
}
var import_promises4, import_node_path6, readBoundaryPolicyField, additionalReadPathsPolicyField;
var init_policy_merge = __esm({
  "../packages/shell-exec/dist/sandbox/policy-merge.js"() {
    "use strict";
    import_promises4 = require("node:fs/promises");
    import_node_path6 = require("node:path");
    init_dist3();
    init_hardcoded_policy();
    init_network_policy_utils();
    readBoundaryPolicyField = rankedPolicyField({
      defaultValue: "system",
      rank: {
        workspace: 0,
        system: 1
      }
    });
    additionalReadPathsPolicyField = intersectingPathPolicyField();
  }
});
