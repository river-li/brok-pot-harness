# box-lifecycle

Coordinates Box lifecycle events.

## Entry points and registration

[extension.ts](extension.ts) declares the ID, dependencies, and startup behavior. [registry.ts](../registry.ts) registers the extension.

| Implementation | Purpose |
| --- | --- |
| [box-lifecycle-service.ts](box-lifecycle-service.ts) | Box Lifecycle Service |

## Dependencies and change boundaries

Declared Host dependencies: [auth](../auth/README.md).

Notify dependent services and release resources on stop, rebuild, and recovery.

See [Configuration](../../../../docs/wiki/Configuration.md) for activation policy and [Features](../../../../docs/wiki/Features.md) for support status.

[← Host extension map](../README.md) · [Host](../../README.md)
