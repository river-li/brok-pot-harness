# automations

Automation triggers, manual runs, listener integrations, and retained cloud sync.

## Entry points and registration

[extension.ts](extension.ts) declares the ID, dependencies, and startup behavior. [registry.ts](../registry.ts) registers the extension.

| Implementation | Purpose |
| --- | --- |
| [sand-trigger-hub.ts](sand-trigger-hub.ts) | Sand Trigger Hub |
| [sand-automation-run-now.ts](sand-automation-run-now.ts) | Sand Automation Run Now |
| [listener-integrations.ts](listener-integrations.ts) | Listener Integrations |

## Dependencies and change boundaries

Declared Host dependencies: [auth](../auth/README.md) · [experiments](../experiments/README.md) · [settings](../settings/README.md) · [telemetry](../telemetry/README.md) · [transcript](../transcript/README.md) · [trays](../trays/README.md) · [turn-execution](../turn-execution/README.md) · [notify-bus](../notify-bus/README.md).

Local scheduling and cloud triggers are different paths; verify each workflow before claiming support.

See [Configuration](../../../../docs/wiki/Configuration.md) for activation policy and [Features](../../../../docs/wiki/Features.md) for support status.

[← Host extension map](../README.md) · [Host](../../README.md)
