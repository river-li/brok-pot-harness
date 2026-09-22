# transcript

Accepts messages, schedules turns, coordinates Agent lifecycle, and stores transcripts.

## Entry points and registration

[extension.ts](extension.ts) declares the ID, dependencies, and startup behavior. [registry.ts](../registry.ts) registers the extension.

| Implementation | Purpose |
| --- | --- |
| [send-pipeline.ts](send-pipeline.ts) | Send Pipeline |
| [run-scheduler.ts](run-scheduler.ts) | Run Scheduler |
| [transcript-manager.ts](transcript-manager.ts) | Transcript Manager |
| [agent-lifecycle.ts](agent-lifecycle.ts) | Agent Lifecycle |

## Dependencies and change boundaries

Declared Host dependencies: [attachments](../attachments/README.md) · [content-search](../content-search/README.md) · [credential-provider](../credential-provider/README.md) · [experiments](../experiments/README.md) · [inference](../inference/README.md) · [mcp](../mcp/README.md) · [memory](../memory/README.md) · [remote-agent-messaging](../remote-agent-messaging/README.md) · [secrets](../secrets/README.md) · [session](../session/README.md) · [telemetry](../telemetry/README.md) · [trays](../trays/README.md) · [turn-execution](../turn-execution/README.md) · [user-form-vault](../user-form-vault/README.md).

Trace from message acceptance to completion; preserve ordering, cancellation, recovery, and persistence.

See [Configuration](../../../../docs/wiki/Configuration.md) for activation policy and [Features](../../../../docs/wiki/Features.md) for support status.

[← Host extension map](../README.md) · [Host](../../README.md)
