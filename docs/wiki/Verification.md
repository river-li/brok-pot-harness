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

## Private Firecracker deployment (2026-09-27)

A private local-profile snapshot of the hardened source ran inside
Firecracker/Jailer 1.17.0, with Ubuntu 24.04, guest kernel 6.8.0-142-generic,
Docker 29.8.1 and Node 24.14.0. The 64 GiB sparse guest disk resides on the
operator's separately mounted data volume. Live checks confirmed:

- Actual KVM boot, an unprivileged VMM, seccomp, private PID/network namespaces,
  the dedicated Jailer root and systemd resource limits.
- Guest denial of host SSH, direct LiteLLM, database, cloud metadata and the
  server's public-address hairpin, while the inference relay and public HTTPS work.
- Healthy Host, search and speech containers. Search explicitly binds IPv4 for
  compatibility with the guest's disabled IPv6.
- Minimal anonymous Gateway health and authenticated API access; hostile,
  opaque and missing Origins rejected by both display proxies; primary
  same-origin WebSocket handshake accepted.
- A real `gpt-5.6-sol` Responses request and Bot shell-tool/write/read/reply
  round-trip through the existing LiteLLM service. Box root installed and ran
  a Debian package, then removed the disposable package and verification Bot.
- Controlled VMM stop/start after fixing transient Jailer-node cleanup; Gateway
  readiness and its persisted credential survived. Speech termination completed
  in approximately 1.4 seconds after adding its init process.

The dedicated LiteLLM key has no spending, token, request-rate or key-level
parallel-request quotas, per the operator's instruction. The guest sees only a
separate relay token. Existing unrelated host containers were not restarted.
These results do not verify full desktop rendering, speech transcription/TTS,
every attachment or browser workflow, tenant isolation, or a host reboot.
Host kernel 7.0 and guest kernel 6.8 are outside Firecracker's published tested
matrix. Host and Box remain one trust domain inside the guest. See the
[deployment guide](../../runtime/firecracker/README.md) and
[security review](Security-Review.md).

The subsequent Android ingress uses checksum-pinned Caddy 2.11.4 and a publicly
trusted Let's Encrypt IP-address certificate with automatic short-lived renewal.
An external client verified the certificate and IP SAN without bypassing TLS,
rejected absent/wrong bearer tokens, wrong Host headers and non-mobile routes,
and completed authenticated Android capability discovery, Bot roster and SSE
reads. No physical Android device was connected during this check; these are
network/protocol results, not a device UI acceptance. A read-only independent
review checked the ingress's route/auth boundaries and token rotation procedure.

A later reported credential rejection was investigated with the normal debug
Android APK on an API 36 arm64 emulator. The actual connection form was filled
with the deployed public HTTPS origin and the previously supplied Gateway token;
the app reached its workspace and the Servers page displayed `Connected`.
Corresponding Android HTTP/2 requests returned 200. This run did not reproduce
the physical phone's reported rejection. No client code or token was changed.
Temporary diagnostics excluded credentials, headers, URLs and bodies and were
removed afterward; the test app's data was cleared and its emulator stopped.

## Maintenance boundaries established

Recovery preserves newer Gateway event-stream echo handling and MCP execution interfaces.
Local Agent deletion skips cloud-store cleanup while retaining the original path.
Local desktop startup skips inherited Keychain initialization, stores a non-secret machine ID in a file,
and requires explicit opt-in for optional encrypted storage.

Relevant tests must continue to constrain these behaviors. Run shared-sandbox Agent and screenshot tests serially
so display contention is not mistaken for a functional failure.

## Coverage still needed

The [2026-09-27 security review](Security-Review.md) records a later source review
and targeted hardening tests. Its new Docker >=28 gate, display Origin guard,
Host WebFetch policy and attachment checks still need broader desktop integration;
the private microVM checks above establish only their stated live scope.
Host/Box privilege separation remains unresolved.

- Full voice calls, physical microphones/speakers, long conversations, and multiple parked calls.
- Broader current-Host Mac execution, GUI, file transfer, attachments, and recording workflows.
- Local adapters for image/avatar generation and Messages; additional TTS languages.
- Full original local-app workflows on non-Intel macOS, Windows/Linux desktop packaging, public signing, notarization, and installer distribution.
- Original-profile vendor authentication, billing, provisioning, and synchronization services.

Eval execution is outside the current recovery scope. A source or test file's presence does not establish runtime success;
older-version results do not replace current-version verification.

---
[Documentation](Home.md) · [Get started](Build-Guide.md) · [Configuration](Configuration.md) · [Project](../../README.md)

## Per-Bot model routing — 2026-09-27

The local Host now advertises `botModelsV1`. Local type checking, bundle build,
25 runtime-build tests, the Responses contract and the dedicated model-routing
fixture passed. The latter observes two concurrent HTTP requests with distinct
model IDs, persistence, default inheritance and immutable session selection.
Six relay tests cover request validation, model allowlists and filtered discovery.
On the deployed Firecracker Host, two temporary Bots assigned `gpt-5.6-sol` and
`gpt-5.6-luna` concurrently produced the requested READY reply. This does not
establish inference compatibility for every other configured alias.

## Mobile capability catalog update (2026-09-28)

`npm run check:local`, `npm run build`, `npm run test:runtime-build` (26 checks),
`node --test runtime/tests/marketplace-contract.cjs`, and the two
`client-capabilities-contract.cjs` tests passed. Public pinned imports fetched
OpenAI gh-fix-ci (6 files), Anthropic webapp-testing (6), and frontend-design (2),
with license/resource retention and blob hash verification. This proves import,
not execution of those Skills or their optional dependencies.

The deployed Firecracker Host was updated after all existing Bots became idle.
Its catalog exposes the three additional public entries and retains installed
local plugins. A disposable Bot's Skill was created/read; an HTTPS connector was
added via the new Gateway API and persisted, then removed. Its intentionally
non-MCP example.com endpoint reported error as expected. The fixture Bot and
connector were deleted; existing Bots and model configuration were retained.
No external provider OAuth or authenticated MCP tool invocation is claimed.

## External Marketplace — 2026-09-28

Android 0.4.0 (versionCode 5) and the local Host add `externalMarketplaceV1`.
Verified source builds/type checks, 26 runtime reconstruction tests, 13 focused
marketplace/plugin contracts, and the retained plugin loader in a network-disabled
Linux amd64 sandbox. The latter checks Skill parsing, idempotent install, explicit
update, refusal of local edits, MCP header resolution, secret-free catalog output
and uninstall; it does not invoke an external MCP tool.

On the deployed Firecracker Host, all four sources returned live catalog pages.
A previously absent ClawHub Skill was installed, recognized by the retained Skill
parser, replayed idempotently and uninstalled; only its test import cache was
removed. Read-only live checks also fetched OpenAI/Anthropic GitHub catalogs and
MCP Registry entries. Private evidence is in `.runtime/tests/external-marketplace`.
OAuth completion, package execution and per-Bot extension assignment are not
implemented or claimed by these checks.

### macOS direct HTTPS, initial API-only ingress — 2026-09-29

The macOS remote launcher accepts trusted HTTPS endpoints and keeps cleartext
HTTP limited to loopback SSH forwarding. HTTPS connections use encrypted
server-scoped storage, suppress private Box display URLs, and disable derived
egress tunnels. Gateway bootstrap, commands and event streaming refuse redirects.
The existing HTTPS ingress still exposes API/SSE only; Box display and Mac tool
channels require SSH mode.

Verified 33 remote contracts, 27 runtime build tests (including display isolation),
two Keychain contracts, and the real Electron startup Keychain audit. A read-only
public HTTPS probe authenticated, read the Bot roster, and received event-stream
bytes. The prepared Electron workspace visibly loaded ten roster names from the
deployed Host using a disposable profile; no prompt or installation was submitted.
The unified macOS app was rebuilt, ad-hoc signed, and installed in the user's
Applications directory. Evidence is in `.runtime/tests/remote-https`. This does
not establish attachment transfer, voice, or Mac tool support through HTTPS.

### GitHub topic discovery — 2026-09-28

The source Host now adds `github-topic` discovery through GitHub repository search,
ranked by stars. Local type checking, source build and nine external-marketplace
contract tests passed. Fixtures cover complete within-repository pagination,
root/nested imports and license preservation, fixed blob hashes, fresh commit and
topic checks, constrained queries, incomplete/oversized listings and GitHub 403
backoff. A read-only live query for `humanizer` returned `blader/humanizer` and
resolved its root Skill detail (14 files). This verifies public search/detail,
not execution of community content.

The Firecracker Host was subsequently updated after confirming all five Bots
were idle. The two changed source/runtime files were backed up and their deployed
SHA-256 digests verified; the application container restarted successfully. Public
HTTPS Gateway checks returned all five sources, 20 Skills on the first popular
page, 12 on the next repository page without duplicate keys, and the humanizer
keyword result with its 14-file detail. All five existing Bots remained present.
Private deployment and read-only verification evidence is under
`.runtime/tests/github-topic-deploy`. No community Skill was installed as part of
this deployment. No Android live UI or authenticated provider test was performed.

### Shared remote gateway and Box displays — 2026-09-29

This supersedes the API-only HTTPS limitation above. The deployment now runs a
fixed-upstream authenticated gateway behind the existing Caddy TLS endpoint.
Host RPC, SSE, avatars, local-exec, WebAuthn and cookie-origin approval routes
retain their original protocols. Browser display capabilities expire after 12
hours, cannot authorize Host API, and require the exact public WebSocket Origin.
The Host application, its user data, Firecracker and LiteLLM were not replaced.
Ingress rollback files are root-only under
`/srv/gbh-firecracker/backups/full-gateway-20260929`.

Passed: local TypeScript check, reconstruction/build, desktop preparation and
installation, 34 remote contracts, 27 runtime tests, desktop keychain contracts,
documentation checks and whitespace checks. Real HTTPS probes read 15 Bots,
received SSE data, loaded noVNC assets, and received primary and Bot-window VNC
handshakes. Anonymous and display-token Host calls, and foreign-origin display
WebSockets, were rejected. Electron rendered the primary and a Bot's separate
1280×800 desktop. The actual retained macOS app also opened a Bot chat and its
Box webview, which reported an encrypted connection and a rendered framebuffer.
Android 0.5.0/code 6 passed JVM tests, build and lint; two emulator instrumentation
tests verified route rejection/window identity and the native Box screen rendering
the deployed Bot desktop. No model prompt or desktop click/key action was sent.

Evidence: `.runtime/tests/full-remote-gateway` and the Android checkout's
`.runtime/remote-box-test.log` / `.runtime/remote-box-evidence.json`. Forwarding
contracts do not establish end-to-end Mac local-exec, WebAuthn, cookie approvals,
voice or new external inference. The optional macOS network-egress tunnel remains
disabled in HTTPS mode; it is not exposed as an arbitrary public port.
