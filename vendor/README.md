# Upstream resources and provenance

Required release dependencies and desktop assets live in this repository, not in another checkout or an installed app.
These directories preserve upstream files, package metadata, licenses, and import manifests, without user account state or credentials.

| Directory | Contents |
| --- | --- |
| [desktop](desktop) | Desktop 0.44.0 assets; maintained overlays live in runtime desktop-src and renderer-src |
| [deps](deps) | Linux dependencies required by the Box |
| [host-modules](host-modules) | Host dependencies, including worker and graphics support |
| [local-resource-manifest.json](local-resource-manifest.json) | SHA-256 inventory of imported resources |

The Host bfe1879 baseline lives separately in `sand-host`. Speech models install from pinned manifests into ignored
`.runtime/models`; model caches are not committed.

## Maintenance and licensing

Preserve upstream metadata, licenses, and provenance hashes. Do not reformat third-party resources for consistency.
Each resource retains its own licensing terms; this repository has no single license covering all upstream material.
Record version, origin, and digest for resource changes and verify that they load.

[Recovery and versions](../docs/wiki/Source-Recovery.md) · [Packaging](../docs/wiki/Packaging.md)
