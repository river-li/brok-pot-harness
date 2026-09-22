# Shared protocols and services

Protocols, settings, and infrastructure used across Host, Harness, and desktop-related logic.
Check serialization, defaults, and both sides of an interface before changing cross-boundary data.

| Directory / file | Contents |
| --- | --- |
| [gateway](gateway), [rpc](rpc), [proto.ts](proto.ts) | Gateway/RPC representations and protocol entry |
| [settings](settings), [experiments](experiments) | Settings schemas and retained runtime experiments |
| [permissions](permissions), [local-exec](local-exec), [auto-review](auto-review) | Shared permission and execution definitions |
| [agents](agents), [transcript](transcript), [send](send) | Agent, message, and send representations |
| [mcp](mcp), [skills](skills) | Shared MCP and Skill definitions |
| [media](media), [voice-call](voice-call) | Media and call protocols |
| [node](node), [streams](streams), [parse](parse) | Node services, streams, parsing helpers |

Electron startup and Docker configuration live elsewhere. Protocol changes require checking Host, clients, and stored-data compatibility.

[Host](../host/README.md) · [Packages](../../packages/README.md) · [Source recovery](../../docs/wiki/Source-Recovery.md)
