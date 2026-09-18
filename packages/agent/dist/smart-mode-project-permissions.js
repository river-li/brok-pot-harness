var MAX_PROJECT_PERMISSION_INSTRUCTIONS_PER_WORKSPACE = 20;
var MAX_USER_AUTO_RUN_INSTRUCTIONS = 20;
var MAX_PROJECT_PERMISSION_INSTRUCTION_CHARS = 1e3;
var PROJECT_PERMISSIONS_FILE_NAME = ".cursor/permissions.json";
function truncateInstruction(instruction) {
  if (instruction.length <= MAX_PROJECT_PERMISSION_INSTRUCTION_CHARS) {
    return { value: instruction, truncated: false };
  }
  return {
    value: `${instruction.slice(0, MAX_PROJECT_PERMISSION_INSTRUCTION_CHARS)}
...[truncated]`,
    truncated: true
  };
}
function truncateInstructions(instructions, maxCount) {
  const sliced = instructions.slice(0, maxCount);
  let truncated = sliced.length < instructions.length || instructions.some((instruction) => instruction.length > MAX_PROJECT_PERMISSION_INSTRUCTION_CHARS);
  const values = sliced.map((instruction) => {
    const result = truncateInstruction(instruction);
    truncated ||= result.truncated;
    return result.value;
  });
  return { values, truncated };
}
function appendUniqueInstructions(target, instructions) {
  const seen = new Set(target);
  for (const instruction of instructions) {
    if (seen.has(instruction)) {
      continue;
    }
    seen.add(instruction);
    target.push(instruction);
  }
}
function appendUniqueInstructionsExcluding(target, instructions, excludedInstructions) {
  const seen = /* @__PURE__ */ new Set([...excludedInstructions, ...target]);
  for (const instruction of instructions) {
    if (seen.has(instruction)) {
      continue;
    }
    seen.add(instruction);
    target.push(instruction);
  }
}
function hasAnyAutoRunInstructions(instructions) {
  return instructions !== void 0 && (instructions.allowInstructions.length > 0 || instructions.blockInstructions.length > 0);
}
async function loadSmartModeProjectPermissionsContext(_ctx, workspacePaths, userAutoRunInstructions, projectAutoRunInstructions) {
  const candidatePathSet = /* @__PURE__ */ new Set();
  if (workspacePaths !== void 0) {
    for (const workspacePath of workspacePaths) {
      if (typeof workspacePath !== "string") {
        continue;
      }
      const trimmed = workspacePath.trim();
      if (trimmed.length === 0) {
        continue;
      }
      candidatePathSet.add((0, import_node_path79.join)(trimmed, PROJECT_PERMISSIONS_FILE_NAME));
    }
  }
  const projectAllowInstructionsAggregate = [];
  const projectBlockInstructionsAggregate = [];
  let foundAnyPermissionsFile = hasAnyAutoRunInstructions(projectAutoRunInstructions);
  if (hasAnyAutoRunInstructions(projectAutoRunInstructions)) {
    appendUniqueInstructions(projectAllowInstructionsAggregate, projectAutoRunInstructions.allowInstructions);
    appendUniqueInstructions(projectBlockInstructionsAggregate, projectAutoRunInstructions.blockInstructions);
  } else {
    for (const filePath of candidatePathSet) {
      if (!(0, import_node_fs46.existsSync)(filePath)) {
        continue;
      }
      try {
        const raw = await (0, import_promises44.readFile)(filePath, "utf8");
        const config2 = parseProjectPermissionsFileConfig(raw);
        if (config2 === void 0) {
          continue;
        }
        foundAnyPermissionsFile = true;
        if (config2.autoRun?.allowInstructions !== void 0) {
          appendUniqueInstructions(projectAllowInstructionsAggregate, config2.autoRun.allowInstructions);
        }
        if (config2.autoRun?.blockInstructions !== void 0) {
          appendUniqueInstructions(projectBlockInstructionsAggregate, config2.autoRun.blockInstructions);
        }
      } catch {
      }
    }
  }
  const userAllowInstructionsAggregate = [];
  const userBlockInstructionsAggregate = [];
  if (hasAnyAutoRunInstructions(userAutoRunInstructions)) {
    appendUniqueInstructionsExcluding(userAllowInstructionsAggregate, userAutoRunInstructions.allowInstructions, projectAllowInstructionsAggregate);
    appendUniqueInstructionsExcluding(userBlockInstructionsAggregate, userAutoRunInstructions.blockInstructions, projectBlockInstructionsAggregate);
  }
  if (!foundAnyPermissionsFile && !hasAnyAutoRunInstructions(userAutoRunInstructions)) {
    return void 0;
  }
  const workspaceCount = Math.max(workspacePaths?.length ?? 1, 1);
  const maxProjectInstructions = MAX_PROJECT_PERMISSION_INSTRUCTIONS_PER_WORKSPACE * workspaceCount;
  const projectAllowInstructions = truncateInstructions(projectAllowInstructionsAggregate, maxProjectInstructions);
  const projectBlockInstructions = truncateInstructions(projectBlockInstructionsAggregate, maxProjectInstructions);
  const userAllowInstructions = truncateInstructions(userAllowInstructionsAggregate, MAX_USER_AUTO_RUN_INSTRUCTIONS);
  const userBlockInstructions = truncateInstructions(userBlockInstructionsAggregate, MAX_USER_AUTO_RUN_INSTRUCTIONS);
  return {
    auto_run: {
      allow_instructions: [
        ...projectAllowInstructions.values,
        ...userAllowInstructions.values
      ],
      block_instructions: [
        ...projectBlockInstructions.values,
        ...userBlockInstructions.values
      ]
    },
    truncated: projectAllowInstructions.truncated || projectBlockInstructions.truncated || userAllowInstructions.truncated || userBlockInstructions.truncated
  };
}
