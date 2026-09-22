# Migration status

Target Host: **bfe1879**. Port source: tested local adapters from 2bea36a.
Desktop resources: **0.44.0**, copied into this repository; compatibility with
the new Host must be verified independently. Original release files are retained.

## Implemented

- Native-layout reconstruction across 23 shipped JS/MJS/CJS artifacts and 2,104
  recovered source paths. Source fragment markers preserve scope and ordering.
- 36 local integration patches ported. Manual merges preserve the newer Gateway
  event-stream echo handling and MCP load options/execution interface.
- Strict local adapters: Responses inference, Auto-review, local plugins/MCP,
  WebFetch/search, speech/voice and local machine metadata.
- local/original build profiles retain remote implementations while selecting
  the execution mode before startup.
- Self-contained copied dependencies and desktop resources; independent gbh-local
  stack, ports and data. No prior user state or credentials migrated.

## Verified in this repository (2026-09-21)

- Both local/original Host and desktop builds. Each Host profile produces 23
  artifacts; 22 are byte-identical to bfe1879. Original code remains present.
- Strict local TypeScript checks, all 23 output scripts' Node syntax,
  reconstruction/profile contracts and clean-baseline recovery export.
- Responses/Auto-review, voice, MCP scope/store, plugin filesystem, WebFetch,
  WebSearch, transcription and TTS contracts.
- Independent Host/search/speech containers healthy; Intel Electron launches
  the original interface in a local workspace without vendor login.
- Real gpt-5.6-sol Responses streaming/tool round-trip, then retained Agent and
  Auto-review executing real sandbox file writes and screenshots, persisted
  final response and idle completion.
- Original desktop composer → real model → sandbox → rendered persisted reply.
- MCP stdio/HTTP/SSE and restart persistence; three concurrent Agents with
  separate inline credentials, workspace scopes and temporary-client cleanup.
- Local plugin catalog/install, secrets, MCP/Skill execution, targeted Bot,
  pinned update, restart persistence, rollback/uninstall; original desktop UI.
- English/Chinese Whisper transcription through the authenticated Host gateway;
  Kokoro voice preview playback/end/stop and saved selection across restart.
- Piscina diff workers, native tree-sitter/Bash and native chunker load.
- Compose configuration validation for custom Sandbox image, absolute workspace
  path, an explicit overlay, and preserved read-only Host mounts; overlay status
  reads the same isolated stack without changing running services.
- `git diff --check` (upstream resource and literal whitespace is explicitly retained).

The initial domain-based API test failed because this Mac cannot resolve
litellm.home. The same server at 192.168.0.104:4000 passed the real API tests;
only the untracked .env selects that address. No key was copied or recorded.
Early concurrently run Agent fixtures contended for the shared sandbox. MCP and
real-model tests subsequently passed. A final serial basic Agent fixture also
passed after restart; shared-sandbox tests should run serially.

## Migration-specific follow-up

A new bfe1879 deletion path attempted cloud store cleanup even with background
sync disabled. Local mode now skips that cleanup while retaining the original
implementation. A final Agent fixture and deletion completed without remote
store cleanup errors. The 36 migrated modules plus this additional fix are conditional.

Full voice-call flows, Mac execution/GUI and other remaining desktop workflows
have not been revalidated on this Host version. Copied tests remain available;
the old checkout's results are not evidence for this version.

## Existing restoration limits

Image/avatar generation and local Messages integration still need local adapters.
Physical microphone/speaker behavior, additional TTS languages, Mac GUI control,
file transfer, attachment/recording and other desktop workflows need broader
checks. Original erased types/imports cannot be inferred faithfully from bundles.
Eval execution remains out of scope. These limits are not migration successes.
