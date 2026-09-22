# source-map

Provides source-map diagnostic services.

## Entry points and registration

[extension.ts](extension.ts) declares the ID, dependencies, and startup behavior. [registry.ts](../registry.ts) registers the extension.

| Implementation | Purpose |
| --- | --- |
| [source-map-service.ts](source-map-service.ts) | Source Map Service |

## Dependencies and change boundaries

This extension declares no other Host extension dependencies.

Keep source/output mappings consistent and personal paths out of published diagnostics.

See [Configuration](../../../../docs/wiki/Configuration.md) for activation policy and [Features](../../../../docs/wiki/Features.md) for support status.

[← Host extension map](../README.md) · [Host](../../README.md)
