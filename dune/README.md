# Dune: Host infrastructure

Dune supplies extension lifecycle, RPC, stores, and scheduling.
Business extensions live in `src/host/extensions`; Dune defines how they are declared, ordered, started, and stopped.

- [Extension definitions](src/host-extensions/define.ts) and [boot coordinator](src/host-extensions/boot.ts): dependency graphs, startup, errors.
- [Stores](src/internal/store): snapshots, resource state, single-flight.
- [RPC](src/internal/rpc): declarations, schemas, call boundaries.
- [Scheduling](src/scheduling.ts): shared time and scheduling support.

[Source guide](src/README.md) · [Host extensions](../src/host/extensions/README.md) · [Architecture](../docs/wiki/Architecture.md)
