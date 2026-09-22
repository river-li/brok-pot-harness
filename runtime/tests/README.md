# Test guide

Run from the repository root. Choose checks for the affected behavior and distinguish contracts, live services,
and complete desktop workflows. Recorded results are in [Verification](../../docs/wiki/Verification.md).

| Layer | npm script | Prerequisites / coverage |
| --- | --- | --- |
| Types | `check:local` | Strict local TypeScript |
| Build | `test:recovery`, `test:runtime-build` | Python; recovery, fragments, profiles, documentation exporter |
| Inference/review contracts | `test:responses-contract` | Compiled adapters; events, conversion, errors, review protocols |
| Web contracts | `test:web-fetch`, `test:web-search` | Local test services; boundaries and failures |
| Speech contracts | `test:transcription`, `test:tts`, `test:voice` | Adapters, tickets, call protocols |
| MCP/plugin contracts | `test:mcp-store`, `test:mcp-scopes`, `test:plugin-files` | Configuration, scope, filesystem handling |
| Keychain policy | `test:desktop-keychain` | Conditional storage and machine identity |
| Real model | `test:responses` | Current endpoint/key; may incur API charges |
| Real desktop | `test:desktop-live`, `test:desktop-keychain-live` | Prepared Electron and local runtime |
| MCP/plugin integration | `test:plugins-live`; `mcp-inline-live.cjs` and related scripts | Running Box and test services |
| Mac execution | `test:mac-exec-live` | Desktop bridge and relevant system capabilities |
| Audio integration | `test:desktop-transcription`, `test:desktop-tts` | Speech service, desktop, synthetic audio fixture |
| Call integration | `test:desktop-voice`, `test:voice-real-api` | See [voice bridge](../VOICE.md); the latter calls a real model |

## Common preparation

```sh
npm run build -- --profile local
npm run check:local
npm run test:responses-contract
npm run test:mcp-scopes
npm run test:plugin-files
```

As needed for live tests, run `npm start`, wait for health, and `npm run prepare:desktop -- --profile local`.
Generate speech fixtures with `python3 runtime/tests/create-speech-fixtures.py`.
See [speech](../speech/README.md) for offline service tests.

## Interpret results correctly

A deterministic model fixture with a real Box can prove tool execution and approvals, not external model availability.
Synthetic microphone input covers encoding and IPC, not hardware permissions or acoustic echo.
Contracts do not replace real UI workflows.

Run shared-Box/display tests serially. Isolated tests use private containers and profiles and clean up only their own resources.
Keep useful diagnostics under ignored `.runtime/tests`, without secrets or user sessions.
