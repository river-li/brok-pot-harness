# transcript-publish

Publishes transcript entries to subscribers.

## Entry points and registration

[extension.ts](extension.ts) declares the ID, dependencies, and startup behavior. [registry.ts](../registry.ts) registers the extension.

| Implementation | Purpose |
| --- | --- |
| [transcript-entry-publisher.ts](transcript-entry-publisher.ts) | Transcript Entry Publisher |

## Dependencies and change boundaries

Declared Host dependencies: [auth](../auth/README.md) · [box-store-sync](../box-store-sync/README.md) · [experiments](../experiments/README.md) · [telemetry](../telemetry/README.md).

Keep publishing order consistent with transcript persistence.

See [Configuration](../../../../docs/wiki/Configuration.md) for activation policy and [Features](../../../../docs/wiki/Features.md) for support status.

[← Host extension map](../README.md) · [Host](../../README.md)
