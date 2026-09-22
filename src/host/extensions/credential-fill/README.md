# credential-fill

Executes and clears credential filling through browser control.

## Entry points and registration

[extension.ts](extension.ts) declares the ID, dependencies, and startup behavior. [registry.ts](../registry.ts) registers the extension.

| Implementation | Purpose |
| --- | --- |
| [credential-fill-executor.ts](credential-fill-executor.ts) | Credential Fill Executor |
| [credential-fill-cdp.ts](credential-fill-cdp.ts) | Credential Fill CDP |
| [credential-fill-clear.ts](credential-fill-clear.ts) | Credential Fill Clear |

## Dependencies and change boundaries

This extension declares no other Host extension dependencies.

Coordinate with credential-provider and keep secrets out of ordinary tool output.

See [Configuration](../../../../docs/wiki/Configuration.md) for activation policy and [Features](../../../../docs/wiki/Features.md) for support status.

[← Host extension map](../README.md) · [Host](../../README.md)
