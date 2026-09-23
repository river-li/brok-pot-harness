# Repository tools

Release recovery and documentation publishing utilities. Daily runtime builds use `npm run build` and
[runtime/tools](../runtime/tools/README.md).

| Tool | Responsibility |
| --- | --- |
| [recover-bundles.py](recover-bundles.py) | Identify release boundaries and extract JS/MJS/CJS modules |
| [recover-native.py](recover-native.py) | Export a clean recovery preserving the native layout |
| [recovery-impact.py](recovery-impact.py) | Read-only source navigation, diff impact, and recovery-integrity checks |
| [test_recovery.py](test_recovery.py) | Recovery boundary and mapping tests |
| [test_recovery_impact.py](test_recovery_impact.py) | Manifest navigation, impact, marker, and guardrail tests |
| [export-wiki.py](export-wiki.py) | Validate English documentation and export native GitHub Wiki pages |
| [test_wiki.py](test_wiki.py) | Wiki navigation, media, source links, and validation tests |
| [check-guidance.py](check-guidance.py) | Ensure README-declared maintained source components have scoped AGENTS.md guidance |

## Clean source recovery

```sh
npm run recover
npm run test:recovery
```

Default output is `.runtime/recovered-clean`; an existing destination is rejected.
Use `npm run recover -- --output .runtime/recovered-review` for another destination.
Recovery does not overwrite maintained source and is not an application upgrade/deployment command.

## Navigate fragments and review a diff

The read-only navigator follows `reconstruction-manifest.json` from a maintained path, a symbol, or a byte offset in an immutable `sand-host` bundle:

```sh
npm run recovery:map -- --source packages/grok-bot-harness/src/runner/sand-agent-runner.ts
npm run recovery:map -- --symbol SandAgentRunner
npm run recovery:map -- --artifact host-main.cjs --offset 25087222
```

Offsets are zero-based UTF-8 byte positions in the release bundle named by the manifest. Rebuilt bundle offsets can move when maintained fragments change. Symbol search is lexical, so matches can occur in comments or strings.

Review the current worktree diff against `HEAD` (including untracked, non-ignored files), or provide another Git base:

```sh
npm run recovery:impact
npm run recovery:impact -- --base origin/main
npm run recovery:check
```

Impact output lists rebuilt artifacts for both profiles, mapped ranges, adjacent bundle fragments, same-directory modules to inspect for interfaces, and relevant checks. Adjacent files are navigation context, not a dependency graph. `check` validates fragment marker counts/order and manifest bundle hashes; when `.runtime/build` exists, it compares built bundles to `build-manifest.json`, copied release files to `sand-host`, and the complete local `node_modules` tree to the four WebFetch runtime dependency sources. Unknown packages and files fail the check. Use `npm run recovery:check -- --source PATH` for a focused marker check without full bundle/build verification.

Possible standalone imports in recovered fragments are a lexical advisory only. The check never fails for an import candidate because comments, strings, or retained syntax may look like imports.

## Documentation

```sh
npm run docs:check
npm run docs:wiki
```

`docs:check` validates Wiki links and checks source component guidance under
`src/`, `packages/`, `dune/`, `reconstruction/`, `runtime/`, and `tools/`.
It prunes installed dependencies and generated/cache directories before
walking; maintained package `dist/` source remains in scope.
The [Development guide](../docs/wiki/Development.md#scoped-guidance-coverage)
defines which directories the check treats as components.

The Wiki exporter writes `.runtime/wiki` and performs no network writes.
See [Publishing](../docs/wiki/Publishing.md) for prerequisites and the separate GitHub Wiki repository workflow.

[Source recovery](../docs/wiki/Source-Recovery.md) · [Maintenance rules](AGENTS.md)
