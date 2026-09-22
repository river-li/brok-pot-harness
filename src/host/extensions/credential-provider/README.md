# credential-provider

Coordinates credential providers, browser filling, and verification follow-ups.

## Entry points and registration

[extension.ts](extension.ts) declares the ID, dependencies, and startup behavior. [registry.ts](../registry.ts) registers the extension.

| Implementation | Purpose |
| --- | --- |
| [credential-coordinator.ts](credential-coordinator.ts) | Credential Coordinator |
| [browser-credential-filler.ts](browser-credential-filler.ts) | Browser Credential Filler |
| [credential-audit.ts](credential-audit.ts) | Credential Audit |

## Dependencies and change boundaries

Declared Host dependencies: [auth](../auth/README.md) · [credential-fill](../credential-fill/README.md) · [experiments](../experiments/README.md) · [telemetry](../telemetry/README.md).

Release leases, approvals, and temporary state when work ends.

See [Configuration](../../../../docs/wiki/Configuration.md) for activation policy and [Features](../../../../docs/wiki/Features.md) for support status.

[← Host extension map](../README.md) · [Host](../../README.md)
