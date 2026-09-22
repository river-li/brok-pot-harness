# mcp-core

MCP connection lifecycle, authentication state machines, reconnection, and service policies.

## Start reading

| Entry | Purpose |
| --- | --- |
| [dist/fsm/connection-fsm.js](dist/fsm/connection-fsm.js) | Connection Fsm |
| [dist/fsm/auth-fsm.js](dist/fsm/auth-fsm.js) | Auth Fsm |
| [dist/transport/reconnect-manager.js](dist/transport/reconnect-manager.js) | Reconnect Manager |
| [dist/config/mcp-config-service.js](dist/config/mcp-config-service.js) | MCP Config Service |

## Change boundaries

Validate cancellation and cleanup when changing authentication or reconnects. Disabling GBH vendor login must not disable external MCP authentication.

Related modules: [mcp-agent-exec](../mcp-agent-exec/README.md) · [cursor-plugins](../cursor-plugins/README.md). These are reading links, not npm dependency declarations.

Build from the repository root. See [source recovery](../../docs/wiki/Source-Recovery.md) for bundle-scope rules and [development](../../docs/wiki/Development.md) for verification.

[← Package map](../README.md)
