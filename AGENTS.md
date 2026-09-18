# Repository Guidelines

## Project Structure & Module Organization

This repository contains an exported Grokbot Harness snapshot, with esbuild bundles unpacked into their original path structure.

- `src/host/`: host startup, gateway, persistence, and feature extensions.
- `src/shared/`: shared protocols, settings, media helpers, and Node-specific integrations.
- `src/sand-eval-runner/`: evaluation runner logic.
- `packages/`: agent, MCP, shell execution, and harness components; many contain extracted `dist/` JavaScript.
- `dune/src/`: host extension infrastructure, stores, RPC, and scheduling.
- `sand-host/`: bundled runtime entry points, workers, and box scripts. No dedicated asset or test directory is present.

Extracted `.ts` files can contain emitted JavaScript and references resolved only inside the original bundle. Treat them as inspection material unless you restore the missing module/build context.

## Build, Test, and Development Commands

No root package manifest, dependency lockfile, build scripts, or development server configuration is included. `sand-host/package.json` only declares CommonJS mode; there are no configured `npm run build` or `npm test` commands.

- `git diff --check`: check changes for whitespace errors.
- `node --check sand-host/host-main.cjs`: check host bundle syntax without executing it.
- `node --check sand-host/sand-eval-runner.cjs`: check evaluation bundle syntax.

The host bundle expects a sibling `deps/` directory that is absent from this snapshot. Local execution requires restoring its dependencies and runtime configuration. Editing extracted files does not automatically update bundled entry points.

## Coding Style & Naming Conventions

Match nearby code: two-space indentation, semicolons, double-quoted strings, camelCase functions and variables, and kebab-case filenames. Preserve existing generated identifiers where renaming could break bundle references. Keep patches focused; avoid bulk formatting extracted code. No formatter or linter configuration is included.

## Testing Guidelines

No test framework, test naming convention, or coverage threshold is established. For changes, run applicable syntax checks and document a reproducible validation procedure. Syntax checks do not establish runtime correctness. When adding executable tests, document their runner and command alongside them.

## Commit & Pull Request Guidelines

The history currently contains one commit, `Initial import: sand-host with esbuild bundles unpacked`; no broader convention is established. Use concise, imperative subjects describing the affected component. PRs should explain the behavior changed, affected paths, validation performed, and any runtime limitations. Link relevant issues and include screenshots only for visible UI changes.

## Security & Configuration

Keep credentials and local configuration out of commits. `.gitignore` excludes `.env`, `.env.*`, logs, and `node_modules/`; inspect diffs for embedded secrets before submitting.
