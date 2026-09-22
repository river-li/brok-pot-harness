# trays

Manages tray-related Host state and services.

## Entry points and registration

[extension.ts](extension.ts) declares the ID, dependencies, and startup behavior. [registry.ts](../registry.ts) registers the extension.

| Implementation | Purpose |
| --- | --- |
| [trays-service.ts](trays-service.ts) | Trays Service |

## Dependencies and change boundaries

This extension declares no other Host extension dependencies.

Check state updates and cleanup alongside desktop presentation.

See [Configuration](../../../../docs/wiki/Configuration.md) for activation policy and [Features](../../../../docs/wiki/Features.md) for support status.

[← Host extension map](../README.md) · [Host](../../README.md)
