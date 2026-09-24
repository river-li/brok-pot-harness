# Grokbot Harness 0.1.0-preview.1

This preview is the first installable self-hosted release of the recovered
GBH runtime and its independent Remote Client. The server and client share
compatibility ID `gbh-remote-v1`.

## Supported pair

- Server: Linux x86_64 (`linux/amd64`), Node.js 24.14.0, Docker Engine with
  Docker Compose v2.
- Client: macOS arm64, Electron 42.11.6. The bundle uses an ad-hoc signature
  and is not Developer ID signed or notarized.
- Product state format: `gbh-state-v1`. Updates across a different state
  format are blocked until a tested migration is provided.

The release manifest records the exact source commit, local build profile,
measured build environment, pinned external image digests, and retained
desktop provenance. `SHA256SUMS` covers the complete server package. GitHub
artifact attestations bind each candidate archive to its source revision and
the trusted candidate workflow. See
[server installation, update, rollback, and recovery](SERVER-INSTALL.md).

## Known limits

- The server needs an operator configured Responses-compatible provider; the
  release does not bundle provider credentials or guarantee external model
  availability.
- Candidate acceptance uses a deterministic Responses fixture with a real
  Box container. It does not make external inference requests.
- Only the Linux x86_64 server and macOS arm64 client pair is supported.
- Stale release-operation locks require explicit operator recovery. State
  outside the documented checkpoint roots, external symlink targets, Docker
  image storage, and model cache are outside rollback protection.
- This is not a hosted service: Gateway access is designed for loopback plus
  SSH forwarding. It does not add accounts, per-user tokens, or public HTTP.
- Distribution terms for some retained upstream and native resources remain
  unknown. See [resource notices](RESOURCE-NOTICES.md); hashes identify bytes
  but do not establish permission to redistribute them.
