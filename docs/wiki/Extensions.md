# MCP, plugins, and Skills

**MCP** connects callable tool services. **Skills** provide task instructions and resources.
**Plugins** package related capabilities into units you can install, update, and remove.

## Connect MCP services

Use the desktop's MCP / plugin settings to add a service and supply its command, URL, environment, or credentials.
Local adapters support stdio, HTTP, and SSE. Save the configuration, check connection status and available tools,
then ask the agent to use them.

| Connection / scope | What to check |
| --- | --- |
| stdio | The command and dependencies must exist in the environment that starts the process; host software is not automatically available in the Box |
| HTTP / SSE | The URL must be reachable from the actual execution environment; container localhost refers to that container |
| Workspace configuration | Can persist for use within the workspace |
| Inline configuration | Clients belong to an execution scope and must be released when it ends |

Local mode removes the vendor account dependency, not an MCP service's own authentication.
Do not use the model API key as a universal tool-service credential.

## Import a local plugin

Build from the repository root first, then import a plugin directory:

```sh
npm run plugins -- import /absolute/path/to/plugin --name my-plugin
npm run plugins -- list
```

Importing adds the bundle to the local catalog; it does not install or execute it.
Open **Plugins** in the desktop to install and configure it, provide required secrets, or select a target Bot.
Updates and removal use the plugin management flow.
Bundles must follow the retained manifest / Skill / MCP formats; see [cursor-plugins](../../packages/cursor-plugins/README.md).

## Implementation map

| Behavior | Entry point |
| --- | --- |
| Import, file validation, local catalog | [plugin-files.ts](../../packages/grok-bot-harness/src/local/plugin-files.ts) |
| Plugin lifecycle and local configuration | [plugins.ts](../../packages/grok-bot-harness/src/local/plugins.ts) |
| MCP persistence and execution scopes | [mcp-store.ts](../../packages/grok-bot-harness/src/local/mcp-store.ts), [mcp-scopes.ts](../../packages/grok-bot-harness/src/local/mcp-scopes.ts) |
| Host connections and Skills assembly | [MCP extension](../../src/host/extensions/mcp/README.md) |
| Connection and authentication state machines | [mcp-core](../../packages/mcp-core/README.md) |
| Agent execution bridge | [mcp-agent-exec](../../packages/mcp-agent-exec/README.md) |

Isolation tests cover concurrent Agents' credentials/workspace scopes and temporary-client cleanup.
See [Development](Development.md); do not replace scoped ownership with a shared global client.

---
[Documentation](Home.md) · [Get started](Build-Guide.md) · [Configuration](Configuration.md) · [Project](../../README.md)
