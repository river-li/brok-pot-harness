# Test guide

Run from the repository root. Choose checks for the affected behavior and distinguish contracts, live services,
and complete desktop workflows. Recorded results are in [Verification](../../docs/wiki/Verification.md).

| Layer | Command | Prerequisites / coverage |
| --- | --- | --- |
| Types | `npm run check:local` | Strict local TypeScript |
| Reconstruction / profiles | `npm run test:recovery`, `npm run test:runtime-build` | Clean recovery and fragment mapping; runtime reconstruction/profile selection. `npm run docs:check` separately validates Wiki links and scoped guidance. |
| Inference/review contracts | `npm run test:responses-contract` | Compiled adapters; events, conversion, errors, review protocols |
| Agent runner fixture | `docker compose -f runtime/compose.yaml exec app node /opt/grokbot/tests/agent-sandbox.cjs` | Ready `gbh-local` app; retained Agent loop and sandbox tools against a deterministic Responses fixture, not external inference |
| Agent real-model flow | `docker compose -f runtime/compose.yaml exec app node /opt/grokbot/tests/agent-live.cjs` | Ready `gbh-local` app and `LITELLM_API_KEY`; calls the configured API and may incur charges |
| Host Gateway smoke | `SAND_GATEWAY_TOKEN="$(cat .runtime/gateway-token)" node runtime/tests/gateway.cjs` | Ready isolated Host and disposable data; exercises basic APIs and transcript persistence, leaves a test Agent record |
| Web contracts | `npm run test:web-fetch`, `npm run test:web-search` | Local test services; boundaries and failures |
| Speech contracts | `npm run test:transcription`, `npm run test:tts`, `npm run test:voice` | Adapters, tickets, call protocols |
| MCP/plugin contracts | `npm run test:mcp-store`, `npm run test:mcp-scopes`, `npm run test:plugin-files` | Configuration, scope, filesystem handling |
| Marketplace contract | `npm run test:marketplace-contract` | Pinned-source import and provenance, local plugin edits/configuration, and recipe preview/import/update/remove contracts; source fetches use an in-process fixture |
| Keychain policy | `npm run test:desktop-keychain` | Conditional storage and machine identity |
| Remote Host/client contracts | `npm run test:remote-contracts` | Loopback-only Gateway connection, encrypted server-scoped credentials, bounded isolated OS-storage helper, server lifecycle config, interruption journal, and redacted provider smoke behavior |
| Release manager and archive | `node --test runtime/tests/release-manager-contract.cjs`; `python3 -m unittest runtime/tests/test_release_extract.py` | Package inventory, update failure/rollback checkpoints, startup retry, stale-lock policy, actual updater process interruption plus manual recovery, and safe tar extraction. |
| Candidate promotion policy | `python3 -m unittest runtime/tests/test_validate_preview_candidate.py` | Exact trusted workflow, commit, attempt, successful candidate jobs, preview version, and merged source PR; rejects stale or failed candidates. |
| Remote server and Box | `node runtime/tests/remote-server-live.cjs` | Private Compose project and real pinned Box across an isolated loopback network boundary; deterministic Responses fixture, not external inference. Verifies authenticated API/SSE, attachment transfer, turn restart/coalescing recovery, explicit Stop, and the authenticated local-exec Never/disconnect gates against random nonexistent paths. `GBH_REMOTE_TEST_UI_REVIEW=1` adds a held-open packaged-app review: download a real Box attachment, then deny one local Read approval on a random nonexistent path. |
| Extracted server artifact and Box | `GBH_REMOTE_TEST_ROOT=/path/to/extracted-package GBH_REMOTE_TEST_OUTPUT=/tmp/gbh-release-test node runtime/tests/remote-server-live.cjs` | Runs the Box integration with the extracted archive's `runtime/server.cjs` and `runtime/compose.yaml`, outside the source checkout. A release manifest selects `install.sh`, the generated launcher, and release-manager update/rollback automatically. The model remains a deterministic fixture; Box is real. Cleanup stops the private Compose project before removing only that run's speech model cache, then records PASS after all test-owned state is removed. |
| External provider smoke | `npm run server:provider-smoke` | One fixed request using the configured server URL/model/key; may incur a charge and never prints the response or key |
| Real model | `npm run test:responses` | Current endpoint/key; may incur API charges |
| Real desktop | `npm run test:desktop-live`, `npm run test:desktop-keychain-live` | Prepared Electron and local runtime |
| MCP/plugin integration | `npm run test:plugins-live`; `node runtime/tests/mcp-inline-live.cjs` | Running Box and test services. `plugins-live.cjs` also drives the desktop's local recipe import, edit, Bot setup, and removal flow when running in its normal UI mode. `GROKBOT_TEST_PLUGINS_UI_ONLY=1 npm run test:plugins-live` skips the separate plugin Agent turns while retaining the desktop recipe/Skill-persistence and plugin installation/restart/removal checks. Both modes use a private Box and deterministic model fixture; they do not establish external inference. |
| Mac execution | `npm run test:mac-exec-live` | Desktop bridge and relevant system capabilities |
| Audio integration | `npm run test:desktop-transcription`, `npm run test:desktop-tts` | Speech service, desktop, synthetic audio fixture |
| Call integration | `npm run test:desktop-voice`, `npm run test:voice-real-api` | See [voice bridge](../VOICE.md); the latter calls a real model |

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

The remote integration creates a unique `gbh-remote-test-*` Compose project and
private state under `.runtime/tests`; it stops/removes only that project. It
uses the pinned `linux/amd64` Box image and may run under Docker emulation. Do
not start it if another instance of this exact task-owned test is active. The
optional UI barrier writes only private fixture connection metadata; it uses a
known dummy token and never reads the operator's credentials or local files.

## Interpret results correctly

A deterministic model fixture with a real Box can prove tool execution and approvals, not external model availability.
Synthetic microphone input covers encoding and IPC, not hardware permissions or acoustic echo.
Contracts do not replace real UI workflows.

Run shared-Box/display tests serially. The Agent fixture runs inside the local
app container but creates its own temporary Host/data and uses a deterministic
Responses fixture. The Gateway smoke uses the selected Host data directory and
leaves its test Agent in place, so point it at disposable data. Isolated tests
use private containers and profiles and clean up only their own resources.
Keep useful diagnostics under ignored `.runtime/tests`, without secrets or user
sessions.
