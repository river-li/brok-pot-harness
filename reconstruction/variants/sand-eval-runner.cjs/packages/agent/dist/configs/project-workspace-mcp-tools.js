/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/configs/project-workspace-mcp-tools.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var CURSOR_APP_CONTROL_SERVER = "cursor-app-control";
var WORKSPACE_MUTATION_TOOLS = /* @__PURE__ */ new Set([
  "move_agent_to_root",
  "move_agent_to_cloned_root",
  "create_project"
]);
async function isProjectWorkspaceConversation(ctx, stateHandler) {
  if (stateHandler.mode === AgentMode.PROJECT) {
    return true;
  }
  if (!("turns" in stateHandler)) {
    return false;
  }
  return (await resolveProjectConversationContext(ctx, stateHandler)).isRootProject;
}
function isProjectWorkspaceMutationMcpTool(args) {
  return args.serverIdentifier.toLowerCase() === CURSOR_APP_CONTROL_SERVER && WORKSPACE_MUTATION_TOOLS.has(args.toolName.toLowerCase());
}
function filterProjectWorkspaceMutationMcpDescriptors(descriptors) {
  return descriptors.map((descriptor2) => new McpDescriptor({
    ...descriptor2,
    tools: descriptor2.tools.filter((tool) => !isProjectWorkspaceMutationMcpTool({
      serverIdentifier: descriptor2.serverIdentifier,
      toolName: tool.toolName
    }))
  }));
}

