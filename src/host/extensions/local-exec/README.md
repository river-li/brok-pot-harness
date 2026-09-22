# local-exec

Bridges execution requests to the user's computer through Gateway or server adapters.

## Entry points and registration

[extension.ts](extension.ts) declares the ID, dependencies, and startup behavior. [registry.ts](../registry.ts) registers the extension.

| Implementation | Purpose |
| --- | --- |
| [local-exec-bridge.ts](local-exec-bridge.ts) | Local Exec Bridge |
| [gateway-local-exec-sand-box.ts](gateway-local-exec-sand-box.ts) | Gateway Local Exec Sand Box |

## Dependencies and change boundaries

Declared Host dependencies: [local-tool-permission](../local-tool-permission/README.md) · [telemetry](../telemetry/README.md) · [auth](../auth/README.md).

Keep Mac execution separate from Linux Box execution and preserve local-tool-permission checks.

See [Configuration](../../../../docs/wiki/Configuration.md) for activation policy and [Features](../../../../docs/wiki/Features.md) for support status.

[← Host extension map](../README.md) · [Host](../../README.md)
