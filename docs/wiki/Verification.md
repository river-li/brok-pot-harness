# Verification scope

This reference helps maintainers understand what each layer of evidence establishes.
For user-facing support, see [Features](Features.md).
The results below were recorded for the current repository on **2026-09-21**, with Host bfe1879 and desktop resources 0.44.0.
They are not a live CI badge or a claim that every check runs on every launch.

## CI policy

Every pull request runs the required offline `local`-profile gate. It covers recovery/build integrity, strict local
TypeScript, generated/runtime JavaScript syntax, offline contracts, docs export, and diff hygiene. Optional Docker,
real-provider, and macOS desktop lanes are defined by changed area and evidence layer in the [CI tiers guide](CI.md).
Recorded coverage below remains dated evidence; current CI reports the checked-out commit and, for a pull request, its
source base and head separately. Workflow definitions alone do not establish a hosted check result.

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
| Speech | English/Chinese Whisper through Gateway; Kokoro preview play/end/stop and saved selection |
| Native dependencies | Piscina diff workers, tree-sitter/Bash, chunker loading |
| Runtime settings | Custom image, absolute workspace, explicit overlay, read-only Host mounts, isolation from other stacks |
| Branding and startup | Rounded PNG/ICNS, ad-hoc signed app; instrumented live desktop startup recorded zero safeStorage calls |

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
- Full non-Intel-macOS desktop operation and packaging; public signing, notarization, and installer distribution.
- Original-profile vendor authentication, billing, provisioning, and synchronization services.

Eval execution is outside the current recovery scope. A source or test file's presence does not establish runtime success;
older-version results do not replace current-version verification.

---
[Documentation](Home.md) · [Get started](Build-Guide.md) · [Configuration](Configuration.md) · [Project](../../README.md)
