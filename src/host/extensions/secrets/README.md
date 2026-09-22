# secrets

Stores Bot secrets and manages carrying them between Bots.

## Entry points and registration

[extension.ts](extension.ts) declares the ID, dependencies, and startup behavior. [registry.ts](../registry.ts) registers the extension.

| Implementation | Purpose |
| --- | --- |
| [secrets-service.ts](secrets-service.ts) | Secrets Service |
| [bot-secret-carry.ts](bot-secret-carry.ts) | Bot Secret Carry |

## Dependencies and change boundaries

Declared Host dependencies: [auth](../auth/README.md) · [forever-box](../forever-box/README.md).

Keep secret scope intact and never write values into diagnostics, documentation, or media.

See [Configuration](../../../../docs/wiki/Configuration.md) for activation policy and [Features](../../../../docs/wiki/Features.md) for support status.

[← Host extension map](../README.md) · [Host](../../README.md)
