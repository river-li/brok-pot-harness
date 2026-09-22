# memory

Manages Agent memory state, synthesis, and retained sync paths.

## Entry points and registration

[extension.ts](extension.ts) declares the ID, dependencies, and startup behavior. [registry.ts](../registry.ts) registers the extension.

| Implementation | Purpose |
| --- | --- |
| [memory-service.ts](memory-service.ts) | Memory Service |
| [memory-synthesis-service.ts](memory-synthesis-service.ts) | Memory Synthesis Service |
| [agent-state.ts](agent-state.ts) | Agent State |

## Dependencies and change boundaries

Declared Host dependencies: [auth](../auth/README.md) · [experiments](../experiments/README.md) · [inference](../inference/README.md) · [telemetry](../telemetry/README.md).

Persistent memory and current context have different lifecycles; retain mode conditions around remote paths.

See [Configuration](../../../../docs/wiki/Configuration.md) for activation policy and [Features](../../../../docs/wiki/Features.md) for support status.

[← Host extension map](../README.md) · [Host](../../README.md)
