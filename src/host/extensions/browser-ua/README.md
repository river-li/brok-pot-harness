# browser-ua

Manages browser user agents, fingerprints, and Web Bot markers.

## Entry points and registration

[extension.ts](extension.ts) declares the ID, dependencies, and startup behavior. [registry.ts](../registry.ts) registers the extension.

| Implementation | Purpose |
| --- | --- |
| [fingerprint-spoof-service.ts](fingerprint-spoof-service.ts) | Fingerprint Spoof Service |
| [ua-owner-stamp-service.ts](ua-owner-stamp-service.ts) | UA Owner Stamp Service |
| [ua-token-kill-switch-service.ts](ua-token-kill-switch-service.ts) | UA Token Kill Switch Service |

## Dependencies and change boundaries

Declared Host dependencies: [auth](../auth/README.md) · [experiments](../experiments/README.md).

Preserve ownership and revocation conditions when changing browser markers.

See [Configuration](../../../../docs/wiki/Configuration.md) for activation policy and [Features](../../../../docs/wiki/Features.md) for support status.

[← Host extension map](../README.md) · [Host](../../README.md)
