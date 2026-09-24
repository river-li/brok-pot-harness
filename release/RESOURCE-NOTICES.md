# Retained resource and notice inventory

This inventory describes resources present in the preview artifacts and their
available source metadata. It does not grant distribution rights, infer terms
from hashes, or declare a blanket license for GBH or its retained upstream code.
Where metadata is missing, the terms remain unknown and require maintainer review.

## Project and retained application resources

- The repository has no root `LICENSE` file. `sand-host` and the retained Grok
  Bot desktop bundle also have no blanket license declaration in their package
  metadata. The server Host build is derived from the immutable `bfe1879`
  baseline; the desktop resources retain upstream version `0.44.0`.
- `vendor/local-resource-manifest.json` records hashes and states that those
  resources were copied from a prior local reconstruction. Its hashes identify
  bytes; they do not establish origin or permission to redistribute them.
- `vendor/desktop/import-manifest.json` records the retained desktop version,
  `app.asar` hash, and per-file hashes. The original local filesystem path is
  omitted from release artifacts.
- Retained metadata for `@anysphere/tree-chunk-napi` and `cursor-proclist` has
  no license or source repository declaration. The native
  `sand-op-launcher` and `sand-webauthn-signer` binaries also have no separate
  license notice in the retained inventory. Their redistribution terms are
  unknown from this repository.

## Notices carried in the artifacts

- The macOS app carries Electron's `LICENSE` and Chromium's
  `LICENSES.chromium.html` from the pinned Electron distribution. It also carries
  the retained desktop import hash and this resource inventory.
- The server archive carries `runtime/speech/licenses/`. The locally built
  speech image installs those files at `/usr/share/doc/gbh-speech/licenses/`.
  The model notice identifies the Kokoro model as Apache-2.0; the Kokoro ONNX
  wrapper notice is MIT.
- Package metadata declares MIT for `node-addon-api`, `node-gyp-build`,
  `tree-sitter`, `tree-sitter-bash`, `web-tree-sitter`, `piscina`, and
  `@napi-rs/canvas`. The server artifact retains package metadata and available
  notices with its built Host dependencies; the macOS app preserves Electron
  and Chromium's bundled notices. This list is not a complete rights review of
  every bundled renderer asset or transitive package.

## External container images

- Box uses `public.ecr.aws/k0i0n2g5/cursorenvironments/universal` pinned to
  `sha256:322c3a9031d61e210a05400dd74c82bbb1fdb42db315a8cf5ab39368c2f0c1c8`.
  The repository does not contain a complete image contents, notice, or terms
  inventory for that image.
- Search uses SearXNG `2026.9.19-367fb6537` at source revision
  `367fb6537c3a9fd6e54f707118a5a9e9d2252703`, pinned in Compose by digest. Its
  upstream project identifies AGPL-3.0-or-later; see the source link in
  `runtime/search/README.md`.
- The speech image is built from the pinned `python:3.12-slim-bookworm` digest
  in `runtime/speech/Dockerfile`. The release manifest records the image
  references and the archive preserves the local build inputs.

Maintainers should review these sources and terms before publishing binaries or
container images. Do not describe a SHA-256 digest as evidence of ownership or
license permission.
