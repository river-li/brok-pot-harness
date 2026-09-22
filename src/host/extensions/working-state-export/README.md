# working-state-export

Exports working state and manages warming eligibility.

## Entry points and registration

[extension.ts](extension.ts) declares the ID, dependencies, and startup behavior. [registry.ts](../registry.ts) registers the extension.

| Implementation | Purpose |
| --- | --- |
| [working-state-export-service.ts](working-state-export-service.ts) | Working State Export Service |
| [working-state-warmer.ts](working-state-warmer.ts) | Working State Warmer |

## Dependencies and change boundaries

This extension declares no other Host extension dependencies.

Exports may include work data; preserve destination, mode, and permission boundaries.

See [Configuration](../../../../docs/wiki/Configuration.md) for activation policy and [Features](../../../../docs/wiki/Features.md) for support status.

[← Host extension map](../README.md) · [Host](../../README.md)
