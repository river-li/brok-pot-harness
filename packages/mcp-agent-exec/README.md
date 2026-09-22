# mcp-agent-exec

Loads MCP clients into Agent execution with network, authentication, and approval handling.

## Start reading

| Entry | Purpose |
| --- | --- |
| [dist/loader.js](dist/loader.js) | Loader |
| [dist/mcp.js](dist/mcp.js) | MCP |
| [dist/config.js](dist/config.js) | Config |
| [dist/in-memory-token-storage.js](dist/in-memory-token-storage.js) | In Memory Token Storage |

## Change boundaries

Keep concurrent Agents' configurations and credentials scoped. Local scope ownership lives in Harness src/local.

Related modules: [mcp-core](../mcp-core/README.md) · [agent-exec](../agent-exec/README.md) · [grok-bot-harness](../grok-bot-harness/README.md). These are reading links, not npm dependency declarations.

Build from the repository root. See [source recovery](../../docs/wiki/Source-Recovery.md) for bundle-scope rules and [development](../../docs/wiki/Development.md) for verification.

[← Package map](../README.md)
