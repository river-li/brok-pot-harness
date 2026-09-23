# Host maintenance

Host owns process startup, Gateway transport/API, session persistence, and
extension composition. See [Host README](README.md) for entry points and the
[extension map](extensions/README.md) for service ownership.

## Edit boundaries and invariants

- Startup and composition: `main.ts`, `host-boot.ts`, and
  `host-runner-composition.ts`.
- Gateway transport and error mapping: `gateway-server.ts`; application method
  implementations: `host-gateway-api.ts`; RPC argument contracts:
  `gateway-protocol.ts`; shared paths and headers:
  `src/shared/gateway/gateway-wire.ts`.
- Session message acceptance and scheduling belong to
  `extensions/transcript`; turn execution delegates to the Harness through
  `extensions/turn-execution`. Do not move the Agent loop or toolset into the
  Gateway layer.
- Extension dependencies belong in each `extension.ts`. Update the registry
  and generated extension IDs when changing the set; preserve startup ordering
  and `onStop` cleanup.
- Keep Gateway authentication, request validation, SSE event-stream echo,
  established domain-error status/failure-code mapping, and no-store response
  headers aligned across Host and desktop clients. Do not expose the Gateway
  token in logs or error payloads.
- Local policy is conditional. Retain vendor login, billing, provisioning, and
  sync implementations for the original profile; local profile policy disables
  those paths. Do not bypass the existing local-tool or Auto-review approvals.
- These are recovered bundle fragments. Preserve fragment markers and emitted
  identifiers; do not add guessed imports or edit `.runtime` output.

## Verify Host changes

From the repository root:

```sh
npm run build -- --profile local
npm run test:runtime-build
```

For Gateway API changes, this command checks basic Host health, settings, pause
state, Agent listing, and transcript persistence against a ready local Host:

```sh
SAND_GATEWAY_TOKEN="$(cat .runtime/gateway-token)" node runtime/tests/gateway.cjs
```

Run it only with disposable Host data: the test intentionally leaves an Agent
record and writes its ID to `/tmp/grokbot-verified-agent.json`. It does not
cover SSE echo behavior, authorization failures, or scheduler lane ordering.
The `test:runtime-build` check validates reconstruction/profile behavior, not
live Host semantics. See [test coverage](../../runtime/tests/README.md) and the
[recorded evidence](../../docs/wiki/Verification.md).
