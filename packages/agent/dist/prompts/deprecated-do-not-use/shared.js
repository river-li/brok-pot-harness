function SwitchModeReminderSnippet({ currentMode, targetModes, fromModes }) {
  const modeStatement = buildCurrentModeStatement(currentMode, targetModes, fromModes);
  return `<system_reminder>
${modeStatement}
</system_reminder>`;
}
function McpFileSystemInstructions({ workspaceProjectDir, mcpDescriptors }, toolNames = {}) {
  if (mcpDescriptors.length === 0) {
    return "";
  }
  const callMcpToolName = toolNames.callMcpTool ?? "call_mcp_tool";
  const listMcpResourcesToolName = toolNames.listMcpResources ?? "ListMcpResources";
  const fetchMcpResourceToolName = toolNames.fetchMcpResource ?? "FetchMcpResource";
  const mcpAuthInstruction = toolNames.mcpAuthInstruction ?? "If you inspect a server's tools and it has an `mcp_auth` tool, you MUST call `mcp_auth` so the user can use that MCP server. Do not call `mcp_auth` in parallel. Authenticate only one server at a time.";
  return `
<mcp_file_system>
You have access to MCP (Model Context Protocol) tools through the MCP FileSystem.

## MCP Tool Access

You have a \`${callMcpToolName}\` tool available that allows you to call any MCP tool from the enabled MCP servers. To use MCP tools effectively:

If the user mentions, references, or links to a product or service that corresponds to an available MCP server, and the request likely depends on information from that service, proactively inspect that MCP server before answering. Do not wait for the user to explicitly ask you to use MCP.

1. **Discover Available Tools**: Browse the MCP tool descriptors in the file system to understand what tools are available. Each MCP server's tools are stored as JSON descriptor files that contain the tool's parameters and functionality.

2. **MANDATORY: Always Check Tool Schema First**: You MUST ALWAYS list and read the tool's schema/descriptor file BEFORE calling any tool with \`${callMcpToolName}\`. This is NOT optional - failing to check the schema first will likely result in errors. The schema contains critical information about required parameters, their types, and how to properly use the tool.

The MCP tool descriptors live in the ${workspaceProjectDir}/mcps folder. Each enabled MCP server has its own folder containing JSON descriptor files (for example, ${workspaceProjectDir}/mcps/<server>/tools/tool-name.json), and
some MCP servers have additional server use instructions that you should follow.

## MCP Resource Access

You also have access to MCP resources through the \`${listMcpResourcesToolName}\` and \`${fetchMcpResourceToolName}\` tools. MCP resources are read-only data provided by MCP servers. To discover and access resources:

1. **Discover Available Resources**: Use \`${listMcpResourcesToolName}\` to see what resources are available from each MCP server. Alternatively, you can browse the resource descriptor files in the file system at ${workspaceProjectDir}/mcps/<server>/resources/resource-name.json.

2. **Fetch Resource Content**: Use \`${fetchMcpResourceToolName}\` with the server name and resource URI to retrieve the actual resource content. The resource descriptor files contain the URI, name, description, and mime type for each resource.

3. **Authenticate MCP Servers When Needed**: ${mcpAuthInstruction}

Available MCP servers:
<mcp_file_system_servers>
${mcpDescriptors.map((descriptor2) => {
    const serverIdentifier = descriptor2.serverIdentifier;
    return `<mcp_file_system_server name="${serverIdentifier}" folderPath="${descriptor2.folderPath}" ${descriptor2.serverUseInstructions ? `serverUseInstructions="${descriptor2.serverUseInstructions}"` : ""} />`;
  }).join("\n")}
</mcp_file_system_servers>
</mcp_file_system>
`.trim();
}
