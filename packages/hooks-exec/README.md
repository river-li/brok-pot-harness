# hooks-exec

Integrates Hooks into tool execution, including errors, sandbox handling, and tool phases.

## Start reading

| Entry | Purpose |
| --- | --- |
| [dist/generic-hooks.js](dist/generic-hooks.js) | Generic Hooks |
| [dist/sandbox.js](dist/sandbox.js) | Sandbox |
| [dist/tool-hook-executors/shell.js](dist/tool-hook-executors/shell.js) | Shell |
| [dist/tool-hook-executors/mcp.js](dist/tool-hook-executors/mcp.js) | MCP |

## Change boundaries

Keep before/after Hook failures, cancellation, and permissions consistent with the tool lifecycle.

Related modules: [hooks](../hooks/README.md) · [hooks-carriers](../hooks-carriers/README.md) · [agent-exec](../agent-exec/README.md). These are reading links, not npm dependency declarations.

Build from the repository root. See [source recovery](../../docs/wiki/Source-Recovery.md) for bundle-scope rules and [development](../../docs/wiki/Development.md) for verification.

[← Package map](../README.md)
