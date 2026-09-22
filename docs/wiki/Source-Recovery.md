# Source recovery and builds

This repository preserves a release's module layout and maintains local adapters alongside it.
There are two source forms; understanding them prevents edits to the wrong output or damage to bundle scope.

## Two source forms

| Kind | Location | How to maintain it |
| --- | --- | --- |
| Recovered release fragments | `src/`, `dune/`, most of `packages/` | Preserve identifiers, fragment boundaries, and ordering; reassemble through the manifest |
| Standalone strict TypeScript | `packages/grok-bot-harness/src/local/` | Maintain normal imports/types and check with `tsconfig.local.json` |

Recovered `.ts` files may still contain emitted JavaScript. Most package `dist/*.js` files are maintained source here,
not disposable compiler output. Original types and imports were erased and cannot be recovered completely from the bundles.
These packages are not published as independently installable/buildable npm workspaces. Build at the repository root.

## From source to runtime

```mermaid
flowchart TD
  Baseline[sand-host release baseline] --> Rebuild[build-bundles.py]
  Sources[src / packages / dune / reconstruction] --> Rebuild
  Manifest[reconstruction-manifest.json] --> Rebuild
  Local[src/local TypeScript] --> TSC[TypeScript compiler]
  TSC --> Dist[dist/local]
  Dist --> Rebuild
  Profile[build-profiles.json] --> Rebuild
  Rebuild --> Host[.runtime/build or build-original]
  Desktop[runtime desktop source + vendor assets] --> Prepare[prepare-desktop.py]
  Dist --> Prepare
  Profile --> Prepare
  Prepare --> UI[.runtime/desktop or desktop-original]
```

`npm run build` compiles local adapters, then reconstructs 23 release JS/MJS/CJS artifacts from manifest mappings.
`prepare:desktop` assembles desktop resources. Each profile loads its policy before application code.
See [build profile implementation](../../runtime/BUILD_PROFILES.md).

## Fragments and manifests

`// @recovered-fragment i/n` markers map to byte ranges in a bundle. A logical module can initialize in multiple fragments
or appear differently across bundles. `reconstruction/variants` preserves those differences;
`reconstruction/standalone` holds standalone scripts.

- [reconstruction-manifest.json](../../reconstruction-manifest.json): origins, fragment ranges, and clean-baseline hashes.
- `.runtime/build/build-manifest.json`: actual outputs including maintained changes.
- [sand-host](../../sand-host): immutable release baseline; do not implement features by editing it.
- [reconstruction](../../reconstruction/README.md): variants, standalone resources, and their roles.

Do not bulk-format fragments, invent missing imports, or rewrite release bytes to remove trailing blank lines.
Locate mapped source, make the change there, rebuild, and run relevant checks.

## Export a clean recovery

```sh
npm run recover
```

The default destination is `.runtime/recovered-clean`. Existing destinations are rejected and maintained source is untouched.
Choose a new directory for another export:

```sh
npm run recover -- --output .runtime/recovered-review
```

[Recovery tools](../../tools/README.md) perform extraction. [Runtime tools](../../runtime/tools/README.md) build runnable artifacts.

## Versions and provenance

Host baseline: **bfe1879**. Retained desktop resources: **0.44.0**. Current runtime Electron: **42.1.0**.
The manifest records 2,104 logical source paths; bundle variants produce more physical files.
Resource origins and SHA-256 manifests are described in [vendor](../../vendor/README.md).
These versions support traceability; feature support is described in [Verification](Verification.md).

---
[Documentation](Home.md) · [Get started](Build-Guide.md) · [Configuration](Configuration.md) · [Project](../../README.md)
