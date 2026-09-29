# Remote server security review

Review date: **2026-09-27**. Source base:
`3f02438b4f722c264921654de4265f600af10c24`, plus the uncommitted hardening changes
described here. Host baseline remains bfe1879; review target is the local-profile
server reached through SSH forwarding. This is a source review with targeted
reproductions, not a penetration-test certification. The subsequent private
microVM deployment is described separately below.

## Deployment decision

**Do not expose the raw stack publicly or as a multi-user service, or treat Box as a
security boundary for hostile code.** Host and tools share a root-capable
container, processes, network and writable state. The patches below reduce
specific attack paths but do not establish isolation between model-directed
execution and Host credentials/approvals.

For a single trusted operator, restrict a trial deployment to a dedicated VM,
SSH-only access, Docker Engine >=28, no unrelated workloads or credentials,
limited provider credentials, backups, and explicit outbound-network controls.
Such a trial still accepts the shared trust-domain risk. An Internet-facing
service or execution of untrusted workloads needs the isolation work below
before deployment.

## Findings and disposition

| Priority | Finding and attack prerequisite | Disposition |
| --- | --- | --- |
| P1 | Box execution and Host share privileges. Model-directed shell/plugin execution can read sibling process environments and manipulate Host data; it does not require a container escape. | **Open architecture blocker.** A private pinned-image fixture confirmed UID 0 could read a synthetic key from a sibling process via `/proc`. No real keys were accessed. |
| P1 | Host WebFetch accepts private/link-local destinations, including redirects from an approved public URL; GET-readable internal services or metadata can be exposed to the model. | **Fixed in the adapter.** Public-address policy applies to literals, every redirect, and the exact DNS answers used by new sockets. Mixed private/public DNS answers are rejected. No pooled sockets or preflight/second-lookup race. Private fixture access is code-only and off by default. |
| P1 | Primary noVNC accepts unauthenticated display connections; fork tokens are numeric routing identifiers. A malicious web page can attempt a cross-origin WebSocket to a local SSH forward without a Gateway token. Browser private-network policy may independently prevent some attempts. | **Browser attack path fixed.** Both display proxies require matching loopback Host and HTTP Origin, rejecting absent/opaque origins and DNS-rebinding names. Real upstream and guarded handshakes were compared in the pinned image. **Local processes and network peers remain trusted**: they can forge Origin. This is not display authentication. |
| P1 | Docker <28 can expose loopback-published ports to peers on the same L2 network, undermining the documented SSH boundary. | **Startup gate added.** Server start/update/token rotation reject old, missing or unverifiable daemon versions before publishing ports. Existing running deployments require an operator upgrade/restart; the patch cannot alter their daemon. |
| P2 | Attachment media checks use lexical paths, permitting symlinks outside permitted storage; upload parts can follow symlinks/hardlinks and overwrite a target. Requires media-directory write access. | **Fixed for stable filesystem paths.** Canonical containment anchors media to Host storage. Upload parts refuse symlinks and non-regular/multiply-linked files before truncation. Same-UID/root concurrent directory replacement remains outside this guarantee. |
| P3 | Anonymous `/health` reveals active Bot ID, approval/busy state and process details. | **Fixed when auth is configured.** Anonymous requests return only `{ok:true}`; authenticated diagnostics remain available. |

The Docker requirement follows [Docker's published-port security documentation](https://docs.docker.com/engine/network/port-publishing/).
Source entry points are [Compose](../../runtime/compose.yaml),
[Box startup](../../runtime/box-entrypoint.sh), [server launcher](../../runtime/server.cjs),
[display guard](../../runtime/box-websockify.py),
[WebFetch](../../packages/grok-bot-harness/src/local/web-fetch.ts),
[network policy](../../packages/grok-bot-harness/src/local/web-fetch-network.ts),
[attachments](../../src/host/extensions/attachments/attachments-service.ts),
and [Gateway](../../src/host/gateway-server.ts).

## Remaining work before stronger deployment claims

1. Separate Host from Box at the process/container boundary. Do not mount Host
   state, approval stores, provider keys or Gateway credentials into execution
   containers. Use narrowly scoped authenticated execution RPC, per-workspace
   storage, and a separate restricted UID. Preserve existing approvals; hiding
   environment variables or protecting only the Read tool is insufficient.
2. Isolate the execution daemon and display ports from search/speech and other
   containers. The pinned image uses fixed `local` / `local-pty` execution
   credentials and numeric fork routes. A compromised service on the shared
   Compose network can attack those endpoints. They are not published directly
   by this Compose file, but unpublished ports are still reachable on that
   network. Add authenticated display access if local OS users are untrusted.
3. Enforce egress policy outside the tool process: deny cloud metadata, host
   services, private networks and unrelated workloads except required explicit
   destinations. WebFetch's new policy does not constrain shell, browser, MCP or
   plugins. Public-IP infrastructure reachable through custom routing is also
   outside an IP-classification policy. Keep model endpoints on HTTPS unless
   using a deliberately protected private transport.
4. Add deployment-specific CPU, memory, PID and disk limits. Current Compose
   does not provide per-Bot quotas or tenant separation. Approved commands can
   exhaust resources, and a Gateway credential grants full operator access.
5. Scan the complete release and pinned image, including retained bundled JS,
   Python/native libraries and browser binaries, against current advisories.
   Root/runtime npm lockfile audits do not inventory those components. Rebuild
   and test signed release artifacts after these source changes; none were
   published by this review.

## Existing controls inspected

- Gateway bearer comparison uses a timing-safe operation; protected HTTP routes
  authenticate before command execution, and browser Origin requests are denied.
- Remote desktop URL validation permits loopback SSH endpoints and refuses URL
  credentials/query tokens. Optional persistence uses encrypted OS storage.
- Voice credential exchange requires authentication; call tickets are bounded
  and one-use. Existing local-computer and Auto-review approval code was retained.
- Default server port publication is loopback; no Docker socket, privileged mode
  or host namespace is requested by the Compose file. These do not isolate Host
  from Box within their shared container.
- Release extraction rejects traversal, symlinks, special files and duplicate
  paths. Existing inventory/checksum and external attestation guidance remains.

No confirmed unauthenticated Gateway command bypass was found in this review.
That statement is limited to the inspected paths and tests, not every recovered
module or possible deployment configuration.

## Verification and limitations

### Private microVM deployment

The [Firecracker deployment](../../runtime/firecracker/README.md) adds an outer
boundary for the complete Host/Box stack: an unprivileged jailed VMM with seccomp,
PID/network namespaces, CPU/memory/task/disk limits, and host-enforced egress
filtering. The guest retains root-capable Box execution. Host/Box separation
inside the guest remains unresolved; this deployment is for a single trusted
operator through SSH, not unrelated tenants.

At the operator's subsequent request for Android access, an opt-in Caddy ingress
adds trusted public-IP HTTPS. It independently checks the Gateway bearer before
forwarding only API/SSE requests to the loopback Gateway; display and execution
endpoints remain private. It disables the admin API, protects credential files,
bounds resources and automatically renews short-lived certificates. This extends
the transport boundary for the same trusted operator; it does not add tenant
isolation or make the raw Gateway/display safe for public exposure. Token
rotation must refresh both the Gateway and ingress configuration.

The inference relay exposes only the selected model's Responses API and model
listing, rejects provider overrides, remote tools and remote image URLs, and
retains the upstream virtual key outside the guest. The operator explicitly
requested no spending/token/request-rate quotas. Bounded transport connections
and process resources remain enabled. These controls do not make arbitrary
public Internet access or model-directed actions trustworthy.

Firecracker/Jailer 1.17.0 booted a guest on the deployment server. Host kernel
7.0 and guest kernel 6.8 are outside the upstream tested-kernel matrix; successful
local verification is not upstream certification. See
[Verification](Verification.md) for the recorded live scope.

### Source regression evidence

The regression suite uses synthetic data and private fixtures; no production
state, model requests or credentials were used. An independent reviewer checked
the patch and reran the WebFetch, attachment, health, server and Origin contracts.
New attachment and health tests are included in `test:remote-contracts`; Origin
policy tests are discovered by `test:runtime-build`.

- `npm run build -- --profile local`, `npm run check:local`.
- `npm audit --json` and `npm audit --prefix runtime --json`: zero reported
  advisories for the two npm dependency inventories, including dev dependencies.
  Retained vendor bundles and image contents are not covered by that result.
- `npm run test:web-fetch`: literal/DNS private destinations, rebinding response,
  redirect rejection, decompression cap, timeout, cancellation and normal text.
- `npm run test:remote-contracts`: server/version gate, client/auth/storage,
  attachment symlink/hardlink boundaries and anonymous health behavior.
- `npm run test:runtime-build`, `npm run check:syntax`, `npm run docs:check`,
  `git diff --check`.
- `runtime/tests/display-security-live.py` in the digest-pinned Box with
  `--network none` and only `runtime/` mounted read-only at `/review`: a dummy RFB
  service verifies primary/fork same-origin success and hostile-origin refusal,
  compared with the unmodified upstream proxy. It does not render Electron UI.

The original local test Docker Engine is **24.0.2**. Isolated, network-disabled image
tests ran, but a full server launch under the new >=28 gate was intentionally
not attempted on that Engine. The later microVM uses a current Docker daemon;
its deployment checks do not establish complete desktop integration. Previous successful
live-server evidence in [Verification](Verification.md) predates these changes
and is not evidence of this patch's full end-to-end behavior.

---
[Remote server](Remote-Server.md) · [Verification](Verification.md) · [Documentation](Home.md)
