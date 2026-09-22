# agent-summarization

Prepares summary input, manages context budgets, and coordinates background summaries and durable content.

## Start reading

| Entry | Purpose |
| --- | --- |
| [dist/pipeline.js](dist/pipeline.js) | Pipeline |
| [dist/prompt-truncation.js](dist/prompt-truncation.js) | Prompt Truncation |
| [dist/background-summarization.js](dist/background-summarization.js) | Background Summarization |
| [dist/durable-blocks.js](dist/durable-blocks.js) | Durable Blocks |

## Change boundaries

Context compaction must preserve tool-call pairing, relevant images, and durable instructions.

Related modules: [agent](../agent/README.md) · [agent-transcript](../agent-transcript/README.md). These are reading links, not npm dependency declarations.

Build from the repository root. See [source recovery](../../docs/wiki/Source-Recovery.md) for bundle-scope rules and [development](../../docs/wiki/Development.md) for verification.

[← Package map](../README.md)
