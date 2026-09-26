# Verification scope

This reference helps maintainers understand what each layer of evidence establishes.
For user-facing support, see [Features](Features.md).
Most results below were recorded on **2026-09-21**, with Host bfe1879 and desktop resources 0.44.0. The remote server/client evidence was added on **2026-09-24** with maintained Electron 42.11.6; it does not change the retained desktop product version. These are not a live CI badge or a claim that every check runs on every launch.

## Recorded coverage

| Layer | Evidence |
| --- | --- |
| Builds | Local/original Host and desktop; 23 Host artifacts, 22 byte-identical to the release baseline |
| Static and recovery | Strict local TypeScript, Node syntax, fragment/profile contracts, clean recovery export |
| Services | Independent healthy Host, SearXNG, and speech; Intel Electron opens the local workspace |
| Real inference | Responses streaming/tool round-trip; Agent/Auto-review writes files, captures screenshots, and persists replies |
| Desktop flow | Composer → real model → sandbox → UI reply; packaged-app demonstration creates and reads back a file |
| MCP | stdio/HTTP/SSE, restart persistence, three concurrent Agents' inline credential/workspace isolation, temporary-client cleanup |
| Plugins | Install, secrets, MCP/Skill execution, target Bot, pinned update, restart, rollback/removal, desktop interactions |
| Starter marketplace and local recipes (2026-09-24) | Compiled plugin/MCP/recipe contracts, pinned public-source imports, store lifecycle, and Gateway persisted-acceptance recovery with fixture dispatch. A private Host/Box run completed two actual recipe Bot turns: Chrome read `chrome-extensions/SKILL.md` and nested `references/extensions/api-calling.md`; Firecrawl connected with its configured endpoint and bearer key to an HTTP MCP fixture, called its tool, passed one retained auto-review, and completed. The run used nine deterministic fixture-model requests and one HTTP fixture call. This verifies the local integration against fixtures, not external model inference or Firecrawl service success. An isolated desktop run verified the combined overview and search, recipe import and editing, retained detail and Skill content, pot creation with the Skill persisted, and recipe removal that preserves the created pot. It also verified plugin installation, tool toggles, restart persistence and uninstall. |
| Speech | English/Chinese Whisper through Gateway; Kokoro preview play/end/stop and saved selection |
| Native dependencies | Piscina diff workers, tree-sitter/Bash, chunker loading |
| Runtime settings | Custom image, absolute workspace, explicit overlay, read-only Host mounts, isolation from other stacks |
| Branding and startup | Rounded PNG/ICNS, ad-hoc signed app; instrumented live desktop startup recorded zero safeStorage calls |
| Remote server/client | Fresh local-profile build and independent macOS arm64 app; persistent server lifecycle, authenticated API/SSE, two-Bot Box file transfer, token rotation, and restart recovery with a real pinned linux/amd64 Box under a linux/aarch64 Docker Engine using emulation. Deterministic model fixture only, not external inference. Packaged UI review connected session-only after a bounded encrypted-storage failure, downloaded the original 29-byte Box file, displayed the remote Box via VNC, denied a local Mac Read approval, and quit normally. |
| Remote local-computer boundary | Authenticated local-exec SSE/response auth, Host Never denial with zero action frames, disconnected-device refusal, and packaged Remote Client Deny against a random nonexistent path; no user files or OS permissions were changed |
| Portable Brokpot app (2026-09-24) | `install:mac -- --destination .runtime/tests/installed-app` built and copied a portable app on Apple silicon. From that copy, the welcome opened the independent remote connection window without local Docker, and local mode deployed its checksummed runtime to isolated user state, started only `brokpot-local`, reached healthy Gateway/search/speech, then opened the retained desktop workspace. The model URL/ID were a nonworking fixture; no external inference was exercised. The test project was stopped and test app processes closed. `release:build` then produced a Linux server archive and macOS arm64 ZIP from a clean committed tree. Both artifact hashes matched `release-build.json`, and both embedded manifests recorded that same source commit with `sourceTreeClean=true`. The ZIP is ad-hoc signed and was not notarized or published. |

Contracts cover Responses/Auto-review, voice, MCP store/scopes, plugin files, web fetch/search, transcription, and TTS.
See the [test guide](../../runtime/tests/README.md) and [demo metadata](../media/capture.json).

## Maintenance boundaries established

Recovery preserves newer Gateway event-stream echo handling and MCP execution interfaces.
Local Agent deletion skips cloud-store cleanup while retaining the original path.
Local desktop startup skips inherited Keychain initialization, stores a non-secret machine ID in a file,
and requires explicit opt-in for optional encrypted storage.

Relevant tests must continue to constrain these behaviors. Run shared-sandbox Agent and screenshot tests serially
so display contention is not mistaken for a functional failure.

## Coverage still needed

- Full voice calls, physical microphones/speakers, long conversations, and multiple parked calls.
- Broader current-Host Mac execution, GUI, file transfer, attachments, and recording workflows.
- Local adapters for image/avatar generation and Messages; additional TTS languages.
- Full original local-app workflows on non-Intel macOS, Windows/Linux desktop packaging, public signing, notarization, and installer distribution.
- Original-profile vendor authentication, billing, provisioning, and synchronization services.

Eval execution is outside the current recovery scope. A source or test file's presence does not establish runtime success;
older-version results do not replace current-version verification.

---
[Documentation](Home.md) · [Get started](Build-Guide.md) · [Configuration](Configuration.md) · [Project](../../README.md)
