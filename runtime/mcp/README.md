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

### HTTP mode: direct Gateway bearer (default)

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

### HTTP mode: OAuth for ChatGPT

`BROKPOT_MCP_AUTH_MODE=oauth` enables authorization-code + S256 PKCE through
the pinned `@node-oauth/oauth2-server` library. ChatGPT receives separate opaque
MCP access/refresh tokens. The Gateway token never becomes a tool argument or an
MCP bearer token in this mode. The existing authenticated Gateway RPCs and Bot
approval policy remain unchanged.

Run `npm ci` after updating the source. Configure a public HTTPS origin and the
**exact callback shown in your ChatGPT MCP management page**:

```sh
export SAND_HOST_GATEWAY_URL=http://127.0.0.1:1540
export BROKPOT_MCP_AUTH_MODE=oauth
export BROKPOT_MCP_PUBLIC_URL=https://brokpot.example.com
export BROKPOT_MCP_OAUTH_REDIRECT_URIS='["https://chatgpt.com/connector_platform_oauth_redirect"]'
npm run mcp:coordinator:http
```

The example callback is ChatGPT's stable callback. Use it only when it matches
the management page. The bridge includes the issuer (`iss`) in authorization
redirects and advertises that capability. The public URL is an origin, without
a path/query; the MCP resource is exactly `https://brokpot.example.com/mcp`.
HTTP public URLs are accepted only for loopback development, not remote access.

1. Put the loopback-bound bridge behind a trusted HTTPS reverse proxy. Forward
   `/mcp`, `/oauth/*`, and `/.well-known/*` without rewriting paths; preserve
   `Authorization`, `Origin`, cookies, form bodies, and `WWW-Authenticate`.
   Do not put another login page in front of discovery or OAuth endpoints.
   Enforce request/rate limits at the proxy and disable sensitive query/body/
   header logging. Never expose the plaintext listener directly to the internet.
2. In ChatGPT, add `https://brokpot.example.com/mcp`, select OAuth and CIMD.
   The default client ID is `https://chatgpt.com/oauth/client.json`. No client
   secret is generated or required; token endpoint authentication is `none`
   with mandatory PKCE. This identifies the public client and does not prove a
   request's network origin; use the official mTLS guidance if that is needed.
3. On the trusted Brokpot authorization page, review the client, callback and
   permissions. Enter the existing Gateway token there and approve. If the
   optional bridge second factor is configured, enter it on the same form.
   Do not paste either credential in ChatGPT. Cancellation grants no access.
4. ChatGPT exchanges the one-use code and uses the new access token in the
   `Authorization: Bearer` header. A raw Gateway token is rejected on `/mcp`
   in OAuth mode, even if it would be valid directly against the Gateway.

Client configuration:

- `BROKPOT_MCP_OAUTH_CLIENT_ID` optionally selects the exact callback-specific
  ChatGPT metadata URL shown in its management page. Only `chatgpt.com/oauth/…/client.json`
  URLs in the supported shape may be fetched; redirects, arbitrary hosts and
  client-supplied discovery URLs are rejected. The metadata must support public
  client authentication, code/refresh grants and the configured callback.
- For a manually registered public client, set that variable to an identifier
  containing only letters, digits, `_` or `-`, and configure exact callbacks in
  `BROKPOT_MCP_OAUTH_REDIRECT_URIS`. Enter that same client ID in the client UI.
  CIMD is then disabled. There is no DCR endpoint or client-secret flow.
- Discovery endpoints are `/.well-known/oauth-protected-resource/mcp` (also
  available at the root well-known path) and `/.well-known/oauth-authorization-server`.
- `brokpot:read` allows observation, including all Host conversations exposed by
  these tools. `brokpot:write` allows `brokpot_send_message`, which may start
  work. Request both for the complete tool set; a read-only grant cannot send.
- Access tokens expire after 15 minutes. Refresh tokens rotate on use; reuse
  revokes the whole grant. Memory-only grants expire after seven days; durable
  grants below have no fixed expiry. Tokens
  are bound to this exact MCP resource; `resource` is required on authorization
  and token requests. Refresh cannot expand scope.
- `POST /oauth/revoke` accepts a form containing `client_id` and `token` (an
  access or refresh token), and revokes that complete grant. Unknown tokens
  return success without revealing whether an account exists.
- The consent page uses `Referrer-Policy: strict-origin` so native browser form
  submissions preserve the `Origin` required by the CSRF check. Its CSP permits
  form submission to itself and the validated callback origin, because Chromium
  checks the callback redirect too. Code redirects retain `no-referrer`; exact
  callback, Origin, browser cookie and one-use transaction checks remain required.
- MCP authorization is checked again after receiving the request body. A token
  revoked or expired while the body was pending cannot start Gateway work.

### Durable login (optional)

Use Node **22.13 or newer** for SQLite support and configure both variables:

```sh
export BROKPOT_MCP_OAUTH_STORE_DIR=/var/lib/gbh-mcp/oauth-durable
export BROKPOT_MCP_OAUTH_KEY_FILE=/run/credentials/gbh-mcp.service/oauth-key
```

Create a random **32-byte binary** key once, outside the store directory; do not
replace it during deploys. With systemd, keep the source key root-owned 0600 and
inject it with `LoadCredential=oauth-key:/etc/gbh-mcp/oauth-state.key`. Set the key
file environment variable to `%d/oauth-key` in the unit. Use a private 0700 state
directory under `StateDirectory=gbh-mcp`. The bridge accepts a read-only 0440 credential inside a private service-owned
directory, or systemd's exact `/run/credentials/…` directory identified by
`CREDENTIALS_DIRECTORY` with root-owned 0550/0440 directory/file modes. The latter
uses systemd's service-specific ACL/mount isolation; arbitrary group-readable
key files are still rejected.
Never put the key bytes in environment variables, repository files or logs.

`grants.sqlite` stores AES-256-GCM encrypted state. MCP token values are not stored;
Gateway credentials and refresh-signing secrets are encrypted with the separate
key. Access tokens last 15 minutes. Durable grants/refresh tokens have no fixed
expiry and survive restarts until revoked. Rotating a Gateway token blocks future
Gateway calls; the next rejected MCP operation persists revocation of its grant.
ChatGPT may still require reconnection for its own account/client policies.

Memory-only grants cannot migrate: users reconnect once when durable mode is first
enabled. Pending consent forms and authorization codes remain ephemeral; restart
those flows after a service restart. Keep the same store, key and public identity
across releases. Missing keys, corruption or binding changes fail closed, never
silently clear the database. Storage failures latch OAuth unavailable until repair
and restart. An interrupted refresh exchange may require reconnecting if the
rotation committed before its response reached the client.

Operate **one process on one machine, with a local filesystem**. A live owner
prevents a second bridge from opening the store; a dead owner is recovered after
crash. Do not use network filesystems or replicas. Grants are capped at 4,096 and
access/refresh records at 16,384 per type. Durable refresh rotation keeps one
current hash per grant and detects replay by authenticated generation, so its
history does not grow. Memory mode keeps used refresh hashes until expiry. At
capacity, retry after access records expire or revoke unused grants.

Back up the database while the service is stopped and protect the key separately.
Do not restore old grants as though revocations were current: restoring a stale
backup can resurrect revoked access. After disaster recovery or suspected key
exposure, stop the service, archive the old store securely, provision a new key
and empty store, and reconnect. This also provides an explicit revoke-all/key
rotation procedure; stopping/restarting alone no longer revokes durable grants.
See [storage design and failure boundaries](OAUTH-STORAGE.md) for the threat model.

Without the two variables, the existing seven-day memory-only mode remains and
restart clears grants. Existing no-auth wrappers must not remain exposed.

Protocol references:
[OpenAI authentication](https://developers.openai.com/plugins/build/auth),
[MCP authorization](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization),
[OAuth library](https://node-oauth.github.io/node-oauth2-server/).

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
- OAuth discovery and challenges, consent/CSRF, exact callbacks, S256 PKCE,
  resource/scope checks, token expiry/replay, refresh rotation and revocation;
- OAuth transport credentials and tool metadata, using only synthetic tokens.

It uses a fake HTTP Gateway and does not require a real model or real Gateway token.
The suite is also included in the required offline gates (`npm run ci:pre-pr`).
