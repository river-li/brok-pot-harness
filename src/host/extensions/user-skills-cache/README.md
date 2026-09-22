# user-skills-cache

Caches and organizes user Skill files.

## Entry points and registration

[extension.ts](extension.ts) declares the ID, dependencies, and startup behavior. [registry.ts](../registry.ts) registers the extension.

| Implementation | Purpose |
| --- | --- |
| [user-skills-cache-service.ts](user-skills-cache-service.ts) | User Skills Cache Service |
| [user-skills-files.ts](user-skills-files.ts) | User Skills Files |

## Dependencies and change boundaries

Declared Host dependencies: [auth](../auth/README.md).

Retain source/version information during refresh and avoid overwriting user-maintained files.

See [Configuration](../../../../docs/wiki/Configuration.md) for activation policy and [Features](../../../../docs/wiki/Features.md) for support status.

[← Host extension map](../README.md) · [Host](../../README.md)
