# Repository tools

Release recovery, documentation publishing, and CI gate helpers. Daily runtime builds use `npm run build` and
[runtime/tools](../runtime/tools/README.md).

| Tool | Responsibility |
| --- | --- |
| [recover-bundles.py](recover-bundles.py) | Identify release boundaries and extract JS/MJS/CJS modules |
| [recover-native.py](recover-native.py) | Export a clean recovery preserving the native layout |
| [test_recovery.py](test_recovery.py) | Recovery boundary and mapping tests |
| [export-wiki.py](export-wiki.py) | Validate English documentation and export native GitHub Wiki pages |
| [test_wiki.py](test_wiki.py) | Wiki navigation, media, source links, and validation tests |
| [ci](ci) | Required offline gate runner and generated/runtime JavaScript syntax check |

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

The Wiki exporter writes `.runtime/wiki` and performs no network writes.
See [Publishing](../docs/wiki/Publishing.md) for prerequisites and the separate GitHub Wiki repository workflow.

The required and optional GitHub Actions lanes, check selection, and sanitized artifacts are documented in
[CI tiers](../docs/wiki/CI.md).

[Source recovery](../docs/wiki/Source-Recovery.md) · [Maintenance rules](AGENTS.md)
