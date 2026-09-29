# Local service adapters

Standalone strict TypeScript connecting retained Host/Harness interfaces to local services and a configurable model API.
The root build compiles this tree into `dist/local`, then copies it into Host and desktop artifacts.

| Module | Responsibility |
| --- | --- |
| [responses.ts](responses.ts) | Message conversion, SSE, streaming tool calls, Responses executor |
| [auto-review.ts](auto-review.ts) | Local review through the configured model |
| [host-auth.ts](host-auth.ts), [desktop-account.ts](desktop-account.ts) | Local identity and desktop account views |
| [desktop-machines.ts](desktop-machines.ts), [machine-labels.ts](machine-labels.ts) | Machine metadata |
| [mcp-store.ts](mcp-store.ts), [mcp-scopes.ts](mcp-scopes.ts), [desktop-mcp.ts](desktop-mcp.ts) | MCP persistence, scopes, desktop interfaces |
| [marketplace.ts](marketplace.ts) | Pinned public starter metadata, source-file fetching, and provenance |
| [plugins.ts](plugins.ts), [plugin-files.ts](plugin-files.ts) | Plugin catalog and lifecycle, marketplace install/update/remove, file and local-edit validation |
| [bot-recipes.ts](bot-recipes.ts) | Curated and user-imported local recipe storage, dependency mapping, and durable Bot setup records |
| [web-fetch.ts](web-fetch.ts), [web-fetch-network.ts](web-fetch-network.ts), [web-search.ts](web-search.ts) | Web content and search |
| [transcription.ts](transcription.ts), [tts.ts](tts.ts) | Whisper/Kokoro HTTP adapters |
| [voice-credential.ts](voice-credential.ts), [voice-server.ts](voice-server.ts), [voice-call.ts](voice-call.ts) | Call tickets, WebSocket server, call flow |

WebFetch runs on the Host and permits public Internet destinations only. It validates
every redirect and the DNS answers used by each new socket, rejecting private,
loopback, link-local, metadata and special-use IP ranges. Fixture callers may set
the code-only `allowPrivateNetwork` option; production callers must keep its default
`false`. No environment variable enables private-network access.

## Edit and verify

Run `npm run check:local` and `npm run build -- --profile local` at the repository root, then the relevant
[contracts/integrations](../../../../runtime/tests/README.md), including `npm run test:marketplace-contract` after marketplace changes. Preserve cancellation, size limits, approvals,
and tool-call pairing. Model keys must not reach the renderer, speech services, or tool subprocesses.

[Configuration](../../../../docs/wiki/Configuration.md) · [Harness](../../README.md) · [Voice bridge](../../../../runtime/VOICE.md)

## Per-Bot model routing

`bot-models.ts` owns Host-persisted model overrides under `SAND_DATA_ROOT/bot-models`. The authenticated catalog comes from the configured Responses endpoint. `responses.ts` snapshots the owning Bot model for each session; changing an override affects the next session, not another Bot. Summarization follows the owning Bot; unowned sessions, voice and auto-review retain the server default.

Pinned marketplace sources include selected OpenAI and Anthropic Skill directories. Directory remapping preserves resource-relative paths, licenses and content hashes.

`external-marketplace.ts` adapts MCP Registry, ClawHub, configured GitHub Skills repositories and GitHub topic searches ranked by repository stars into searchable catalogs and pinned imports. Topic searches return actual Skill directories with publisher-qualified identities, bounded pagination and fresh revision checks before import. `marketplace-http.ts` owns bounded public-only HTTPS requests. Source configuration lives in the Host data root; see [Marketplace](../../../../docs/wiki/Marketplace.md#external-catalogs).
