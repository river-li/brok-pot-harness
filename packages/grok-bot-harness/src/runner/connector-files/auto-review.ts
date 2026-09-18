var SAND_CONNECTOR_UPLOAD_CLASSIFIER_ERROR_REASON = "An error occurred while reviewing this upload. Please review manually.";
function reviewArguments(target) {
  return {
    source_path: target.sourcePath,
    source_sha256: target.sha256,
    source_size_bytes: target.sizeBytes,
    ...target.destination.path === void 0 ? {} : { destination_path: target.destination.path },
    ...target.destination.folderId === void 0 ? {} : { destination_folder_id: target.destination.folderId },
    ...target.destination.draftId === void 0 ? {} : { destination_draft_id: target.destination.draftId },
    ...target.destination.name === void 0 ? {} : { destination_name: target.destination.name },
    ...target.destination.overwrite === void 0 ? {} : { overwrite: target.destination.overwrite }
  };
}
function buildSandConnectorUploadRiskTarget(args) {
  const { target } = args;
  return new SmartModeRiskTarget({
    action: "mcp",
    arguments: structFromRecord({
      server: {
        identifier: target.connection,
        name: target.connection,
        display_name: target.connection
      },
      tool_name: SAND_UPLOAD_FILE_TOOL_NAME,
      arguments: reviewArguments(target),
      tool_definition: {
        description: `Upload a file from the agent's computer into the user's ${target.connection} account using the connected account's credential.`,
        annotations: { destructiveHint: target.destination.overwrite === true }
      },
      project_permissions: buildProjectPermissionsContext({
        personalInstructions: args.personalInstructions,
        userAutoRunInstructions: args.userAutoRunInstructions,
        projectAutoRunInstructions: args.projectAutoRunInstructions
      })
    })
  });
}
function sandConnectorUploadFingerprintPayload(target) {
  return {
    connection: target.connection,
    sourcePath: target.sourcePath,
    sha256: target.sha256,
    sizeBytes: target.sizeBytes,
    destination: target.destination
  };
}
var SAND_CONNECTOR_UPLOAD_REVIEW_SPEC = {
  surface: "mcp",
  classifierErrorReason: SAND_CONNECTOR_UPLOAD_CLASSIFIER_ERROR_REASON,
  buildRiskTarget: buildSandConnectorUploadRiskTarget,
  fingerprintPayload: sandConnectorUploadFingerprintPayload,
  summarize: (target) => summarizeSandMcpAutoReviewAction({
    serverDisplayName: target.connection,
    toolName: SAND_UPLOAD_FILE_TOOL_NAME,
    mcpArguments: reviewArguments(target)
  }),
  abortPolicy: { kind: "deny", reason: "The upload was cancelled." }
};
async function reviewSandConnectorUpload(args) {
  const decision = await runSandAutoReviewFlow({
    ...args,
    spec: SAND_CONNECTOR_UPLOAD_REVIEW_SPEC
  });
  return decision.allowed === false ? decision : { allowed: true };
}
var SAND_CONNECTOR_DOWNLOAD_CLASSIFIER_ERROR_REASON = "An error occurred while reviewing this download. Please review manually.";
function downloadReviewArguments(target) {
  return {
    ...target.source.fileId === void 0 ? {} : { source_file_id: target.source.fileId },
    ...target.source.path === void 0 ? {} : { source_path: target.source.path },
    ...target.destination.path === void 0 ? {} : { destination_path: target.destination.path }
  };
}
function buildSandConnectorDownloadRiskTarget(args) {
  const { target } = args;
  return new SmartModeRiskTarget({
    action: "mcp",
    arguments: structFromRecord({
      server: {
        identifier: target.connection,
        name: target.connection,
        display_name: target.connection
      },
      tool_name: SAND_DOWNLOAD_FILE_TOOL_NAME,
      arguments: downloadReviewArguments(target),
      tool_definition: {
        description: `Download a file from the user's ${target.connection} account onto the agent's computer using the connected account's credential.`,
        annotations: { destructiveHint: false }
      },
      project_permissions: buildProjectPermissionsContext({
        personalInstructions: args.personalInstructions,
        userAutoRunInstructions: args.userAutoRunInstructions,
        projectAutoRunInstructions: args.projectAutoRunInstructions
      })
    })
  });
}
var SAND_CONNECTOR_DOWNLOAD_REVIEW_SPEC = {
  surface: "mcp",
  classifierErrorReason: SAND_CONNECTOR_DOWNLOAD_CLASSIFIER_ERROR_REASON,
  buildRiskTarget: buildSandConnectorDownloadRiskTarget,
  fingerprintPayload: (target) => ({
    connection: target.connection,
    source: target.source,
    destination: target.destination
  }),
  summarize: (target) => summarizeSandMcpAutoReviewAction({
    serverDisplayName: target.connection,
    toolName: SAND_DOWNLOAD_FILE_TOOL_NAME,
    mcpArguments: downloadReviewArguments(target)
  }),
  abortPolicy: { kind: "deny", reason: "The download was cancelled." }
};
async function reviewSandConnectorDownload(args) {
  const decision = await runSandAutoReviewFlow({
    ...args,
    spec: SAND_CONNECTOR_DOWNLOAD_REVIEW_SPEC
  });
  return decision.allowed === false ? decision : { allowed: true };
}
