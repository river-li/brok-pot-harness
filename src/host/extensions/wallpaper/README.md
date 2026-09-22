# wallpaper

Manages the Box desktop wallpaper.

## Entry points and registration

[extension.ts](extension.ts) declares the ID, dependencies, and startup behavior. [registry.ts](../registry.ts) registers the extension.

| Implementation | Purpose |
| --- | --- |
| [wallpaper-service.ts](wallpaper-service.ts) | Wallpaper Service |
| [box-wallpaper-commands.ts](box-wallpaper-commands.ts) | Box Wallpaper Commands |

## Dependencies and change boundaries

Declared Host dependencies: [settings](../settings/README.md).

This controls the sandbox desktop, not the macOS app icon under assets/branding.

See [Configuration](../../../../docs/wiki/Configuration.md) for activation policy and [Features](../../../../docs/wiki/Features.md) for support status.

[← Host extension map](../README.md) · [Host](../../README.md)
