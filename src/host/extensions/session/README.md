# session

Creates and recovers Agent sessions, databases, state, and persistence paths.

## Entry points and registration

[extension.ts](extension.ts) declares the ID, dependencies, and startup behavior. [registry.ts](../registry.ts) registers the extension.

| Implementation | Purpose |
| --- | --- |
| [agent-db.ts](agent-db.ts) | Agent DB |
| [agent-session.ts](agent-session.ts) | Agent Session |
| [session-recovery.ts](session-recovery.ts) | Session Recovery |

## Dependencies and change boundaries

Declared Host dependencies: [auth](../auth/README.md) · [experiments](../experiments/README.md) · [forever-box](../forever-box/README.md) · [privacy-mode](../privacy-mode/README.md) · [settings](../settings/README.md) · [telemetry](../telemetry/README.md).

Schema changes must account for existing data, recovery, and deletion.

See [Configuration](../../../../docs/wiki/Configuration.md) for activation policy and [Features](../../../../docs/wiki/Features.md) for support status.

[← Host extension map](../README.md) · [Host](../../README.md)
