init_mcp_exec_pb();
var listMcpResourcesHooksConfig = {
  toolName: HooksToolName.ListMcpResources,
  // No getToolCallId - ListMcpResourcesExecArgs doesn't have toolCallId
  createToolInput: (args) => ({
    server: args.server
  }),
  applyUpdatedInput: (args, updatedInput) => {
    if (typeof updatedInput.server === "string") {
      args.server = updatedInput.server;
    }
  },
  createRejectedResult: (_args, reason) => new ListMcpResourcesExecResult({
    result: {
      case: "error",
      value: new ListMcpResourcesError({
        error: reason
      })
    }
  }),
  isSuccess: (result) => result.result.case === "success",
  getErrorMessage: (result) => {
    switch (result.result.case) {
      case "error":
        return result.result.value.error || "ListMcpResources error";
      case "rejected":
        return result.result.value.reason || "ListMcpResources rejected";
      default:
        return "Unknown error";
    }
  },
  createSuccessOutput: (_args, result) => {
    if (result.result.case === "success") {
      return {
        resources_count: result.result.value.resources.length
      };
    }
    return { success: true };
  }
};
var readMcpResourceHooksConfig = {
  toolName: HooksToolName.FetchMcpResource,
  // No getToolCallId - ReadMcpResourceExecArgs doesn't have toolCallId
  createToolInput: (args) => ({
    server: args.server,
    uri: args.uri,
    download_path: args.downloadPath
  }),
  applyUpdatedInput: (args, updatedInput) => {
    if (typeof updatedInput.server === "string") {
      args.server = updatedInput.server;
    }
    if (typeof updatedInput.uri === "string") {
      args.uri = updatedInput.uri;
    }
    if (typeof updatedInput.download_path === "string") {
      args.downloadPath = updatedInput.download_path;
    }
  },
  createRejectedResult: (_args, reason) => new ReadMcpResourceExecResult({
    result: {
      case: "error",
      value: new ReadMcpResourceError({
        error: reason
      })
    }
  }),
  isSuccess: (result) => result.result.case === "success",
  getErrorMessage: (result) => {
    switch (result.result.case) {
      case "error":
        return result.result.value.error || "ReadMcpResource error";
      case "rejected":
        return result.result.value.reason || "ReadMcpResource rejected";
      case "notFound":
        return "Resource not found";
      default:
        return "Unknown error";
    }
  },
  createSuccessOutput: (args, result) => {
    if (result.result.case === "success") {
      const success2 = result.result.value;
      return {
        uri: args.uri,
        name: success2.name,
        mime_type: success2.mimeType,
        download_path: success2.downloadPath,
        content_type: success2.content.case,
        content_length: success2.content.case === "text" ? success2.content.value.length : success2.content.case === "blob" ? success2.content.value.length : void 0
      };
    }
    return { uri: args.uri, success: true };
  }
};
