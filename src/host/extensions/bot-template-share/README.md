# bot-template-share

Stores and shares Bot templates.

## Entry points and registration

[extension.ts](extension.ts) declares the ID, dependencies, and startup behavior. [registry.ts](../registry.ts) registers the extension.

| Implementation | Purpose |
| --- | --- |
| [bot-template-store.ts](bot-template-store.ts) | Bot Template Store |
| [bot-template-share-service.ts](bot-template-share-service.ts) | Bot Template Share Service |

## Dependencies and change boundaries

Declared Host dependencies: [agent-identity](../agent-identity/README.md) · [auth](../auth/README.md) · [telemetry](../telemetry/README.md).

Local templates and remote sharing have separate conditions; retained sharing code does not prove service availability.

See [Configuration](../../../../docs/wiki/Configuration.md) for activation policy and [Features](../../../../docs/wiki/Features.md) for support status.

[← Host extension map](../README.md) · [Host](../../README.md)
