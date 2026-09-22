# Host and shared source

`src/` contains application services and shared code. Agent product orchestration lives in `packages/grok-bot-harness`.

| Directory | Responsibility | Start reading |
| --- | --- | --- |
| [host](host/README.md) | Startup, Gateway, persistence, service composition | `main.ts`, `host-boot.ts`, extension registry |
| [shared](shared/README.md) | Protocols, settings, data structures, utilities | `gateway/`, `settings/`, `node/` |
| [sand-eval-runner](sand-eval-runner/README.md) | Retained evaluation entry and environment adapters | Outside the everyday local runtime |

See [Architecture](../docs/wiki/Architecture.md) for a complete task flow.
These release fragments rebuild through the root manifest; see [Source recovery](../docs/wiki/Source-Recovery.md).
