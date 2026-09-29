# Firecracker maintenance

This directory owns the dedicated guest preparation, host network/Jailer units,
inference relay and guest Bot installation described in README.md.

- Preserve container root inside Box. Treat the whole guest as untrusted to the
  Linux server; do not claim Host/Box separation within this guest.
- Keep all guest state in its dedicated virtual disk on the selected mounted
  volume. Never format a physical volume, reuse unrelated data or overwrite an
  existing guest image. Mount a guest disk only while the VM is stopped.
- Use Jailer with the pinned verified binary, unique unprivileged UID, scoped
  namespaces, default seccomp and resource limits. Keep management paths private.
  Preserve descriptor-relative, no-follow cleanup of named transient device
  nodes and request guest shutdown before terminating the VMM. Never recursively
  remove a jail-controlled directory or follow its links as host root.
- Firewall edits must target only the named deployment interfaces/tables and
  exact scoped rules. Never flush or replace the host's global firewall policies,
  and never start/stop/update another Docker stack or its LiteLLM service.
- No master/provider keys in guests, argv, logs or source. The inference relay
  has a host-only virtual key via LoadCredential and a separate guest token.
  Preserve pre-thread connection caps, request limits, fixed upstream, disabled
  redirects, strict model/field/function-tool validation and inline-only images.
- Spending quotas are an operator choice; do not silently add them. Network and
  process resource constraints remain security boundaries even with no API quota.
- Verify actual KVM, network denials, root tool execution and service readiness
  for a deployment claim. Offline contracts do not prove a running microVM or
  external inference. Retain only non-secret diagnostics under .runtime/tests.
- Public ingress is shared by desktop and mobile clients. Require trusted HTTPS,
  pre-authentication, fixed loopback upstreams, a disabled Caddy admin API, private
  credentials, bounded resources and automatic certificate renewal. Preserve
  original Host approvals on execution channels. Display capabilities must expire,
  never authorize Host RPC, and require the exact public Origin on WebSockets.
  Never put the operator token in display URLs or log display capabilities.
  Gateway token rotation must refresh the ingress token and invalidate sessions.

- Deployment addresses, guest MAC, model selections, upstream origins and secret
  values belong only in private target-side configuration. Network scripts must
  validate root-owned `network.json` before making changes. Never embed a running
  installation's network or credential values in source, tests or release assets.
