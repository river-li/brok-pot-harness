# agent-store

Retained storage sync subpackage: indexes, locks, conflicts, and remote transport.

## Start reading

| Entry | Purpose |
| --- | --- |
| [sync/dist/sync-engine.js](sync/dist/sync-engine.js) | Sync Engine |
| [sync/dist/local-index.js](sync/dist/local-index.js) | Local Index |
| [sync/dist/conflict-events.js](sync/dist/conflict-events.js) | Conflict Events |
| [sync/dist/bcs-transport.js](sync/dist/bcs-transport.js) | Bcs Transport |

## Change boundaries

This tree primarily contains sync code. Maintenance must not implicitly re-enable remote synchronization disabled by the local profile.

Related modules: [agent-kv](../agent-kv/README.md) · [agent-transcript](../agent-transcript/README.md). These are reading links, not npm dependency declarations.

Build from the repository root. See [source recovery](../../docs/wiki/Source-Recovery.md) for bundle-scope rules and [development](../../docs/wiki/Development.md) for verification.

[← Package map](../README.md)
