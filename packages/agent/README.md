# agent

Generic Agent state, interaction handling, tool orchestration, and context processing.

## Start reading

| Entry | Purpose |
| --- | --- |
| [dist/interaction-handler.js](dist/interaction-handler.js) | Interaction Handler |
| [dist/tool-stream-executor.js](dist/tool-stream-executor.js) | Tool Stream Executor |
| [dist/tools/all-tools.js](dist/tools/all-tools.js) | All Tools |
| [dist/state.js](dist/state.js) | State |

## Change boundaries

Start here for inference-loop and common tool behavior; product-specific tool composition belongs in the Harness.

Related modules: [grok-bot-harness](../grok-bot-harness/README.md) · [agent-core](../agent-core/README.md) · [agent-exec](../agent-exec/README.md). These are reading links, not npm dependency declarations.

Build from the repository root. See [source recovery](../../docs/wiki/Source-Recovery.md) for bundle-scope rules and [development](../../docs/wiki/Development.md) for verification.

[← Package map](../README.md)
