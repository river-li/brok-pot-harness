# agent-transcript

Execution trace formats, transcript paths, and context stripping for exports.

## Start reading

| Entry | Purpose |
| --- | --- |
| [dist/index.js](dist/index.js) | Index |
| [dist/trace-format.js](dist/trace-format.js) | Trace Format |
| [dist/context-stripping.js](dist/context-stripping.js) | Context Stripping |
| [dist/paths.js](dist/paths.js) | Paths |

## Change boundaries

Host message lifecycle lives in src/host/extensions/transcript; this package handles trace representation and processing.

Related modules: [agent](../agent/README.md) · [agent-summarization](../agent-summarization/README.md) · [agent-kv](../agent-kv/README.md). These are reading links, not npm dependency declarations.

Build from the repository root. See [source recovery](../../docs/wiki/Source-Recovery.md) for bundle-scope rules and [development](../../docs/wiki/Development.md) for verification.

[← Package map](../README.md)
