# Build, packaging, and media tools

Use root npm scripts for normal operation. Release extraction is separate under [tools](../../tools/README.md).

| Tool | Purpose | Common command |
| --- | --- | --- |
| [build-bundles.py](build-bundles.py) | Reconstruct artifacts and insert local adapters | `npm run build` |
| [build_profile.py](build_profile.py) | Parse and generate profile policy | Called by build and prepare |
| [prepare-desktop.py](prepare-desktop.py) | Combine vendor desktop, maintained assets, adapters | `npm run prepare:desktop` |
| [import-desktop.py](import-desktop.py) | Import desktop release resources | Resource maintenance |
| [build-icons.py](build-icons.py) | Convert selected rounded artwork to PNG/ICNS | `npm run build:icons` |
| [package-macos.py](package-macos.py) | Produce an ad-hoc signed app | `npm run package:mac` |
| [capture-showcase.cjs](capture-showcase.cjs) | Record a real task in an isolated workspace | See recording notes |

Build outputs go to `.runtime`, icons to `assets/branding`, and publishable media to `docs/media`.
Do not package credentials or user profiles. Record only isolated data and processes owned by the capture run.

[Source recovery](../../docs/wiki/Source-Recovery.md) · [Packaging](../../docs/wiki/Packaging.md) · [Media](../../docs/media/README.md)
