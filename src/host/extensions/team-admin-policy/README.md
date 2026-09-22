# team-admin-policy

Exposes team administration policy to dependent services.

## Entry points and registration

[extension.ts](extension.ts) declares the ID, dependencies, and startup behavior. [registry.ts](../registry.ts) registers the extension.

| Implementation | Purpose |
| --- | --- |
| [team-admin-policy-service.ts](team-admin-policy-service.ts) | Team Admin Policy Service |

## Dependencies and change boundaries

Declared Host dependencies: [auth](../auth/README.md) · [settings](../settings/README.md).

Retain policy implementations; actual local-mode usage depends on the callers and service conditions.

See [Configuration](../../../../docs/wiki/Configuration.md) for activation policy and [Features](../../../../docs/wiki/Features.md) for support status.

[← Host extension map](../README.md) · [Host](../../README.md)
