# resume-ownership

Coordinates run-resume ownership, Box rooms, and migration barriers.

## Entry points and registration

[extension.ts](extension.ts) declares the ID, dependencies, and startup behavior. [registry.ts](../registry.ts) registers the extension.

| Implementation | Purpose |
| --- | --- |
| [resume-ownership-service.ts](resume-ownership-service.ts) | Resume Ownership Service |
| [applied-migration-barrier.ts](applied-migration-barrier.ts) | Applied Migration Barrier |

## Dependencies and change boundaries

This extension declares no other Host extension dependencies.

Prevent multiple owners from resuming the same execution.

See [Configuration](../../../../docs/wiki/Configuration.md) for activation policy and [Features](../../../../docs/wiki/Features.md) for support status.

[← Host extension map](../README.md) · [Host](../../README.md)
