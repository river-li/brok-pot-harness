# Repository tools

Release recovery and documentation publishing utilities. Daily runtime builds use `npm run build` and
[runtime/tools](../runtime/tools/README.md).

| Tool | Responsibility |
| --- | --- |
| [recover-bundles.py](recover-bundles.py) | Identify release boundaries and extract JS/MJS/CJS modules |
| [recover-native.py](recover-native.py) | Export a clean recovery preserving the native layout |
| [test_recovery.py](test_recovery.py) | Recovery boundary and mapping tests |
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
