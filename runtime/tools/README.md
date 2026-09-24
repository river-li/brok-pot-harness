# Build, packaging, and media tools

Use root npm scripts for normal operation. Release extraction is separate under [tools](../../tools/README.md).

| Tool | Purpose | Common command |
| --- | --- | --- |
| [build-bundles.py](build-bundles.py) | Reconstruct artifacts and insert local adapters | `npm run build` |
| [build_profile.py](build_profile.py) | Parse and generate profile policy | Called by build and prepare |
| [prepare-desktop.py](prepare-desktop.py) | Combine vendor desktop, maintained assets, adapters | `npm run prepare:desktop` |
| [import-desktop.py](import-desktop.py) | Import desktop release resources | Resource maintenance |
| [build-icons.py](build-icons.py) | Convert selected rounded artwork to PNG/ICNS | `npm run build:icons` |
| [package-macos.py](package-macos.py) | Produce the ad-hoc local or independent remote app | `npm run package:mac`; `npm run package:mac:remote` |
| [package-release.py](package-release.py) | Fresh-build and archive the local-profile Linux server with checksums and provenance | `python3 runtime/tools/package-release.py` on Linux x86_64 with Node 24.14.0 |
| [validate-preview-candidate.py](validate-preview-candidate.py) | Fail closed on a wrong, failed, unmerged, or stale Actions candidate before promotion | Called by the main-branch promotion workflow |
| [release-extract.py](../release-extract.py) | Extract a server archive while rejecting unsafe paths, duplicate members, links, and special files | Used by the installed release manager for `gbh-server update <archive>` |
| [capture-showcase.cjs](capture-showcase.cjs) | Record a real task in an isolated workspace | See recording notes |

Build outputs go to `.runtime`, icons to `assets/branding`, and publishable media to `docs/media`.
Do not package credentials or user profiles. Record only isolated data and processes owned by the capture run.

`package-macos.py` keeps separate developer and candidate modes: `npm run package:mac` builds the
checkout-aware local app, and `npm run package:mac:remote` builds the separate
**Grokbot Remote Client.app** with its URL/token connection entry and no
absolute checkout launcher descriptor. The remote app supports macOS only in
this packager. Remote mode requires the local desktop profile assembly but
does not need a local Host or Docker stack to connect. The official preview
workflow uses `npm run package:mac:remote:candidate`; only that explicit mode
requires arm64, Node 24.14.0, Electron 42.11.6, release provenance, and the
preview product version in the bundle metadata.

The supported server candidate workflow rebuilds `.runtime/build` from a clean
source commit with the explicit local profile, then produces a relocatable
`linux/amd64` archive under `.runtime/release/<version>/`. It records the actual
build host, Node, npm, Python, source commit, retained desktop hashes, external
image digests, and state format. Its checksum inventory includes the release
manifest. The workflow attests the final archive and the separately packaged
macOS arm64 Remote Client zip. The [server install guide](../../release/SERVER-INSTALL.md)
documents manual verification and operations. The candidate workflow builds
both packages on every PR and branch push, but creates cryptographic
attestations only for a push to `agent/preview-release`. It also runs a full
extracted server install and real-Box task with a deterministic Responses
fixture. After that exact source commit's PR has merged to `main`, invoke
`Promote reviewed preview release` with the candidate run ID, exact attempt,
source commit, and version. Promotion independently fetches the run, jobs,
workflow, and merged PR from GitHub; verifies each artifact's GitHub OIDC
attestation against the trusted workflow/ref/commit; validates archive
contents; then publishes those same downloaded bytes. It refuses failed or
unmerged runs and will not replace an existing release.

[Source recovery](../../docs/wiki/Source-Recovery.md) · [Packaging](../../docs/wiki/Packaging.md) · [Media](../../docs/media/README.md)
