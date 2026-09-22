# agent-identity

Manages Agent names, identity capabilities, and historical identity backfills.

## Entry points and registration

[extension.ts](extension.ts) declares the ID, dependencies, and startup behavior. [registry.ts](../registry.ts) registers the extension.

| Implementation | Purpose |
| --- | --- |
| [agent-identity-service.ts](agent-identity-service.ts) | Agent Identity Service |
| [identity-backfill.ts](identity-backfill.ts) | Identity Backfill |

## Dependencies and change boundaries

Declared Host dependencies: [auth](../auth/README.md) · [experiments](../experiments/README.md) · [telemetry](../telemetry/README.md) · [transcript](../transcript/README.md).

Display names and identity keys are distinct; renaming must preserve session associations.

See [Configuration](../../../../docs/wiki/Configuration.md) for activation policy and [Features](../../../../docs/wiki/Features.md) for support status.

[← Host extension map](../README.md) · [Host](../../README.md)
