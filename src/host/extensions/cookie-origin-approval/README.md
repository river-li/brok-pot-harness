# cookie-origin-approval

Provides origin-scoped approval for cookie use.

## Entry points and registration

[extension.ts](extension.ts) declares the ID, dependencies, and startup behavior. [registry.ts](../registry.ts) registers the extension.

| Implementation | Purpose |
| --- | --- |
| [cookie-origin-approval-service.ts](cookie-origin-approval-service.ts) | Cookie Origin Approval Service |
| [cookie-origin-approval-bridge.ts](cookie-origin-approval-bridge.ts) | Cookie Origin Approval Bridge |

## Dependencies and change boundaries

Declared Host dependencies: [chrome-cookie-import](../chrome-cookie-import/README.md) · [transcript](../transcript/README.md) · [telemetry](../telemetry/README.md).

Do not expand one origin's approval to other sites.

See [Configuration](../../../../docs/wiki/Configuration.md) for activation policy and [Features](../../../../docs/wiki/Features.md) for support status.

[← Host extension map](../README.md) · [Host](../../README.md)
