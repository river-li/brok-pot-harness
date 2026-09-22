# state-backstop

Provides fallback handling for Host state.

## Entry points and registration

[extension.ts](extension.ts) declares the ID, dependencies, and startup behavior. [registry.ts](../registry.ts) registers the extension.

| Implementation | Purpose |
| --- | --- |
| [state-backstop-service.ts](state-backstop-service.ts) | State Backstop Service |

## Dependencies and change boundaries

Declared Host dependencies: [box-store-sync](../box-store-sync/README.md) · [source-map](../source-map/README.md).

Review triggers against session recovery so fallback handling does not overwrite newer persistent state.

See [Configuration](../../../../docs/wiki/Configuration.md) for activation policy and [Features](../../../../docs/wiki/Features.md) for support status.

[← Host extension map](../README.md) · [Host](../../README.md)
