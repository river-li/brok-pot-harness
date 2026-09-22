# auto-review

Provides automatic tool-action review and waits for review outcomes.

## Entry points and registration

[extension.ts](extension.ts) declares the ID, dependencies, and startup behavior. [registry.ts](../registry.ts) registers the extension.

| Implementation | Purpose |
| --- | --- |
| [auto-review-service.ts](auto-review-service.ts) | Auto Review Service |
| [sand-backend-smart-mode-classifier-exec.ts](sand-backend-smart-mode-classifier-exec.ts) | Sand Backend Smart Mode Classifier Exec |

## Dependencies and change boundaries

Declared Host dependencies: [auth](../auth/README.md) · [experiments](../experiments/README.md) · [settings](../settings/README.md) · [team-admin-policy](../team-admin-policy/README.md) · [telemetry](../telemetry/README.md) · [transcript](../transcript/README.md).

Preserve approval, rejection, and cancellation when adapting local inference.

See [Configuration](../../../../docs/wiki/Configuration.md) for activation policy and [Features](../../../../docs/wiki/Features.md) for support status.

[← Host extension map](../README.md) · [Host](../../README.md)
