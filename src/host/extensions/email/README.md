# email

Retains email-service integration.

## Entry points and registration

[extension.ts](extension.ts) declares the ID, dependencies, and startup behavior. [registry.ts](../registry.ts) registers the extension.

| Implementation | Purpose |
| --- | --- |
| [email-service.ts](email-service.ts) | Email Service |

## Dependencies and change boundaries

Declared Host dependencies: [auth](../auth/README.md) · [experiments](../experiments/README.md) · [telemetry](../telemetry/README.md) · [team-admin-policy](../team-admin-policy/README.md).

Email credentials and backend requirements remain separate; this is not a default verified local capability.

See [Configuration](../../../../docs/wiki/Configuration.md) for activation policy and [Features](../../../../docs/wiki/Features.md) for support status.

[← Host extension map](../README.md) · [Host](../../README.md)
