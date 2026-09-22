# settings

Persists workspace settings and publishes changes to other extensions.

## Entry points and registration

[extension.ts](extension.ts) declares the ID, dependencies, and startup behavior. [registry.ts](../registry.ts) registers the extension.

| Implementation | Purpose |
| --- | --- |
| [settings-service.ts](settings-service.ts) | Settings Service |

## Dependencies and change boundaries

This extension declares no other Host extension dependencies.

Coordinate changes with shared schemas, desktop controls, and defaults.

See [Configuration](../../../../docs/wiki/Configuration.md) for activation policy and [Features](../../../../docs/wiki/Features.md) for support status.

[← Host extension map](../README.md) · [Host](../../README.md)
