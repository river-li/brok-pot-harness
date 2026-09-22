# teach-recording

Provides the Host teaching-recording service.

## Entry points and registration

[extension.ts](extension.ts) declares the ID, dependencies, and startup behavior. [registry.ts](../registry.ts) registers the extension.

| Implementation | Purpose |
| --- | --- |
| [teach-recording-service.ts](teach-recording-service.ts) | Teach Recording Service |

## Dependencies and change boundaries

Declared Host dependencies: [auth](../auth/README.md) · [forever-box](../forever-box/README.md) · [managed-setup](../managed-setup/README.md) · [telemetry](../telemetry/README.md) · [transcript](../transcript/README.md).

Recording workflows need broader validation and must preserve user authorization boundaries.

See [Configuration](../../../../docs/wiki/Configuration.md) for activation policy and [Features](../../../../docs/wiki/Features.md) for support status.

[← Host extension map](../README.md) · [Host](../../README.md)
