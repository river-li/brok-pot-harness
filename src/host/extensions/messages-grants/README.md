# messages-grants

Manages Messages permission requests and their expiry.

## Entry points and registration

[extension.ts](extension.ts) declares the ID, dependencies, and startup behavior. [registry.ts](../registry.ts) registers the extension.

| Implementation | Purpose |
| --- | --- |
| [extension.ts](extension.ts) | Extension |

## Dependencies and change boundaries

This extension declares no other Host extension dependencies.

Grant records are not a Messages client; local Messages integration still needs adaptation.

See [Configuration](../../../../docs/wiki/Configuration.md) for activation policy and [Features](../../../../docs/wiki/Features.md) for support status.

[← Host extension map](../README.md) · [Host](../../README.md)
