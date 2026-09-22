# turn-execution

Provides execution services for an individual turn.

## Entry points and registration

[extension.ts](extension.ts) declares the ID, dependencies, and startup behavior. [registry.ts](../registry.ts) registers the extension.

| Implementation | Purpose |
| --- | --- |
| [turn-execution-service.ts](turn-execution-service.ts) | Turn Execution Service |

## Dependencies and change boundaries

This extension declares no other Host extension dependencies.

Read alongside transcript scheduling and Harness runner composition; avoid duplicating the execution loop.

See [Configuration](../../../../docs/wiki/Configuration.md) for activation policy and [Features](../../../../docs/wiki/Features.md) for support status.

[← Host extension map](../README.md) · [Host](../../README.md)
