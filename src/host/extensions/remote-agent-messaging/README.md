# remote-agent-messaging

Retains remote Agent communication and member-turn coordination.

## Entry points and registration

[extension.ts](extension.ts) declares the ID, dependencies, and startup behavior. [registry.ts](../registry.ts) registers the extension.

| Implementation | Purpose |
| --- | --- |
| [remote-agent-messaging-service.ts](remote-agent-messaging-service.ts) | Remote Agent Messaging Service |
| [temporal-member-turns.ts](temporal-member-turns.ts) | Temporal Member Turns |

## Dependencies and change boundaries

Declared Host dependencies: [auth](../auth/README.md) · [experiments](../experiments/README.md) · [telemetry](../telemetry/README.md).

Connection prerequisites and authorization still apply; this is not automatically a working local integration.

See [Configuration](../../../../docs/wiki/Configuration.md) for activation policy and [Features](../../../../docs/wiki/Features.md) for support status.

[← Host extension map](../README.md) · [Host](../../README.md)
