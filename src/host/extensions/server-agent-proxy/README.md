# server-agent-proxy

Proxies server-side Agent interactions and idle lifecycle.

## Entry points and registration

[extension.ts](extension.ts) declares the ID, dependencies, and startup behavior. [registry.ts](../registry.ts) registers the extension.

| Implementation | Purpose |
| --- | --- |
| [server-agent-proxy.ts](server-agent-proxy.ts) | Server Agent Proxy |
| [idle-destroying-agent.ts](idle-destroying-agent.ts) | Idle Destroying Agent |

## Dependencies and change boundaries

Declared Host dependencies: [agent-identity](../agent-identity/README.md) · [auth](../auth/README.md) · [telemetry](../telemetry/README.md) · [transcript](../transcript/README.md).

Preserve pending work and cancellation when releasing proxies.

See [Configuration](../../../../docs/wiki/Configuration.md) for activation policy and [Features](../../../../docs/wiki/Features.md) for support status.

[← Host extension map](../README.md) · [Host](../../README.md)
