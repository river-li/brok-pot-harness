# experiments

Supplies feature gates, dynamic configuration, and development overrides.

## Entry points and registration

[extension.ts](extension.ts) declares the ID, dependencies, and startup behavior. [registry.ts](../registry.ts) registers the extension.

| Implementation | Purpose |
| --- | --- |
| [extension.ts](extension.ts) | Extension |

## Dependencies and change boundaries

Declared Host dependencies: [auth](../auth/README.md) · [settings](../settings/README.md).

Runtime experiments are separate from build profiles and cannot bypass local account-service policy.

See [Configuration](../../../../docs/wiki/Configuration.md) for activation policy and [Features](../../../../docs/wiki/Features.md) for support status.

[← Host extension map](../README.md) · [Host](../../README.md)
