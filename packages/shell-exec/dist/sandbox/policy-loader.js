function parseNetworkPolicy(json2) {
  if (!json2)
    return void 0;
  const result = {
    version: 1
  };
  if (json2.default === "allow" || json2.default === "deny") {
    result.default = json2.default;
  }
  if (Array.isArray(json2.allow) && json2.allow.length > 0) {
    result.allow = json2.allow.filter((item) => typeof item === "string");
  }
  if (Array.isArray(json2.deny) && json2.deny.length > 0) {
    result.deny = json2.deny.filter((item) => typeof item === "string");
  }
  if (json2.logging) {
    const logging = {};
    if (typeof json2.logging.decisionLogPath === "string") {
      logging.decisionLogPath = json2.logging.decisionLogPath;
    }
    if (json2.logging.logFormat === "jsonl") {
      logging.logFormat = "jsonl";
    }
    if (Object.keys(logging).length > 0) {
      result.logging = logging;
    }
  }
  return result;
}
function parseSandboxPolicyJson(json2) {
  const type2 = json2.type ?? "workspace_readwrite";
  const commonFields = {
    debugOutputDir: json2.debugOutputDir,
    captureDenies: json2.captureDenies,
    enableSharedBuildCache: json2.enableSharedBuildCache
  };
  if (type2 === "insecure_none") {
    const policy2 = {
      type: "insecure_none",
      ...commonFields
    };
    return policy2;
  }
  let additionalReadonlyPaths;
  if (Array.isArray(json2.additionalReadonlyPaths)) {
    const paths = json2.additionalReadonlyPaths;
    additionalReadonlyPaths = paths.length > 0 ? paths : void 0;
  }
  const sandboxedCommon = {
    ...commonFields,
    networkAccess: json2.networkAccess,
    networkPolicy: parseNetworkPolicy(json2.networkPolicy),
    networkPolicyStrict: json2.networkPolicyStrict,
    additionalReadonlyPaths,
    readBoundary: json2.readBoundary,
    additionalReadPaths: Array.isArray(json2.additionalReadPaths) ? json2.additionalReadPaths : void 0,
    disableTmpWrite: json2.disableTmpWrite
  };
  if (type2 === "workspace_readonly") {
    const policy2 = {
      type: "workspace_readonly",
      ...sandboxedCommon
    };
    return policy2;
  }
  const policy = {
    type: "workspace_readwrite",
    ...sandboxedCommon,
    additionalReadwritePaths: json2.additionalReadwritePaths
  };
  return policy;
}
function validateSandboxPolicyJson(value) {
  if (typeof value !== "object" || value === null) {
    return "Expected an object";
  }
  const json2 = value;
  if (json2.type !== void 0) {
    const validTypes = [
      "insecure_none",
      "workspace_readwrite",
      "workspace_readonly"
    ];
    if (typeof json2.type !== "string" || !validTypes.includes(json2.type)) {
      return `Invalid type: expected one of ${validTypes.join(", ")}`;
    }
  }
  const booleanFields = [
    "networkAccess",
    "networkPolicyStrict",
    "disableTmpWrite",
    "enableSharedBuildCache",
    "captureDenies"
  ];
  for (const field of booleanFields) {
    if (json2[field] !== void 0 && typeof json2[field] !== "boolean") {
      return `Invalid ${field}: expected boolean`;
    }
  }
  const stringFields = ["debugOutputDir"];
  for (const field of stringFields) {
    if (json2[field] !== void 0 && typeof json2[field] !== "string") {
      return `Invalid ${field}: expected string`;
    }
  }
  const stringArrayFields = [
    "additionalReadwritePaths",
    "additionalReadonlyPaths",
    "additionalReadPaths"
  ];
  for (const field of stringArrayFields) {
    if (json2[field] !== void 0) {
      if (!Array.isArray(json2[field])) {
        return `Invalid ${field}: expected array`;
      }
      const arr = json2[field];
      if (!arr.every((item) => typeof item === "string")) {
        return `Invalid ${field}: expected array of strings`;
      }
    }
  }
  if (json2.readBoundary !== void 0 && json2.readBoundary !== "system" && json2.readBoundary !== "workspace") {
    return 'Invalid readBoundary: expected "system" or "workspace"';
  }
  if (json2.networkPolicy !== void 0) {
    if (typeof json2.networkPolicy !== "object" || json2.networkPolicy === null) {
      return "Invalid networkPolicy: expected object";
    }
    const np = json2.networkPolicy;
    if (np.default !== void 0 && np.default !== "allow" && np.default !== "deny") {
      return 'Invalid networkPolicy.default: expected "allow" or "deny"';
    }
    if (np.allow !== void 0 && !Array.isArray(np.allow)) {
      return "Invalid networkPolicy.allow: expected array";
    }
    if (np.deny !== void 0 && !Array.isArray(np.deny)) {
      return "Invalid networkPolicy.deny: expected array";
    }
  }
  return void 0;
}
async function loadSandboxPolicyFromFile(filePath, baseDir) {
  try {
    const content = await (0, import_promises7.readFile)(filePath, "utf-8");
    const json2 = JSON.parse(content);
    const validationError = validateSandboxPolicyJson(json2);
    if (validationError) {
      return {
        success: false,
        error: `Invalid sandbox policy: ${validationError}`
      };
    }
    let policy = parseSandboxPolicyJson(json2);
    if (baseDir) {
      policy = resolvePolicyPaths(policy, baseDir);
    }
    return { success: true, policy };
  } catch (error3) {
    if (error3 instanceof Error) {
      if ("code" in error3 && error3.code === "ENOENT") {
        return { success: false, error: "File not found" };
      }
      if (error3 instanceof SyntaxError) {
        return { success: false, error: `Invalid JSON: ${error3.message}` };
      }
      return { success: false, error: error3.message };
    }
    return { success: false, error: "Unknown error" };
  }
}
async function loadSandboxPolicyFromFileOrUndefined(filePath, baseDir) {
  const result = await loadSandboxPolicyFromFile(filePath, baseDir);
  if (result.success) {
    return result.policy;
  }
  return void 0;
}
function resolvePolicyPaths(policy, baseDir) {
  if (policy.type === "insecure_none") {
    return policy;
  }
  const resolvedReadonlyPaths = policy.additionalReadonlyPaths?.map((p2) => resolvePath(p2, baseDir));
  const resolvedReadPaths = policy.additionalReadPaths?.map((p2) => resolvePath(p2, baseDir));
  if (policy.type === "workspace_readonly") {
    return {
      ...policy,
      additionalReadonlyPaths: resolvedReadonlyPaths,
      additionalReadPaths: resolvedReadPaths
    };
  }
  const resolvedReadwritePaths = policy.additionalReadwritePaths?.map((p2) => resolvePath(p2, baseDir));
  return {
    ...policy,
    additionalReadonlyPaths: resolvedReadonlyPaths,
    additionalReadPaths: resolvedReadPaths,
    additionalReadwritePaths: resolvedReadwritePaths
  };
}
var import_promises7;
var init_policy_loader = __esm({
  "../packages/shell-exec/dist/sandbox/policy-loader.js"() {
    "use strict";
    import_promises7 = require("node:fs/promises");
    init_dist3();
  }
});
