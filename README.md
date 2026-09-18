# Grokbot Harness

Exported from inside Grokbot, version `2bea36a`. This repository contains the shipped `sand-host` runtime and first-party code extracted from its esbuild bundles.

## Repository layout

| Path | Contents |
| --- | --- |
| `src/host/` | Host startup, gateway, persistence, and feature extensions. |
| `src/shared/` | Shared protocols, settings, media utilities, and integrations. |
| `src/sand-eval-runner/` | Evaluation runner code. |
| `packages/` | Agent harness, MCP, shell execution, and supporting packages. |
| `dune/src/` | Host extension infrastructure, RPC, stores, and scheduling. |
| `sand-host/` | Shipped bundles, workers, box scripts, extension artifacts, and version metadata. |

## How the code was extracted

The esbuild `.cjs` bundles were split using their `// path` module markers, preserving the original paths under `src/`, `packages/`, and `dune/`. Vendor modules under `node_modules` were not extracted. Runtime artifacts remain under `sand-host/`.

The extracted files are emitted bundle code, even when their filenames end in `.ts`. They may reference symbols defined elsewhere in a bundle and are not necessarily standalone modules. Editing them does not update the shipped bundles.

## Development and validation

This snapshot does not include the original build environment: there is no root package manifest, dependency lockfile, build pipeline, or configured test suite. The host bundle references a sibling `deps/` directory that is not included. Running or rebuilding the host requires restoring the dependencies and runtime configuration.

From the repository root, use these checks to validate whitespace and bundle syntax without starting the host:

```sh
git diff --check
node --check sand-host/host-main.cjs
node --check sand-host/sand-eval-runner.cjs
```

These checks do not verify runtime behavior. Keep changes focused and document any additional validation needed for the affected component. Keep credentials and local environment files out of commits.
