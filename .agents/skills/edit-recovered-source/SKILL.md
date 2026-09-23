---
name: edit-recovered-source
description: Make a focused change to GBH recovered bundle fragments or reconstruction variants while preserving their emitted layout. Use when the maintained source is under src, dune, packages, or reconstruction.
---

# Edit recovered source

Use this workflow only after identifying the maintained source form. [Source recovery](../../../docs/wiki/Source-Recovery.md) is authoritative for fragments, mappings, and builds; [Architecture](../../../docs/wiki/Architecture.md) explains the source boundaries.

## Inputs

- The issue or requested behavior and affected logical module, if known.
- The exact bundle/source mapping from `reconstruction-manifest.json`.
- The root and applicable scoped `AGENTS.md` plus the module README.

## Workflow

1. Classify the target as recovered bundle source, a bundle-specific `reconstruction/` variant, a standalone resource, or strict local TypeScript under `packages/grok-bot-harness/src/local/`. Use the source-specific workflow; local adapters follow normal TypeScript imports and checks.
2. For a recovered target, use the manifest to confirm every relevant occurrence and variant. Edit the maintained source path, preserving `// @recovered-fragment i/n` markers, order, generated identifiers, and nearby emitted style. Do not invent imports or bulk-format fragments.
3. Never implement a change in `.runtime/build` or `sand-host`. Builds may generate verification artifacts under `.runtime`; those outputs are not source. Keep local behavior conditional and preserve original service paths and approvals.
4. Choose checks from [Development](../../../docs/wiki/Development.md), [Source recovery](../../../docs/wiki/Source-Recovery.md), and the [runtime test guide](../../../runtime/tests/README.md). Use `npm run test:recovery` or `npm run test:runtime-build` for relevant mapping/profile contracts; build and strict checks when the change requires them.

## Evidence boundary

Fixture-driven inference demonstrates only the local path exercised by that fixture; it does not prove an external provider works. A real-provider check is separate, may incur charges, and runs only when the task explicitly authorizes it. See [Verification](../../../docs/wiki/Verification.md) and the runtime test guide.

## Safety boundaries

Follow root and scoped `AGENTS.md`. Keep edits in maintained source, preserve local/original profile behavior and action approvals, and never implement by editing `.runtime/build` or `sand-host`.

## Output to retain

Report the maintained source path and source kind, changed behavior, affected manifest occurrence(s), checks and exact outcomes, and any bundle/profile or provider behavior not verified. Keep `.runtime` outputs and `sand-host` out of the implementation diff.

## Safe dry run

This read-only lookup prints the recovered mapping for the classifier used by the Auto-review contract test:

```sh
python3 - <<'PY'
import json
from pathlib import Path

manifest = json.loads(Path("reconstruction-manifest.json").read_text())
for item in manifest["files"]:
    if item["path"] == "packages/agent/dist/sand-auto-review-classifier.js":
        print(json.dumps(item, indent=2))
        break
else:
    raise SystemExit("mapping not found")
PY
```

Use the printed occurrence paths and fragment ranges to orient a review; this lookup does not edit or validate a build.
