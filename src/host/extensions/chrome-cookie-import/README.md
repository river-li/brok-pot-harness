# chrome-cookie-import

Retains the Chrome cookie-import service.

## Entry points and registration

[extension.ts](extension.ts) declares the ID, dependencies, and startup behavior. [registry.ts](../registry.ts) registers the extension.

| Implementation | Purpose |
| --- | --- |
| [chrome-cookie-import-service.ts](chrome-cookie-import-service.ts) | Chrome Cookie Import Service |

## Dependencies and change boundaries

Declared Host dependencies: [experiments](../experiments/README.md).

This optional browser integration is separate from model authentication needed to use the workspace.

See [Configuration](../../../../docs/wiki/Configuration.md) for activation policy and [Features](../../../../docs/wiki/Features.md) for support status.

[← Host extension map](../README.md) · [Host](../../README.md)
