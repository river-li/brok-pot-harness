# privacy-mode

Manages privacy mode and shared privacy state.

## Entry points and registration

[extension.ts](extension.ts) declares the ID, dependencies, and startup behavior. [registry.ts](../registry.ts) registers the extension.

| Implementation | Purpose |
| --- | --- |
| [privacy-mode-service.ts](privacy-mode-service.ts) | Privacy Mode Service |

## Dependencies and change boundaries

Declared Host dependencies: [auth](../auth/README.md).

Apply privacy policy both when reading content and when producing diagnostics.

See [Configuration](../../../../docs/wiki/Configuration.md) for activation policy and [Features](../../../../docs/wiki/Features.md) for support status.

[← Host extension map](../README.md) · [Host](../../README.md)
