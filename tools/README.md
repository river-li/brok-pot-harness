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
| [triage.py](triage.py) | Bounded read-only issue, CI, diagnostics, and verification-gap report |
| [test_triage.py](test_triage.py) | Offline privacy, deduplication, regression, and follow-up tests |

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

## Issue and regression triage

Run `npm run triage:dry-run` to read up to 100 open issues and the 50 most recent workflow runs through GitHub CLI.
The report is written to `.runtime/triage/report.md`; it does not create issues, comments, labels, or status changes.
Use `npm run triage:dry-run -- --output -` to print it, or place sanitized per-run excerpts in
`.runtime/triage/sanitized-input` and pass `--diagnostics-dir .runtime/triage/sanitized-input`
(files are named `<run-id>.txt`, capped at 64 KiB each). The report omits issue titles,
bodies, reporters, raw diagnostics, and log excerpts. It groups repeated failures by a stable workflow/job and
allow-listed diagnostic signature, then suppresses groups already carrying that exact marker.

The report is a review queue. Compare unmarked user issues manually before filing a proposal; follow-up details and
the weekly ownership cadence are in [Issue triage](../docs/wiki/Issue-Triage.md). Offline JSON snapshots are
available for tests and review without contacting GitHub. Run the offline fixture suite with npm run test:triage.

[Source recovery](../docs/wiki/Source-Recovery.md) · [Maintenance rules](AGENTS.md)
