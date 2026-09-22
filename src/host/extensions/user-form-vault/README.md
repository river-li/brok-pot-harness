# user-form-vault

Stores and manages user form data.

## Entry points and registration

[extension.ts](extension.ts) declares the ID, dependencies, and startup behavior. [registry.ts](../registry.ts) registers the extension.

| Implementation | Purpose |
| --- | --- |
| [user-form-vault-service.ts](user-form-vault-service.ts) | User Form Vault Service |
| [vault-logic.ts](vault-logic.ts) | Vault Logic |

## Dependencies and change boundaries

Declared Host dependencies: [auth](../auth/README.md) · [experiments](../experiments/README.md).

Read submitted data within its original scope and keep it out of generic logs.

See [Configuration](../../../../docs/wiki/Configuration.md) for activation policy and [Features](../../../../docs/wiki/Features.md) for support status.

[← Host extension map](../README.md) · [Host](../../README.md)
