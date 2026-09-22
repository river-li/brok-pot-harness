# box-timezone

Manages Box timezone configuration.

## Entry points and registration

[extension.ts](extension.ts) declares the ID, dependencies, and startup behavior. [registry.ts](../registry.ts) registers the extension.

| Implementation | Purpose |
| --- | --- |
| [box-timezone-service.ts](box-timezone-service.ts) | Box Timezone Service |

## Dependencies and change boundaries

Declared Host dependencies: [settings](../settings/README.md).

Review task timestamps and display behavior while preserving the source of user settings.

See [Configuration](../../../../docs/wiki/Configuration.md) for activation policy and [Features](../../../../docs/wiki/Features.md) for support status.

[← Host extension map](../README.md) · [Host](../../README.md)
