# telemetry

Aggregates Host diagnostics, structured logs, metrics, and lifecycle events.

## Entry points and registration

[extension.ts](extension.ts) declares the ID, dependencies, and startup behavior. [registry.ts](../registry.ts) registers the extension.

| Implementation | Purpose |
| --- | --- |
| [host-telemetry-service.ts](host-telemetry-service.ts) | Host Telemetry Service |
| [structured-log-telemetry.ts](structured-log-telemetry.ts) | Structured Log Telemetry |
| [host-tracing.ts](host-tracing.ts) | Host Tracing |

## Dependencies and change boundaries

Declared Host dependencies: [auth](../auth/README.md) · [experiments](../experiments/README.md) · [inference](../inference/README.md) · [settings](../settings/README.md).

Local diagnostics and remote reporting are different controls; respect disable policy and filter secrets.

See [Configuration](../../../../docs/wiki/Configuration.md) for activation policy and [Features](../../../../docs/wiki/Features.md) for support status.

[← Host extension map](../README.md) · [Host](../../README.md)
