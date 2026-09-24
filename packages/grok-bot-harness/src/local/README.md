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
| [web-fetch.ts](web-fetch.ts), [web-search.ts](web-search.ts) | Web content and search |
| [transcription.ts](transcription.ts), [tts.ts](tts.ts) | Whisper/Kokoro HTTP adapters |
| [voice-credential.ts](voice-credential.ts), [voice-server.ts](voice-server.ts), [voice-call.ts](voice-call.ts) | Call tickets, WebSocket server, call flow |

## Edit and verify

Run `npm run check:local` and `npm run build -- --profile local` at the repository root, then the relevant
[contracts/integrations](../../../../runtime/tests/README.md), including `npm run test:marketplace-contract` after marketplace changes. Preserve cancellation, size limits, approvals,
and tool-call pairing. Model keys must not reach the renderer, speech services, or tool subprocesses.

[Configuration](../../../../docs/wiki/Configuration.md) · [Harness](../../README.md) · [Voice bridge](../../../../runtime/VOICE.md)
