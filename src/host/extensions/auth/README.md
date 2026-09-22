# auth

Host identity, credential renewal, and selected-team context.

## Entry points and registration

[extension.ts](extension.ts) declares the ID, dependencies, and startup behavior. [registry.ts](../registry.ts) registers the extension.

| Implementation | Purpose |
| --- | --- |
| [auth-service.ts](auth-service.ts) | Auth Service |
| [credential-renewer.ts](credential-renewer.ts) | Credential Renewer |

## Dependencies and change boundaries

Declared Host dependencies: [settings](../settings/README.md).

Keep local identity adapters alongside vendor paths; local mode must not acquire a vendor-login requirement.

See [Configuration](../../../../docs/wiki/Configuration.md) for activation policy and [Features](../../../../docs/wiki/Features.md) for support status.

[← Host extension map](../README.md) · [Host](../../README.md)
