# local-tool-permission

Resolves ask / never / always policies for Mac tools and handles approval requests.

## Entry points and registration

[extension.ts](extension.ts) declares the ID, dependencies, and startup behavior. [registry.ts](../registry.ts) registers the extension.

| Implementation | Purpose |
| --- | --- |
| [local-tool-permission-controller.ts](local-tool-permission-controller.ts) | Local Tool Permission Controller |
| [local-tool-permission-resolution.ts](local-tool-permission-resolution.ts) | Local Tool Permission Resolution |

## Dependencies and change boundaries

Declared Host dependencies: [settings](../settings/README.md) · [telemetry](../telemetry/README.md) · [transcript](../transcript/README.md).

Per-machine and default settings have precedence; Mac permission does not change Docker mounts.

See [Configuration](../../../../docs/wiki/Configuration.md) for activation policy and [Features](../../../../docs/wiki/Features.md) for support status.

[← Host extension map](../README.md) · [Host](../../README.md)
