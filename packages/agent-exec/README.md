# agent-exec

Agent-facing interfaces for files, shell, MCP, subagents, and background work.

## Start reading

| Entry | Purpose |
| --- | --- |
| [dist/controlled.js](dist/controlled.js) | Controlled |
| [dist/shell.js](dist/shell.js) | Shell |
| [dist/mcp.js](dist/mcp.js) | MCP |
| [dist/background-work-registry.js](dist/background-work-registry.js) | Background Work Registry |

## Change boundaries

This is the execution interface layer. Concrete processes live in local-exec and shell-exec; Harness selects the toolset.

Related modules: [agent](../agent/README.md) · [local-exec](../local-exec/README.md) · [hooks-exec](../hooks-exec/README.md). These are reading links, not npm dependency declarations.

Build from the repository root. See [source recovery](../../docs/wiki/Source-Recovery.md) for bundle-scope rules and [development](../../docs/wiki/Development.md) for verification.

[← Package map](../README.md)
