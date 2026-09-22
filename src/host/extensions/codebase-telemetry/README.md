# codebase-telemetry

Connects codebase snapshots and telemetry controllers to the Host.

## Entry points and registration

[extension.ts](extension.ts) declares the ID, dependencies, and startup behavior. [registry.ts](../registry.ts) registers the extension.

| Implementation | Purpose |
| --- | --- |
| [codebase-telemetry-service.ts](codebase-telemetry-service.ts) | Codebase Telemetry Service |
| [codebase-snapshot-trigger.ts](codebase-snapshot-trigger.ts) | Codebase Snapshot Trigger |
| [codebase-telemetry-adapter.ts](codebase-telemetry-adapter.ts) | Codebase Telemetry Adapter |

## Dependencies and change boundaries

Declared Host dependencies: [auth](../auth/README.md) · [experiments](../experiments/README.md) · [privacy-mode](../privacy-mode/README.md).

Read alongside packages/codebase-telemetry and preserve feature gates and privacy controls.

See [Configuration](../../../../docs/wiki/Configuration.md) for activation policy and [Features](../../../../docs/wiki/Features.md) for support status.

[← Host extension map](../README.md) · [Host](../../README.md)
