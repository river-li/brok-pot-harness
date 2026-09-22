# notifications

Notification extension and mobile push delivery.

## Entry points and registration

[extension.ts](extension.ts) declares the ID, dependencies, and startup behavior. [registry.ts](../registry.ts) registers the extension.

| Implementation | Purpose |
| --- | --- |
| [mobile-push-notifier.ts](mobile-push-notifier.ts) | Mobile Push Notifier |

## Dependencies and change boundaries

Declared Host dependencies: [auth](../auth/README.md).

Local desktop notifications and remote push differ; check outbound-call conditions.

See [Configuration](../../../../docs/wiki/Configuration.md) for activation policy and [Features](../../../../docs/wiki/Features.md) for support status.

[← Host extension map](../README.md) · [Host](../../README.md)
