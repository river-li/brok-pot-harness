# Shared-source maintenance

This tree owns protocols, settings schemas, Node services, and shared feature
registries used across Host, Harness, and desktop. The
[shared README](README.md) maps the main protocol families.

## Edit boundaries and invariants

- Treat serialized payloads, default values, enum strings, and persisted
  records as interfaces. Check producers and consumers before changing them;
  coordinate Host Gateway methods with the Gateway protocol and desktop caller.
- Gateway path/header constants live under `gateway/`; Host routing and
  argument validation live in `src/host`. See the
  [Gateway wire guide](gateway/README.md) for the split and its checks.
- Keep shared permission and approval types as contracts only; enforcement
  remains in the owning Host extension/Harness wrapper. Do not turn protocol
  changes into an approval bypass.
- This is recovered bundle source. Preserve emitted identifiers, fragment
  markers, and original bundle order; do not invent imports. Local-only
  behavior stays conditional, with retained original paths intact.

## Verify changes

```sh
npm run build -- --profile local
npm run test:runtime-build
```

Use `npm run check:local` only for the independent strict-TypeScript subtree;
it does not compile recovered shared files. For Gateway methods, follow the
[Host maintenance checks](../host/AGENTS.md) and
[runtime test guide](../../runtime/tests/README.md).
