# box-store-sync

Object-store synchronization, snapshots, packing, and transfer for Box state.

## Entry points and registration

[extension.ts](extension.ts) declares the ID, dependencies, and startup behavior. [registry.ts](../registry.ts) registers the extension.

| Implementation | Purpose |
| --- | --- |
| [box-store-sync-service.ts](box-store-sync-service.ts) | Box Store Sync Service |
| [box-store-manifest.ts](box-store-manifest.ts) | Box Store Manifest |
| [store-db-snapshot-upload.ts](store-db-snapshot-upload.ts) | Store DB Snapshot Upload |

## Dependencies and change boundaries

Declared Host dependencies: [auth](../auth/README.md) · [experiments](../experiments/README.md) · [mcp](../mcp/README.md) · [source-map](../source-map/README.md) · [telemetry](../telemetry/README.md).

Local mode disables remote sync; deletion and cleanup must follow that same policy.

See [Configuration](../../../../docs/wiki/Configuration.md) for activation policy and [Features](../../../../docs/wiki/Features.md) for support status.

[← Host extension map](../README.md) · [Host](../../README.md)
