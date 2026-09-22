# host-upgrade

Retains Host bundle acquisition, upgrades, and upgrade markers.

## Entry points and registration

[extension.ts](extension.ts) declares the ID, dependencies, and startup behavior. [registry.ts](../registry.ts) registers the extension.

| Implementation | Purpose |
| --- | --- |
| [host-upgrade-service.ts](host-upgrade-service.ts) | Host Upgrade Service |
| [host-bundle-upgrade.ts](host-bundle-upgrade.ts) | Host Bundle Upgrade |
| [host-bundle-source.ts](host-bundle-source.ts) | Host Bundle Source |

## Dependencies and change boundaries

Declared Host dependencies: [automations](../automations/README.md) · [experiments](../experiments/README.md) · [telemetry](../telemetry/README.md) · [transcript](../transcript/README.md).

Local packaging does not provide a working automatic-update service.

See [Configuration](../../../../docs/wiki/Configuration.md) for activation policy and [Features](../../../../docs/wiki/Features.md) for support status.

[← Host extension map](../README.md) · [Host](../../README.md)
