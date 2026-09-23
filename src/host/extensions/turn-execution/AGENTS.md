# Turn-execution maintenance

This extension binds Host turn services to the Harness. Its README identifies
the service entry point and neighboring scheduler.

## Edit boundaries and invariants

- `extension.ts` owns extension registration/lifecycle;
  `turn-execution-service.ts` owns `TurnExecutionRegistry` and delegates
  `createRunner` / `createGroupMemberRunner` to the bound executor.
- Preserve the single-bind invariant. `canExecute` reflects executor binding;
  `isRunReady` also checks the local-work gate and inference readiness. Keep the
  existing unbound and double-bind failures actionable.
- Message acceptance, queue priority, and per-Agent serialization belong to
  `extensions/transcript`. Agent/tool iteration belongs to
  `packages/grok-bot-harness`; do not duplicate either loop here.
- Keep startup dependencies and stop cleanup in sync with `extension.ts`.
  Preserve recovered-fragment markers, generated identifiers, and bundle
  scope. Local policy must not remove the original service implementation.

## Verify changes

```sh
npm run build -- --profile local
npm run test:runtime-build
```

`test:runtime-build` checks source reconstruction and profile selection, not
turn readiness or scheduler behavior. For externally observable Host changes,
use the disposable-stack instructions in the
[test guide](../../../../runtime/tests/README.md); `check:local` does not type
check recovered Host fragments.
