# Dune source

| Module | Responsibility |
| --- | --- |
| [host-extensions](host-extensions) | Definitions, events, dependency startup; begin with `define.ts` and `boot.ts` |
| [internal/rpc](internal/rpc) | RPC declarations, schemas, edges |
| [internal/store](internal/store) | Snapshot/resource stores and single-flight |
| [internal/deep-links](internal/deep-links) | Deep-link declarations, parsing, delivery |
| [internal/parse](internal/parse) | Basic unknown-input parsing |
| [scheduling.ts](scheduling.ts) | Scheduling support |

Lifecycle changes must handle missing dependencies, cycles, startup failure, and shutdown cleanup.
Keep business policy in Host extensions. Files rebuild through the root manifest; see
[Source recovery](../../docs/wiki/Source-Recovery.md).

[← Dune](../README.md)
