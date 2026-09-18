function projectPermissionsAutoRunFromProto(instructions) {
  if (instructions === void 0) {
    return void 0;
  }
  const allowInstructions = instructions.allowInstructions.filter((instruction) => instruction.length > 0);
  const blockInstructions = instructions.blockInstructions.filter((instruction) => instruction.length > 0);
  if (allowInstructions.length === 0 && blockInstructions.length === 0) {
    return void 0;
  }
  return { allowInstructions, blockInstructions };
}
function smartModeAutoRunInstructionsFromProtos({ userPermissionsAutoRun, projectPermissionsAutoRun, adminPermissionsAutoRun }) {
  const adminAutoRunInstructions = projectPermissionsAutoRunFromProto(adminPermissionsAutoRun);
  if (adminAutoRunInstructions !== void 0) {
    return {
      projectAutoRunInstructions: adminAutoRunInstructions,
      hasAdminOverride: true
    };
  }
  return {
    userAutoRunInstructions: projectPermissionsAutoRunFromProto(userPermissionsAutoRun),
    projectAutoRunInstructions: projectPermissionsAutoRunFromProto(projectPermissionsAutoRun),
    hasAdminOverride: false
  };
}
