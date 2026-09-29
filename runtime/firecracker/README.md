# Firecracker deployment

Run the complete local-profile Bot stack in a dedicated microVM. Box retains
container root for installing dependencies. The microVM is the boundary protecting
the Linux server; Host, Box, approvals and Gateway credentials inside it remain
one trust domain. This does not implement Host/Box separation or per-Bot tenancy.

## Components

| File | Responsibility |
| --- | --- |
| `prepare-guest.sh` | Create a new 64 GiB sparse ext4 disk, Ubuntu guest, Docker, pinned Node, management SSH identity and verified Firecracker binaries |
| `extract-kernel.py` | Extract a complete ELF kernel from an already distro-verified gzip/zstd bzImage |
| `cleanup-jail.py` | Remove only transient Jailer nodes using directory descriptors without following links, allowing repeated launches |
| `network-config.py` | Validate private, deployment-owned network configuration |
| `network-up.sh` | Dedicated network namespace, TAP/veth, source validation and host-enforced egress policy |
| `inference-proxy.py` | Bounded, authenticated Responses relay to the existing loopback LiteLLM service; only function tools and inline images |
| `install-host.sh` | Install Jailer/VM, relay and loopback SSH-forward systemd services |
| `install-bot.sh` | Verify the private deployment snapshot and start the existing server launcher inside the guest |
| `install-https.py` | Shared authenticated HTTPS Host and Box ingress for desktop/mobile clients, with an automatically renewed public-IP certificate |

This is a single-instance deployment under `/srv/gbh-firecracker`. Its dedicated
virtual disk is placed on a separately selected mounted volume, for example
`/mnt/bot-data/gbh-firecracker/rootfs.ext4`; neither the physical disk nor another
service's Docker data is formatted or reused. The scripts require an administrator
and deliberately refuse to overwrite an existing guest disk. They are not a
remote provisioning service.

## Boundaries

The guest has 4 vCPUs and 12 GiB RAM; the VMM has a 13 GiB memory ceiling, CPU and
thread limits, a dedicated unprivileged account, default Firecracker seccomp, a
Jailer chroot and a private PID/network namespace. Storage and network I/O are
rate-limited. The 64 GiB guest disk caps the guest's persistent storage growth.
Host binaries and small management files live under `/srv`; Bot images, models,
workspace and persistent state live within the disk on the selected volume.

The network uses two private point-to-point ranges supplied by root-only `network.json`;
check for conflicts before installation. Guest egress allows
public TCP 80/443 and DNS to the configured public resolvers. Private, loopback, link-local,
metadata and reserved IPv4 destinations, IPv6, and the server's public IPv4 are
blocked outside the guest. The only guest-to-host exception is the inference
relay on the deployment veth address, port 4010. The setup adds only named `gbh_fc_*` nftables tables
and narrowly scoped iptables FORWARD rules; it does not flush the host firewall
or change any other Compose stack. Revalidate reachability after host firewall
or Docker-network changes.

The relay retains a dedicated LiteLLM virtual key on the host, in a root-only
file delivered using systemd `LoadCredential`. The guest receives a separate
bearer token. Only `POST /v1/responses` and `GET /v1/models` are forwarded; model,
request fields, tool types and attachment inputs are constrained, redirects are
refused, and neither raw errors nor credentials are logged. API spending/token/
request-rate quotas are configured separately in LiteLLM; this deployment's
operator selects those quotas independently. Transport connections remain bounded for
host protection. The LiteLLM master key and provider credentials never enter the
guest.

## Preparation and installation

1. Verify usable KVM, adequate resources, a mounted data volume, unused network
   ranges and unused loopback ports 1540/6180/6181. Check the host's package-manager
   health before installing preparation tools; do not trigger unrelated pending
   kernel upgrades. Firecracker's supported-kernel matrix is narrower than all
   Linux distributions; a successful boot is not upstream certification.
2. Create root-owned mode-0600 `/srv/gbh-firecracker/network.json` outside Git.
   Supply `host_cidr` and `namespace_cidr` as distinct usable addresses in one
   private /30, `guest_cidr` and `gateway_cidr` in another non-overlapping private
   /30, two public resolver addresses in `dns_ipv4`, and a unicast `guest_mac`.
   `network-config.py` validates these values before any network mutation.
   Place the scripts under root-only `/srv/gbh-firecracker`. Run
   `prepare-guest.sh /srv/gbh-firecracker /mnt/bot-data/gbh-firecracker` through
   `unshare --mount`. It verifies the pinned Firecracker 1.17.0 archive digest
   and uses signed Ubuntu package indexes. Network/package failures must be
   diagnosed; do not rerun by deleting an existing guest disk.
3. Set the server's public IPv4 in root-owned `public-ipv4`. Provision a dedicated
   model/route-restricted LiteLLM key through its existing administration path.
   Write root-only `inference.json` with `listen_host` (the host veth address), `upstream_origin` (the existing
   loopback HTTP service origin), `model`, `upstream_key` and a new random
   `guest_token`. Do not copy a LiteLLM master key into that file or into guest
   configuration. Preserve existing LiteLLM routes and services.
4. Run `install-host.sh /mnt/bot-data/gbh-firecracker`. Jailer exposes no public
   management API. `gbh-guest` uses a dedicated key and pinned guest host key.
5. Copy an allowlisted local-profile deployment snapshot to `/opt/gbh` in the
   guest. Its `deployment-manifest.json` records each file's SHA-256, base commit
   and dirty-source status. This private snapshot is not a signed published
   release. Never copy developer `.env`, profiles, Gateway tokens or app data.
6. Write mode-0600 `/var/lib/gbh/server.env` in the guest with the selected model,
   `GROKBOT_CONTAINER_API_URL=http://RELAY_ADDRESS:4010/v1` (substitute the
   host veth address from `network-up.sh`) and the relay's guest
   token as `LITELLM_API_KEY`. Run `install-bot.sh` there. The guest server creates
   its own Gateway and search credentials.

Clients use the existing remote desktop through SSH local forwards to the Linux
server's loopback ports. Host-side `gbh-fc-forward` securely forwards these to
the guest's loopback-published services. No public Gateway or noVNC port is added.
Read the guest Gateway token only in a private terminal:

```sh
sudo gbh-guest cat /var/lib/gbh/gateway-token
```

## Android HTTPS access

The Android client requires trusted HTTPS and does not establish an SSH tunnel.
For an operator-authorized public mobile entry point, run `install-https.py` on
the deployment host after verifying public TCP 80/443 reachability and exclusive
ownership of those ports. It installs checksum-pinned Caddy 2.11.4 as a separate
unprivileged systemd service. Let's Encrypt issues a short-lived certificate for
the controlled public IPv4 in `public-ipv4`; Caddy manages renewal automatically.
IP clients may omit TLS SNI, so the policy selects that address's certificate by
default. No domain, custom CA, VPN, or client certificate bypass is required.

Caddy terminates TLS and forwards to `gbh-remote-gateway` on loopback port 1640.
The maintained `remote-gateway.cjs` authenticates the original Host RPC, SSE,
avatar, local-exec, WebAuthn and cookie-origin approval routes, keeping Host
approval logic intact. All upstreams are fixed loopback ports: 1540, 6180, 6181.
Both Android and macOS use this same entry point. Management and arbitrary ports
are not exposed.

Authenticated `POST /connection` returns the retained `vncProxy` descriptor with
primary/fork display URLs. A signed, display-only URL capability expires after
12 hours (including active sockets); gateway restart invalidates it. The browser
loads relative assets through that capability path, without persistent cookies
or the operator credential. WebSockets require the exact configured public
Origin; only then does the proxy set the fixed loopback Origin required by Box.
Upstream redirects are refused and credentials/referrers are stripped. Access
logging must remain disabled because display URLs carry credentials. Refresh
Box/reconnect the client to obtain a new capability.

Port 80 serves ACME challenges and 404 for ordinary requests. Caddy's admin API
and config persistence are disabled. Both services are unprivileged and receive
root-owned configuration through systemd `LoadCredential`. Node.js 18 or newer
must exist at `/usr/bin/node`. `--reuse-caddy` retains an already installed,
root-owned Caddy matching the pinned version when changing only configuration.

On Android, enter a name, `https://<public-ip>` as the HTTPS Gateway URL (no
`/api` suffix), and the private Gateway token. Optional encrypted token storage
uses the client's existing Android Keystore implementation. Model keys stay on
the server. This remains a single-operator deployment; the token grants operator
access, not a restricted guest account.

After rotating the guest Gateway token, immediately rerun `install-https.py` to
refresh the proxy credential and restart both ingress services, then update clients. Until
the two credentials agree, neither old nor new tokens pass both checks. Check
`systemctl status gbh-https gbh-remote-gateway`, certificate expiry and actual HTTPS authentication
after deployment or rotation. Preserve `/var/lib/gbh-https` for ACME account and
certificate state. Stop `gbh-https` to remove public mobile access without
stopping the existing SSH route. Renewals require continued public reachability.

## Operations and checks

```sh
sudo systemctl status gbh-firecracker gbh-fc-inference gbh-fc-forward
sudo gbh-guest systemctl status gbh-bot
sudo gbh-guest docker ps
```

For a clean shutdown, stop `gbh-firecracker` on the host. Its stop action asks
the guest to shut down through `systemctl reboot`; the `reboot=k` kernel setting
exits Firecracker rather than booting another guest. Stop the relay separately
when retiring the deployment. An unreachable guest may require forced VMM
termination. Keep the guest disk for recovery. Back up a
stopped guest disk; live copies are not application-consistent backups. Stop the
VM before changing or mounting its disk on the host. Updates must preserve
credentials and user state; verify a new application snapshot before replacing
`/opt/gbh`. The installed snapshot's `server:update` requires source build tools
and is not the update mechanism for this deployment.

Verification must include real KVM boot, Jailer UID/seccomp/namespaces, root
installation in the Box, gateway auth, primary/fork display Origin protection,
private/metadata/host-service denials, allowed public egress, relay routing/input
restrictions, and one bounded real model/tool round-trip. Report fixture tests
separately from external inference. Do not display production credentials while
checking containers or service configuration.

Offline relay checks: `python3 -m unittest runtime/tests/test_firecracker_proxy.py`.
They are also included in `npm run test:runtime-build`. See the
[remote-server guide](../../docs/wiki/Remote-Server.md) and
[security review](../../docs/wiki/Security-Review.md) for the inherited application
limitations.

### Multiple inference models

The private relay credential configuration may include a `models` array of allowed LiteLLM aliases. If absent, the original single `model` remains the allowlist. Both Responses requests and returned model discovery are filtered by this list; the dedicated LiteLLM virtual key must authorize the same aliases. Updating these permissions does not imply a spending quota. Per-Bot selections use the `botModelsV1` Host capability and apply to the next turn.
