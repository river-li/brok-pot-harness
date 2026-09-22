# Reconstruction support source

Not every release fragment maps uniquely to an ordinary module file. This tree holds bundle-specific variants,
standalone scripts, and retained resources that rebuild alongside `src`, `packages`, and `dune`.

| Directory | Purpose |
| --- | --- |
| [variants](variants) | Different versions of the same logical module across bundles |
| [standalone](standalone) | Independently shipped scripts, including Box scripts |
| [vendor](vendor) | Required release resources such as the PDF worker |

Use [reconstruction-manifest.json](../reconstruction-manifest.json) to locate the exact mapping.
Do not mechanically merge variants or edit immutable `sand-host` to implement changes.
`runtime/tools/build-bundles.py` consumes these files for `.runtime/build`.

[Source and build model](../docs/wiki/Source-Recovery.md) · [Extraction tools](../tools/README.md)
