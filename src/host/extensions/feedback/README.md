# feedback

Handles feedback sampling, prompt storage, and product feedback.

## Entry points and registration

[extension.ts](extension.ts) declares the ID, dependencies, and startup behavior. [registry.ts](../registry.ts) registers the extension.

| Implementation | Purpose |
| --- | --- |
| [feedback-service.ts](feedback-service.ts) | Feedback Service |
| [feedback-sampler.ts](feedback-sampler.ts) | Feedback Sampler |

## Dependencies and change boundaries

Declared Host dependencies: [auth](../auth/README.md) · [experiments](../experiments/README.md) · [telemetry](../telemetry/README.md) · [transcript](../transcript/README.md).

Preserve user initiation and data scope; do not turn diagnostics into automatic external submissions.

See [Configuration](../../../../docs/wiki/Configuration.md) for activation policy and [Features](../../../../docs/wiki/Features.md) for support status.

[← Host extension map](../README.md) · [Host](../../README.md)
