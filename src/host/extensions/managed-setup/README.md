# managed-setup

Manages deployment settings, team rules, and managed Skills.

## Entry points and registration

[extension.ts](extension.ts) declares the ID, dependencies, and startup behavior. [registry.ts](../registry.ts) registers the extension.

| Implementation | Purpose |
| --- | --- |
| [managed-setup-service.ts](managed-setup-service.ts) | Managed Setup Service |
| [managed-skills-service.ts](managed-skills-service.ts) | Managed Skills Service |
| [team-rules.ts](team-rules.ts) | Team Rules |

## Dependencies and change boundaries

Declared Host dependencies: [auth](../auth/README.md) · [settings](../settings/README.md) · [telemetry](../telemetry/README.md).

Distinguish managed configuration from user-imported local plugins without reintroducing account prerequisites.

See [Configuration](../../../../docs/wiki/Configuration.md) for activation policy and [Features](../../../../docs/wiki/Features.md) for support status.

[← Host extension map](../README.md) · [Host](../../README.md)
