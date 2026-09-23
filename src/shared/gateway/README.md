# Gateway wire contract

This directory owns path, header, and wire constants shared by Host and
desktop Gateway clients. The Host implements transport and method behavior;
this directory is not a second RPC server.

| Source | Responsibility |
| --- | --- |
| [gateway-wire.ts](gateway-wire.ts) | API/events/health paths, auth scheme, event echo, and shared headers |
| [Host server](../../host/gateway-server.ts) | Authentication, request routing, SSE channels, payload limits, and error mapping |
| [Host protocol](../../host/gateway-protocol.ts) | RPC payload validators and Host-only method contracts |
| [Host API](../../host/host-gateway-api.ts) | Gateway method implementation and extension delegation |
| [Desktop client](../../../runtime/desktop-src/main-app.cjs) | Local desktop caller and Gateway connection |

When changing a method or event, trace both clients and the Host handler. Keep
path/header constants, payload shape, auth requirements, and established error
codes/statuses synchronized. Preserve the SSE event-stream echo path and
nonce validation used to detect quiet or stale streams. Gateway authentication
is transport access control; tool action approval stays in Host/Harness policy.

The same maintained source is assembled for `local` and `original`. Local-only
routes remain conditional, and retained vendor-service methods stay present.

## Verify Gateway changes

```sh
npm run build -- --profile local
npm run test:runtime-build
```

For basic API, settings, pause, Agent-listing, and transcript-persistence
coverage against a healthy disposable local Host, run:

```sh
SAND_GATEWAY_TOKEN="$(cat .runtime/gateway-token)" node runtime/tests/gateway.cjs
```

That script leaves a test Agent and does not cover SSE echo or authorization
rejection. The full test conditions are in the
[runtime test guide](../../../runtime/tests/README.md).
