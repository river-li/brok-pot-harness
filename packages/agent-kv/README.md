# agent-kv

Agent key-value/blob interfaces, serialization, caching, and retries.

## Start reading

| Entry | Purpose |
| --- | --- |
| [dist/agent-store.js](dist/agent-store.js) | Agent Store |
| [dist/blob-store.js](dist/blob-store.js) | Blob Store |
| [dist/cached-blob-store.js](dist/cached-blob-store.js) | Cached Blob Store |
| [dist/serde.js](dist/serde.js) | Serde |

## Change boundaries

Review serialized data and references alongside in-memory behavior to preserve stored-state compatibility.

Related modules: [agent](../agent/README.md) · [agent-store](../agent-store/README.md) · [agent-transcript](../agent-transcript/README.md). These are reading links, not npm dependency declarations.

Build from the repository root. See [source recovery](../../docs/wiki/Source-Recovery.md) for bundle-scope rules and [development](../../docs/wiki/Development.md) for verification.

[← Package map](../README.md)
