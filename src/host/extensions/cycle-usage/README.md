# cycle-usage

Reads and exposes usage-cycle information.

## Entry points and registration

[extension.ts](extension.ts) declares the ID, dependencies, and startup behavior. [registry.ts](../registry.ts) registers the extension.

| Implementation | Purpose |
| --- | --- |
| [cycle-usage-service.ts](cycle-usage-service.ts) | Cycle Usage Service |

## Dependencies and change boundaries

Declared Host dependencies: [auth](../auth/README.md).

Retain billing-related code without making local mode call vendor billing services.

See [Configuration](../../../../docs/wiki/Configuration.md) for activation policy and [Features](../../../../docs/wiki/Features.md) for support status.

[← Host extension map](../README.md) · [Host](../../README.md)
