# Coordinator MCP bridge

This bridge exposes a small MCP surface for talking to a Bot on an existing Brokpot Host. It does not create a second Bot runtime or bypass Host approvals. It translates MCP tool calls into the Host's authenticated Gateway RPCs.

The main use case is to select a coordinator Bot and send it work. That Bot can then use its normal Brokpot tools to create Bots, delegate tasks, inspect work, and continue the workflow.

## Security model

- The Host Gateway token remains server-side and is read from `SAND_HOST_GATEWAY_TOKEN`.
- Remote plaintext HTTP Gateway URLs are rejected by default. Prefer a loopback SSH tunnel or HTTPS.
- HTTP MCP mode requires a separate `BROKPOT_MCP_SERVER_TOKEN`; MCP clients never receive the Gateway token.
- The Gateway token is Host-wide in the current server design, so this MCP bridge can address every Bot on that Host. Treat access to the MCP bridge as equivalent to operator access to that Host.
- The bridge does not log tokens or raw environments.

## stdio mode

Use this when the MCP client can launch a local command:

```sh
SAND_HOST_GATEWAY_URL=http://127.0.0.1:1540 \
SAND_HOST_GATEWAY_TOKEN="$(cat .runtime/server/gateway-token)" \
npm run mcp:coordinator
```

A typical MCP client configuration points its command at:

```text
node /absolute/path/to/brok-pot-harness/runtime/mcp/coordinator-server.cjs
```

and supplies `SAND_HOST_GATEWAY_URL` and `SAND_HOST_GATEWAY_TOKEN` through that client's secret/environment configuration.

## HTTP mode

Use HTTP mode when the MCP bridge runs alongside the Host and the MCP client connects over the network. Keep the Host Gateway itself loopback-only.

```sh
export SAND_HOST_GATEWAY_URL=http://127.0.0.1:1540
export SAND_HOST_GATEWAY_TOKEN="$(cat .runtime/server/gateway-token)"
export BROKPOT_MCP_SERVER_TOKEN='generate-a-separate-long-random-secret'
export BROKPOT_MCP_HTTP_HOST=127.0.0.1
export BROKPOT_MCP_HTTP_PORT=1541
npm run mcp:coordinator:http
```

The endpoint is `POST /mcp` and requires:

```text
Authorization: Bearer <BROKPOT_MCP_SERVER_TOKEN>
```

If an external MCP client must reach it, put the MCP endpoint behind SSH forwarding or a TLS/authenticated reverse proxy. Do not expose the Gateway token or the Gateway port publicly.

## Tools

- `brokpot_list_bots`: list/search Bots and retrieve stable Bot ids.
- `brokpot_chat_coordinator`: send a prompt to one Bot and wait for its next visible text reply.
- `brokpot_read_transcript`: read recent transcript entries, useful when delegated work outlives the chat timeout.

Prefer `agent_id` after discovery. Name lookup deliberately fails on ambiguous matches rather than silently choosing a Bot.

A coordinator prompt can be high-level, for example:

```text
Create an implementation Bot for issue 42, delegate the change, review the result, and report back with the PR.
```

Creation and delegation are performed by the coordinator using its existing Host tools and policy, not by privileged MCP-only RPCs.

## Verification

Run the isolated contract test:

```sh
npm run test:coordinator-mcp
```

The test launches a fake authenticated Gateway and the HTTP MCP server, verifies separate bearer authentication, resolves a coordinator by name, sends `sendPrompt`, and waits for a visible transcript reply. It does not need a real Gateway token or model provider.
