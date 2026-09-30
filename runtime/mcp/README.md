# Brokpot MCP Gateway bridge

This bridge exposes existing Brokpot Host/Gateway capabilities over MCP without changing Bot orchestration, runner behavior, delegation semantics, or Host RPC contracts.

The bridge is intentionally thin: Bots continue to coordinate, delegate, wait on subagents, use groups, and emit transcript messages exactly as they already do. MCP clients only submit messages and observe the Host's existing state.

## Authentication

### stdio mode

The process requires the same authenticated Gateway token already used by the Brokpot client:

```sh
export SAND_HOST_GATEWAY_URL=http://127.0.0.1:1540
export SAND_HOST_GATEWAY_TOKEN="$(cat .runtime/server/gateway-token)"
npm run mcp:coordinator
```

The MCP server verifies the token against `getHostStatus` during initialization and uses it for every Gateway RPC.

### HTTP mode

HTTP clients must send the Brokpot Gateway token directly as the bearer credential:

```text
Authorization: Bearer <gateway-token>
```

Optionally configure a second factor on the bridge:

```sh
export BROKPOT_MCP_SERVER_TOKEN='another-long-random-secret'
```

When present, clients must also send:

```text
x-brokpot-mcp-token: <BROKPOT_MCP_SERVER_TOKEN>
```

The second factor never replaces Gateway authentication.

The bridge refuses non-loopback plaintext HTTP Gateway URLs by default. For remote deployments, keep the Gateway loopback-only and reach the MCP endpoint through SSH forwarding or a TLS/authenticated reverse proxy.

The current Brokpot Gateway token is Host-wide. Anyone authorized to this MCP bridge can access the same Bot set and Gateway capabilities exposed by these MCP tools.

## Tools

### `brokpot_list_agents`

List or search Bots. Returns stable ids so clients can choose any coordinator, project manager, group, or Bot appropriate to the user's organization.

### `brokpot_send_message`

Submit a message to a Bot and return as soon as the existing `sendPrompt` Gateway RPC accepts it.

It does **not** wait for the Bot to finish and does not alter orchestration.

The response includes:

- `message_id`: the Gateway client nonce/idempotency key
- `updates_cursor`: an opaque transcript cursor representing the point immediately before the submitted message

### `brokpot_get_updates`

Read new user-visible transcript messages/notices since a cursor.

This is the durable long-running-task mechanism. The cursor is based on the existing Host transcript, so a client can disconnect and later continue from the last cursor without requiring a long-lived MCP request.

### `brokpot_wait_for_updates`

A bounded long-poll helper around `brokpot_get_updates`.

It waits at most 30 seconds for the next update, then returns either updates or `timed_out: true` plus the next cursor. Clients can repeat the call while they remain active.

A Bot can continue working for hours after the MCP call ends; later updates remain in its transcript.

### `brokpot_get_agent_status`

Observe existing Host state for a Bot:

- `getSubagents`
- `getAsyncTasks`
- `getConversationOutline`
- `getHostStatus`

This lets an MCP client inspect whether a coordinator currently has running/done/error subagents, outstanding async work, recent tool/activity outline, and whether the Host reports active work.

This is observation only; the MCP bridge does not create or steer subagents itself.

### `brokpot_read_transcript`

Read recent raw transcript entries for audit/debugging or occasional direct inspection of a group/PM conversation.

## Long-running coordinator example

A client may submit a high-level request to a coordinator such as Steve:

```json
{
  "agent_name": "Steve",
  "message": "Coordinate the billing migration and keep me updated when there is meaningful progress or a blocker."
}
```

`brokpot_send_message` returns immediately with an `updates_cursor`.

The client can then:

1. call `brokpot_get_agent_status` to inspect current subagents/async work;
2. call `brokpot_wait_for_updates` while the current client turn remains active;
3. persist the returned cursor and later call `brokpot_get_updates` to collect messages Steve emitted after the original MCP call ended.

No Bot, PM, group, or worker needs to respond within an MCP timeout. The Host transcript and existing runtime state remain the source of truth.

## Verification

Run:

```sh
npm run test:coordinator-mcp
```

The isolated contract test verifies:

- Gateway bearer authentication is mandatory;
- optional bridge second-factor authentication;
- agent discovery;
- immediate `sendPrompt` acceptance;
- cursor-based retrieval of later transcript updates;
- one shared wait deadline across sequential Gateway requests and response-body reads, preserving the cursor on timeout;
- observation of existing subagent, async-task, outline, and Host state.

It uses a fake HTTP Gateway and does not require a real model or real Gateway token.
The suite is also included in the required offline gates (`npm run ci:pre-pr`).
