# Brokpot 0.5.1-preview.1

This preview brings the Linux server, macOS remote client, and Android client to
one product version. It adds the shared authenticated Host/Box gateway, isolated
Firecracker deployment tooling, external marketplace discovery, per-Bot models,
and Android Bot/group collaboration and Box screens.

Actual deployment addresses, private network assignments, model credentials and
operator environment files are not release inputs. Configure them on the target
server after installation. The upstream Host baseline remains `bfe1879` and the
retained desktop baseline remains `0.44.0`; these are provenance, not the product
release version. State format and compatibility ID are unchanged.

## Supported clients and server

- Server: Linux x86_64 (`linux/amd64`), Node.js 24.14.0, Docker Engine with
  Docker Compose v2.
- Client: macOS arm64, Electron 42.11.6. The bundle uses an ad-hoc signature
  and is not Developer ID signed or notarized.
- Android: version 0.5.1-preview.1 (code 7), signed release APK with application
  ID `app.brokpot.android`. It installs separately from earlier debug previews;
  configure the server connection in this app. Its exact source revision is
  recorded in the attested `android-source.json`.
- Product state format: `gbh-state-v1`. Updates across a different state
  format are blocked until a tested migration is provided.

The release manifest records the exact source commit, local build profile,
measured build environment, pinned external image digests, and retained
desktop provenance. `SHA256SUMS` covers the complete server package. GitHub
artifact attestations bind each candidate archive to its source revision and
the trusted candidate workflow. See
[server installation, update, rollback, and recovery](SERVER-INSTALL.md).

## Candidate and maintenance gates

The candidate workflow builds the Linux/amd64 server, macOS arm64 remote
client and signed Android APK from the pinned Android source commit. Each patch or hotfix must be a reviewed PR against current
`main`, add a regression check for the reported defect, and pass
`npm run ci:pre-pr` plus the required docs checks. That gate builds the local profile,
runs offline contracts and the runtime build tests, checks syntax, and audits
documentation. The runtime build tests verify `local` and `original` profile
selection and preservation using reconstruction fixtures; they do not claim
original-runtime integration coverage. The release packager then reconstructs
a fresh local-profile build from the candidate commit. The candidate workflow
must also pass the server's source-free install
and real-Box fixture acceptance, the arm64 client package verification, and
the dependency audit.

Promotion is a manual workflow on `main` and publishes an immutable preview
pre-release from the exact successful candidate run, attempt, source SHA, and
attested artifact bytes. Before dispatch, review both artifacts, their hashes
and attestations, the acceptance report, release notices, and state-format
compatibility. Repeat the same gates for hotfixes; do not bypass the candidate
workflow or reuse an existing tag. Stable release publishing and stable
hotfixes are not supported by the current workflow: it accepts preview
versions and always publishes as a pre-release. A stable release needs a
separately reviewed policy and promotion path, plus explicit review of
distribution notices and any state migration.

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
