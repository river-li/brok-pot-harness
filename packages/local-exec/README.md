# local-exec

Concrete file, shell, MCP, screenshot, and computer-use implementations for an execution environment.

## Start reading

| Entry | Purpose |
| --- | --- |
| [dist/provider.js](dist/provider.js) | Provider |
| [dist/shell-core.js](dist/shell-core.js) | Shell Core |
| [dist/read.js](dist/read.js) | Read |
| [dist/computer-use/computer-use.js](dist/computer-use/computer-use.js) | Computer Use |

## Change boundaries

Local means the execution implementation, not necessarily the Mac. Host and Harness ports select the actual environment.

Related modules: [agent-exec](../agent-exec/README.md) · [shell-exec](../shell-exec/README.md) · [cursor-config](../cursor-config/README.md). These are reading links, not npm dependency declarations.

Build from the repository root. See [source recovery](../../docs/wiki/Source-Recovery.md) for bundle-scope rules and [development](../../docs/wiki/Development.md) for verification.

[← Package map](../README.md)
