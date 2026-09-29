# Shared protocols and services

Protocols, settings, and infrastructure used across Host, Harness, and desktop-related logic.
Check serialization, defaults, and both sides of an interface before changing cross-boundary data.

| Directory / file | Contents |
| --- | --- |
| [gateway](gateway/README.md), [rpc](rpc), [proto.ts](proto.ts) | Gateway wire constants, RPC representations, and protocol entry |
| [settings](settings), [experiments](experiments) | Settings schemas and retained runtime experiments |
| [permissions](permissions), [local-exec](local-exec), [auto-review](auto-review) | Shared permission and execution definitions |
| [agents](agents), [transcript](transcript), [send](send) | Agent, message, and send representations |
| [mcp](mcp), [skills](skills) | Shared MCP and Skill definitions |
| [media](media), [voice-call](voice-call) | Media and call protocols |
| [node](node), [streams](streams), [parse](parse) | Node services, streams, parsing helpers |

Electron startup and Docker configuration live elsewhere. Protocol changes require checking Host, clients, and stored-data compatibility.

[Host](../host/README.md) · [Packages](../../packages/README.md) · [Source recovery](../../docs/wiki/Source-Recovery.md)

The local `botModelsV1` Gateway capability adds a model catalog and per-Bot get/set selection contracts. A null model ID inherits the Host default.

`localMcpConnectorsV1` advertises the local-only `addLocalMcpConnector({name,url,bearerToken?})` request. It contains sensitive transient form input, never a response credential.

`externalMarketplaceV1` adds source listing, search, entry details and explicit pinned installation/update RPCs for local Hosts. Existing curated Marketplace methods remain compatible.
