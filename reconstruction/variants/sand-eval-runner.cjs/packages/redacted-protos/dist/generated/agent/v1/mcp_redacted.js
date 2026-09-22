/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/redacted-protos/dist/generated/agent/v1/mcp_redacted.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_esm13();
function toRedactedMcpToolDefinition(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    name: msg.name,
    providerIdentifier: msg.providerIdentifier,
    toolName: msg.toolName,
    description: createRedactedString(msg.description, DataClassification.CODE, "description", privacyMode),
    inputSchema: msg.inputSchema?.toJson(),
    inputSchemaJson: msg.inputSchemaJson,
    outputSchemaJson: msg.outputSchemaJson,
    annotationsJson: msg.annotationsJson
  };
}
function fromRedactedMcpToolDefinition(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new McpToolDefinition({
    name: msg.name,
    providerIdentifier: msg.providerIdentifier,
    toolName: msg.toolName,
    description: msg.description.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    inputSchema: msg.inputSchema !== void 0 ? Value.fromJson(msg.inputSchema) : void 0,
    inputSchemaJson: msg.inputSchemaJson,
    outputSchemaJson: msg.outputSchemaJson,
    annotationsJson: msg.annotationsJson
  });
}
function toRedactedMcpInstructions(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    serverName: msg.serverName,
    instructions: createRedactedString(msg.instructions, DataClassification.CODE, "instructions", privacyMode),
    serverIdentifier: msg.serverIdentifier
  };
}
function fromRedactedMcpInstructions(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new McpInstructions({
    serverName: msg.serverName,
    instructions: msg.instructions.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    serverIdentifier: msg.serverIdentifier
  });
}
function toRedactedMcpDescriptor(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    serverName: msg.serverName,
    serverIdentifier: msg.serverIdentifier,
    folderPath: msg.folderPath !== void 0 ? createRedactedString(msg.folderPath, DataClassification.PATH, "folder_path", privacyMode) : void 0,
    serverUseInstructions: msg.serverUseInstructions !== void 0 ? createRedactedString(msg.serverUseInstructions, DataClassification.CODE, "server_use_instructions", privacyMode) : void 0,
    tools: msg.tools.map((v2) => toRedactedMcpToolDescriptor(v2, privacyMode)),
    plugin: msg.plugin,
    marketplace: msg.marketplace,
    pluginDbId: msg.pluginDbId,
    marketplaceId: msg.marketplaceId
  };
}
function fromRedactedMcpDescriptor(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new McpDescriptor({
    serverName: msg.serverName,
    serverIdentifier: msg.serverIdentifier,
    folderPath: msg.folderPath?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    serverUseInstructions: msg.serverUseInstructions?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    tools: msg.tools.map((v2) => fromRedactedMcpToolDescriptor(v2, purpose, opts)),
    plugin: msg.plugin,
    marketplace: msg.marketplace,
    pluginDbId: msg.pluginDbId,
    marketplaceId: msg.marketplaceId
  });
}
function toRedactedMcpToolDescriptor(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    toolName: msg.toolName,
    definitionPath: msg.definitionPath !== void 0 ? createRedactedString(msg.definitionPath, DataClassification.PATH, "definition_path", privacyMode) : void 0,
    description: msg.description,
    inputSchema: msg.inputSchema?.toJson(),
    inputSchemaJson: msg.inputSchemaJson,
    annotationsJson: msg.annotationsJson
  };
}
function fromRedactedMcpToolDescriptor(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new McpToolDescriptor({
    toolName: msg.toolName,
    definitionPath: msg.definitionPath?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    description: msg.description,
    inputSchema: msg.inputSchema !== void 0 ? Value.fromJson(msg.inputSchema) : void 0,
    inputSchemaJson: msg.inputSchemaJson,
    annotationsJson: msg.annotationsJson
  });
}
function toRedactedMcpFileSystemOptions(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    enabled: msg.enabled,
    workspaceProjectDir: createRedactedString(msg.workspaceProjectDir, DataClassification.PATH, "workspace_project_dir", privacyMode),
    mcpDescriptors: msg.mcpDescriptors.map((v2) => toRedactedMcpDescriptor(v2, privacyMode))
  };
}
function fromRedactedMcpFileSystemOptions(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new McpFileSystemOptions({
    enabled: msg.enabled,
    workspaceProjectDir: msg.workspaceProjectDir.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    mcpDescriptors: msg.mcpDescriptors.map((v2) => fromRedactedMcpDescriptor(v2, purpose, opts))
  });
}
function toRedactedMcpMetaToolOptions(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    enabled: msg.enabled,
    mcpDescriptors: msg.mcpDescriptors.map((v2) => toRedactedMcpDescriptor(v2, privacyMode))
  };
}
function fromRedactedMcpMetaToolOptions(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new McpMetaToolOptions({
    enabled: msg.enabled,
    mcpDescriptors: msg.mcpDescriptors.map((v2) => fromRedactedMcpDescriptor(v2, purpose, opts))
  });
}

