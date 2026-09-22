# action-audit

Records action audits and connects the audit backend.

## Entry points and registration

[extension.ts](extension.ts) declares the ID, dependencies, and startup behavior. [registry.ts](../registry.ts) registers the extension.

| Implementation | Purpose |
| --- | --- |
| [action-audit-service.ts](action-audit-service.ts) | Action Audit Service |
| [action-audit-backend.ts](action-audit-backend.ts) | Action Audit Backend |

## Dependencies and change boundaries

Declared Host dependencies: [auth](../auth/README.md) · [experiments](../experiments/README.md) · [telemetry](../telemetry/README.md).

Audit records and approval decisions have different roles; check fields and remote-call conditions.

See [Configuration](../../../../docs/wiki/Configuration.md) for activation policy and [Features](../../../../docs/wiki/Features.md) for support status.

[← Host extension map](../README.md) · [Host](../../README.md)
