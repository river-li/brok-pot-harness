# forever-box

Manages the long-lived Box and disk-pressure handling.

## Entry points and registration

[extension.ts](extension.ts) declares the ID, dependencies, and startup behavior. [registry.ts](../registry.ts) registers the extension.

| Implementation | Purpose |
| --- | --- |
| [forever-box-service.ts](forever-box-service.ts) | Forever Box Service |
| [host-box.ts](host-box.ts) | Host Box |
| [disk-pressure-guard.ts](disk-pressure-guard.ts) | Disk Pressure Guard |

## Dependencies and change boundaries

Declared Host dependencies: [box-lifecycle](../box-lifecycle/README.md) · [codebase-telemetry](../codebase-telemetry/README.md) · [telemetry](../telemetry/README.md) · [trays](../trays/README.md).

Manage Box lifecycle separately from the user's workspace data.

See [Configuration](../../../../docs/wiki/Configuration.md) for activation policy and [Features](../../../../docs/wiki/Features.md) for support status.

[← Host extension map](../README.md) · [Host](../../README.md)
