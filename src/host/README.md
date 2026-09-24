# Host

Host is the application service between desktop and Agent. It accepts Gateway requests, manages sessions and execution
lifecycle, and composes Box, inference, MCP, permissions, and persistence.

## From startup to task execution

| Entry point | Purpose |
| --- | --- |
| [main.ts](main.ts), [host-boot.ts](host-boot.ts) | Process entry and startup composition |
| [sand-host.ts](sand-host.ts), [host-runner-composition.ts](host-runner-composition.ts) | Host and runner assembly |
| [gateway-server.ts](gateway-server.ts), [host-gateway-api.ts](host-gateway-api.ts) | Gateway server and application APIs |
| [extensions/registry.ts](extensions/registry.ts) | Extension registration; dependencies determine boot order |
| [transcript](extensions/transcript/README.md) | Messages, scheduling, and run lifecycle |
| [session](extensions/session/README.md) | Sessions and databases |
| [ports](ports) | Host service ports |
| [box](box), [storage](storage) | Box and persistence support |

## Where changes belong

Put application capabilities in their extensions, shared protocols in `src/shared`, and Agent prompts/tool composition
in the Harness. Runtime launchers load configuration; do not put machine addresses or credentials in generated bundles.

In the remote server profile the Host remains the owner of Bots, Box execution,
approvals, and persistent state. The authenticated Gateway serves remote
clients; its loopback-only deployment and client protocol are documented in
[Remote server and desktop client](../../docs/wiki/Remote-Server.md). Accepted
user turns that are still in flight across Host restart are journaled beside
Host profile data by `durable-file-policy.ts` and the transcript extension.

[Host extension map](extensions/README.md) · [Request flow](../../docs/wiki/Architecture.md) ·
[Development](../../docs/wiki/Development.md) · [Parent](../README.md)
